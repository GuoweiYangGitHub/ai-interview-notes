"""Qwen2.5-VL-3B 里程表视觉微调。运行：npm run ft:vl

需要 NVIDIA GPU。模型见 FT_MODEL_VL；数据为本目录 xlsx + images/。
"""
from __future__ import annotations

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from paths import ensure_utf8_stdout, model_vl

ensure_utf8_stdout()

EXCEL = HERE / "qwen-vl-train.xlsx"
IMAGES = HERE / "images"
OUTPUT_DIR = HERE / "outputs"
LORA_DIR = HERE / "car_insurance_lora_model"


def resolve_image_path(raw: str) -> Path | None:
    """Excel 里可能是 images/xxx.jpg 或绝对路径，统一落到本目录。"""
    if raw is None:
        return None
    s = str(raw).strip()
    if not s:
        return None
    p = Path(s)
    candidates = [
        p if p.is_absolute() else HERE / p,
        IMAGES / Path(s).name,
        HERE / "images" / Path(s).name,
    ]
    for c in candidates:
        if c.is_file():
            return c
    return None


def main() -> None:
    import pandas as pd
    import torch
    from PIL import Image
    from unsloth import FastVisionModel
    from unsloth.trainer import UnslothVisionDataCollator
    from trl import SFTTrainer, SFTConfig
    from transformers import TextStreamer

    model_name = model_vl()
    print("=== Qwen-VL 微调 ===")
    print(f"model={model_name}")
    print(f"excel={EXCEL}")

    if not EXCEL.is_file():
        raise SystemExit(f"缺少 {EXCEL}")

    print("加载模型…")
    model, tokenizer = FastVisionModel.from_pretrained(
        model_name,
        use_gradient_checkpointing="unsloth",
    )
    model = FastVisionModel.get_peft_model(
        model,
        finetune_vision_layers=True,
        finetune_language_layers=True,
        finetune_attention_modules=True,
        finetune_mlp_modules=True,
        r=16,
        lora_alpha=16,
        lora_dropout=0,
        bias="none",
        random_state=3407,
        use_rslora=False,
        loftq_config=None,
    )

    df = pd.read_excel(EXCEL)
    print(f"列: {list(df.columns)} shape={df.shape}")

    converted = []
    for idx, row in df.iterrows():
        img_path = resolve_image_path(row.get("image"))
        prompt = row.get("prompt")
        response = row.get("response")
        if img_path is None:
            print(f"跳过样本 {idx}: 图片不存在 ({row.get('image')})")
            continue
        try:
            image = Image.open(img_path).convert("RGB")
            converted.append(
                {
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": prompt},
                                {"type": "image", "image": image},
                            ],
                        },
                        {
                            "role": "assistant",
                            "content": [{"type": "text", "text": response}],
                        },
                    ]
                }
            )
            print(f"样本 {idx + 1}: {img_path.name}")
        except Exception as exc:
            print(f"样本 {idx} 失败: {exc}")

    if not converted:
        raise SystemExit("无有效训练样本，请检查 images/ 与 xlsx 路径。")
    print(f"训练样本数: {len(converted)}")

    FastVisionModel.for_inference(model)
    test_image_path = IMAGES / "1-vehicle-odometer-reading.jpg"
    if not test_image_path.is_file():
        test_image_path = resolve_image_path(str(df.iloc[0]["image"]))
    test_image = Image.open(test_image_path).convert("RGB")
    test_instruction = "你是一名汽车保险承保专家。这里有一张车辆里程表的图片。请从中提取关键信息。"
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "image"},
                {"type": "text", "text": test_instruction},
            ],
        }
    ]
    input_text = tokenizer.apply_chat_template(messages, add_generation_prompt=True)
    inputs = tokenizer(
        test_image,
        input_text,
        add_special_tokens=False,
        return_tensors="pt",
    ).to("cuda")
    text_streamer = TextStreamer(tokenizer, skip_prompt=True)
    print("训练前输出:")
    _ = model.generate(
        **inputs,
        streamer=text_streamer,
        max_new_tokens=128,
        use_cache=True,
        temperature=1.5,
        min_p=0.1,
    )

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    FastVisionModel.for_training(model)
    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        data_collator=UnslothVisionDataCollator(model, tokenizer),
        train_dataset=converted,
        args=SFTConfig(
            per_device_train_batch_size=2,
            gradient_accumulation_steps=4,
            warmup_steps=5,
            max_steps=30,
            learning_rate=2e-4,
            logging_steps=1,
            optim="adamw_8bit",
            weight_decay=0.01,
            lr_scheduler_type="linear",
            seed=3407,
            output_dir=str(OUTPUT_DIR),
            report_to="none",
            remove_unused_columns=False,
            dataset_text_field="",
            dataset_kwargs={"skip_prepare_dataset": True},
        ),
        max_seq_length=2048,
    )

    gpu_stats = torch.cuda.get_device_properties(0)
    start_gpu_memory = round(torch.cuda.max_memory_reserved() / 1024**3, 3)
    max_memory = round(gpu_stats.total_memory / 1024**3, 3)
    print(f"GPU = {gpu_stats.name}. max={max_memory} GB. reserved={start_gpu_memory} GB")

    trainer_stats = trainer.train()
    print(f"train_runtime={trainer_stats.metrics['train_runtime']:.1f}s")

    FastVisionModel.for_inference(model)
    inputs = tokenizer(
        test_image,
        input_text,
        add_special_tokens=False,
        return_tensors="pt",
    ).to("cuda")
    print("训练后输出:")
    _ = model.generate(
        **inputs,
        streamer=text_streamer,
        max_new_tokens=128,
        use_cache=True,
        temperature=1.5,
        min_p=0.1,
    )

    LORA_DIR.mkdir(parents=True, exist_ok=True)
    model.save_pretrained(str(LORA_DIR))
    tokenizer.save_pretrained(str(LORA_DIR))
    print(f"LoRA saved → {LORA_DIR}")


if __name__ == "__main__":
    main()
