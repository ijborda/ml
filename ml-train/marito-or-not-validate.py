from __future__ import annotations

import shutil
from pathlib import Path
from typing import Any, Dict, List

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
    load_learner,
    PILImage
)


PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODEL_NAME = "marito-or-not"
SOURCE_DATA_DIR = PROJECT_ROOT / "data" / f"{MODEL_NAME}-validate"
RESIZED_DATA_DIR = PROJECT_ROOT / "data" / f"{MODEL_NAME}-validate-resized"
MODEL_PATH = PROJECT_ROOT / "ml-api" / "models" / f"{MODEL_NAME}.pkl"

def prepare_dataset() -> Path:
    if not SOURCE_DATA_DIR.exists():
        raise FileNotFoundError(
            "Validation data directory not found. "
            "Put your images under data/marito-or-not-validate/marito and data/marito-or-not-validate/not-marito before running this script."
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

def do_validation():
  category_dirs = [Path(path) for path in RESIZED_DATA_DIR.iterdir() if path.is_dir()]
  if not category_dirs:
      raise FileNotFoundError(f"No class folders found in {RESIZED_DATA_DIR}.")
    
  learn = load_learner(MODEL_PATH)
  
  for category_dir in sorted(category_dirs):
    correct_label = category_dir.name
    images = [img for img in category_dir.iterdir() if img.is_file()]
    for image in images:
      prediction = learn.predict(PILImage.create(image))
      predicted_label, predicted_index, probabilities = prediction
      is_correct = predicted_label == correct_label
      result = {
        "image": image,
        "predicted_label": predicted_label,
        "predicted_index": predicted_index,
        "correct_label": correct_label,
        "is_correct": is_correct,
        "probabilities": probabilities,
        
      }
      print(result)

def main() -> None:
    # Preprocess images
    prepare_dataset()
  
    # Do validation
    do_validation()

if __name__ == "__main__":
    main()
