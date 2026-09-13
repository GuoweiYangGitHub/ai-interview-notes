"""Qwen2.5-7B Alpaca SFT（Unsloth + LoRA）。运行：npm run ft:sft

需要 NVIDIA GPU。模型路径见 FT_MODEL_7B / paths.model_7b()。
"""
from __future__ import annotations

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from paths import alpaca_dir, ensure_utf8_stdout, model_7b

ensure_utf8_stdout()

OUTPUT_DIR = HERE / "outputs"
LORA_DIR = HERE / "lora_model"


def main() -> None:
    from unsloth import FastLanguageModel, is_bfloat16_supported
    import torch
    from datasets import load_dataset
    from trl import SFTTrainer
    from transformers import TrainingArguments, TextStreamer

    max_seq_length = 2048
    dtype = None
    load_in_4bit = True
    model_name = model_7b()
    data_path = alpaca_dir()

    print("=== Alpaca SFT ===")
    print(f"model={model_name}")
    print(f"data={data_path}")
    if not data_path.is_dir():
        raise SystemExit(
            f"缺少数据集: {data_path}\n请从课盘拷贝【数据集】alpaca-cleaned 到 exampleFineTune/data/"
        )

    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=model_name,
        max_seq_length=max_seq_length,
        dtype=dtype,
        load_in_4bit=load_in_4bit,
    )

    model = FastLanguageModel.get_peft_model(
        model,
        r=16,
        target_modules=[
            "q_proj",
            "k_proj",
            "v_proj",
            "o_proj",
            "gate_proj",
            "up_proj",
            "down_proj",
        ],
        lora_alpha=16,
        lora_dropout=0,
        bias="none",
        use_gradient_checkpointing="unsloth",
        random_state=3407,
        use_rslora=False,
        loftq_config=None,
    )

    alpaca_prompt = """Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

### Instruction:
{}

### Input:
{}

### Response:
{}"""

    eos = tokenizer.eos_token

    def formatting_prompts_func(examples):
        texts = []
        for instruction, inp, output in zip(
            examples["instruction"], examples["input"], examples["output"]
        ):
            texts.append(alpaca_prompt.format(instruction, inp, output) + eos)
        return {"text": texts}

    dataset = load_dataset(str(data_path), split="train")
    dataset = dataset.map(formatting_prompts_func, batched=True)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    training_args = TrainingArguments(
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        warmup_steps=5,
        max_steps=60,
        learning_rate=2e-4,
        fp16=not is_bfloat16_supported(),
        bf16=is_bfloat16_supported(),
        logging_steps=1,
        optim="adamw_8bit",
        weight_decay=0.01,
        lr_scheduler_type="linear",
        seed=3407,
        output_dir=str(OUTPUT_DIR),
        report_to="none",
    )

    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=dataset,
        dataset_text_field="text",
        max_seq_length=max_seq_length,
        dataset_num_proc=2,
        packing=False,
        args=training_args,
    )

    gpu_stats = torch.cuda.get_device_properties(0)
    start_gpu_memory = round(torch.cuda.max_memory_reserved() / 1024**3, 3)
    max_memory = round(gpu_stats.total_memory / 1024**3, 3)
    print(f"GPU = {gpu_stats.name}. Max memory = {max_memory} GB.")
    print(f"{start_gpu_memory} GB reserved.")

    trainer_stats = trainer.train()
    used_memory = round(torch.cuda.max_memory_reserved() / 1024**3, 3)
    print(f"train_runtime={trainer_stats.metrics['train_runtime']:.1f}s")
    print(f"peak_reserved={used_memory} GB")

    FastLanguageModel.for_inference(model)
    inputs = tokenizer(
        [
            alpaca_prompt.format(
                "Continue the fibonnaci sequence.",
                "1, 1, 2, 3, 5, 8",
                "",
            )
        ],
        return_tensors="pt",
    ).to("cuda")
    outputs = model.generate(**inputs, max_new_tokens=64, use_cache=True)
    print(tokenizer.batch_decode(outputs))

    text_streamer = TextStreamer(tokenizer)
    inputs = tokenizer(
        [alpaca_prompt.format("What is a famous tall tower in Paris?", "", "")],
        return_tensors="pt",
    ).to("cuda")
    _ = model.generate(**inputs, streamer=text_streamer, max_new_tokens=128)

    LORA_DIR.mkdir(parents=True, exist_ok=True)
    model.save_pretrained(str(LORA_DIR))
    tokenizer.save_pretrained(str(LORA_DIR))
    print(f"LoRA saved → {LORA_DIR}")


if __name__ == "__main__":
    main()
