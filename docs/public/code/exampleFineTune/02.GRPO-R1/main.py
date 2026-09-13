"""Qwen2.5-7B GRPO（GSM8K / R1 式 XML 推理）。运行：npm run ft:grpo

需要 NVIDIA GPU + vLLM（Unsloth fast_inference）。模型见 FT_MODEL_7B。
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from paths import ensure_utf8_stdout, gsm8k_dir, model_7b

ensure_utf8_stdout()

OUTPUT_DIR = HERE / "outputs"
LORA_DIR = HERE / "grpo_saved_lora"

SYSTEM_PROMPT = """
Respond in the following format:
<reasoning>
...
</reasoning>
<answer>
...
</answer>
"""


def extract_xml_answer(text: str) -> str:
    answer = text.split("<answer>")[-1]
    answer = answer.split("</answer>")[0]
    return answer.strip()


def extract_hash_answer(text: str) -> str | None:
    if "####" not in text:
        return None
    return text.split("####")[1].strip()


def correctness_reward_func(prompts, completions, answer, **kwargs) -> list[float]:
    responses = [completion[0]["content"] for completion in completions]
    q = prompts[0][-1]["content"]
    extracted = [extract_xml_answer(r) for r in responses]
    print(
        "-" * 20,
        f"Question:\n{q}",
        f"\nAnswer:\n{answer[0]}",
        f"\nResponse:\n{responses[0]}",
        f"\nExtracted:\n{extracted[0]}",
    )
    return [2.0 if r == a else 0.0 for r, a in zip(extracted, answer)]


def int_reward_func(completions, **kwargs) -> list[float]:
    responses = [completion[0]["content"] for completion in completions]
    extracted = [extract_xml_answer(r) for r in responses]
    return [0.5 if r.isdigit() else 0.0 for r in extracted]


def strict_format_reward_func(completions, **kwargs) -> list[float]:
    pattern = r"^<reasoning>\n.*?\n</reasoning>\n<answer>\n.*?\n</answer>\n$"
    responses = [completion[0]["content"] for completion in completions]
    matches = [re.match(pattern, r) for r in responses]
    return [0.5 if match else 0.0 for match in matches]


def soft_format_reward_func(completions, **kwargs) -> list[float]:
    pattern = r"<reasoning>.*?</reasoning>\s*<answer>.*?</answer>"
    responses = [completion[0]["content"] for completion in completions]
    matches = [re.match(pattern, r) for r in responses]
    return [0.5 if match else 0.0 for match in matches]


def count_xml(text) -> float:
    count = 0.0
    if text.count("<reasoning>\n") == 1:
        count += 0.125
    if text.count("\n</reasoning>\n") == 1:
        count += 0.125
    if text.count("\n<answer>\n") == 1:
        count += 0.125
        count -= len(text.split("\n</answer>\n")[-1]) * 0.001
    if text.count("\n</answer>") == 1:
        count += 0.125
        count -= (len(text.split("\n</answer>")[-1]) - 1) * 0.001
    return count


def xmlcount_reward_func(completions, **kwargs) -> list[float]:
    contents = [completion[0]["content"] for completion in completions]
    return [count_xml(c) for c in contents]


def main() -> None:
    import unsloth  # noqa: F401
    from unsloth import FastLanguageModel
    from datasets import load_dataset
    from trl import GRPOConfig, GRPOTrainer
    from vllm import SamplingParams

    max_seq_length = 1024
    lora_rank = 32
    max_prompt_length = 256
    model_name = model_7b()
    data_path = gsm8k_dir()

    print("=== GRPO R1 ===")
    print(f"model={model_name}")
    print(f"data={data_path}")
    if not (data_path / "main").is_dir() and not data_path.is_dir():
        raise SystemExit(
            f"缺少数据集: {data_path}\n请从课盘拷贝【数据集】gsm8k 到 exampleFineTune/data/"
        )

    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=model_name,
        max_seq_length=max_seq_length,
        load_in_4bit=True,
        fast_inference=True,
        max_lora_rank=lora_rank,
        gpu_memory_utilization=0.6,
    )

    model = FastLanguageModel.get_peft_model(
        model,
        r=lora_rank,
        target_modules=[
            "q_proj",
            "k_proj",
            "v_proj",
            "o_proj",
            "gate_proj",
            "up_proj",
            "down_proj",
        ],
        lora_alpha=lora_rank,
        use_gradient_checkpointing="unsloth",
        random_state=3407,
    )

    raw = load_dataset(str(data_path), "main")["train"]
    dataset = raw.map(
        lambda x: {
            "prompt": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": x["question"]},
            ],
            "answer": extract_hash_answer(x["answer"]),
        }
    )

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    training_args = GRPOConfig(
        learning_rate=5e-6,
        adam_beta1=0.9,
        adam_beta2=0.99,
        weight_decay=0.1,
        warmup_ratio=0.1,
        lr_scheduler_type="cosine",
        optim="paged_adamw_8bit",
        logging_steps=1,
        per_device_train_batch_size=1,
        gradient_accumulation_steps=1,
        num_generations=6,
        max_prompt_length=max_prompt_length,
        max_completion_length=max_seq_length - max_prompt_length,
        max_steps=250,
        save_steps=250,
        max_grad_norm=0.1,
        report_to="none",
        output_dir=str(OUTPUT_DIR),
    )

    trainer = GRPOTrainer(
        model=model,
        processing_class=tokenizer,
        reward_funcs=[
            xmlcount_reward_func,
            soft_format_reward_func,
            strict_format_reward_func,
            int_reward_func,
            correctness_reward_func,
        ],
        args=training_args,
        train_dataset=dataset,
    )
    trainer.train()

    LORA_DIR.mkdir(parents=True, exist_ok=True)
    model.save_lora(str(LORA_DIR))
    print(f"LoRA saved → {LORA_DIR}")

    text = tokenizer.apply_chat_template(
        [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": "Calculate pi."},
        ],
        tokenize=False,
        add_generation_prompt=True,
    )
    sampling_params = SamplingParams(temperature=0.8, top_p=0.95, max_tokens=2048)
    output = model.fast_generate(
        text,
        sampling_params=sampling_params,
        lora_request=model.load_lora(str(LORA_DIR)),
    )[0].outputs[0].text
    print(output)


if __name__ == "__main__":
    main()
