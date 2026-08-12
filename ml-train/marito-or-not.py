from __future__ import annotations

import shutil
from pathlib import Path

from fastai.vision.all import (
    CategoryBlock,
    DataBlock,
    ImageBlock,
    RandomSplitter,
    Resize,
    aug_transforms,
    error_rate,
    get_image_files,
    resize_images,
    parent_label,
    resnet18,
    verify_images,
    vision_learner,
)


PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODEL_NAME = "marito-or-not"
SOURCE_DATA_DIR = PROJECT_ROOT / "data" / MODEL_NAME
RESIZED_DATA_DIR = PROJECT_ROOT / "data" / f"{MODEL_NAME}-resized"
EXPORT_DIR = PROJECT_ROOT / "ml-api" / "models"


def prepare_dataset() -> Path:
    if not SOURCE_DATA_DIR.exists():
        raise FileNotFoundError(
            "Training data directory not found. "
            "Put your images under data/marito-or-not/marito and data/marito-or-not/not-marito before running this script."
        )

    category_dirs = [path for path in SOURCE_DATA_DIR.iterdir() if path.is_dir()]
    if not category_dirs:
        raise FileNotFoundError(f"No class folders found in {SOURCE_DATA_DIR}.")

    shutil.rmtree(RESIZED_DATA_DIR, ignore_errors=True)
    RESIZED_DATA_DIR.mkdir(parents=True, exist_ok=True)

    for category_dir in sorted(category_dirs):
        resize_images(category_dir, max_size=224, dest=RESIZED_DATA_DIR / category_dir.name)

    image_files = get_image_files(RESIZED_DATA_DIR)
    if not image_files:
        raise FileNotFoundError(f"No images found in {SOURCE_DATA_DIR}.")

    broken = verify_images(image_files)
    if broken:
        for path in broken:
            path.unlink(missing_ok=True)
        print(f"Removed {len(broken)} invalid image(s).")

    print(f"Dataset ready: {len(get_image_files(RESIZED_DATA_DIR))} valid images found.")
    return RESIZED_DATA_DIR


def build_dataloaders():
    data_dir = prepare_dataset()

    dls = DataBlock(
        blocks=(ImageBlock, CategoryBlock),
        get_items=get_image_files,
        splitter=RandomSplitter(valid_pct=0.2, seed=42),
        get_y=parent_label,
        item_tfms=Resize(224),
        batch_tfms=aug_transforms(
            size=224,
            max_warp=0.0,
            do_flip=True,
            flip_vert=False,
            max_rotate=10.0,
            max_lighting=0.2,
            max_zoom=1.1,
        ),
    )

    return dls.dataloaders(data_dir, bs=16)


def main() -> None:
    EXPORT_DIR.mkdir(parents=True, exist_ok=True)

    dls = build_dataloaders()
    print(f"Classes: {dls.vocab}")

    learn = vision_learner(dls, resnet18, metrics=error_rate)
    learn.fine_tune(5)

    export_path = EXPORT_DIR / f"{MODEL_NAME}.pkl"
    learn.export(export_path)
    print(f"Model exported to: {export_path}")


if __name__ == "__main__":
    main()
