import importlib
import os
from pathlib import Path
from typing import Any, Dict

from fastai.learner import load_learner

MODEL_ROOT = Path(os.getenv("MODEL_ROOT", "/app/models"))
_MODEL_CACHE: Dict[str, Any] = {}


def _load_model(model_name: str) -> Any:
    model_path = MODEL_ROOT / f"{model_name}.pkl"
    if not model_path.exists():
        raise FileNotFoundError(f"Model file not found: {model_path}")

    return load_learner(model_path)


def get_model_registry() -> Dict[str, Any]:
    for file_path in sorted(MODEL_ROOT.glob("*.pkl")):
        model_name = file_path.stem
        if model_name not in _MODEL_CACHE:
            _MODEL_CACHE[model_name] = _load_model(model_name)

    return _MODEL_CACHE.copy()


def get_model(model_name: str) -> Any:
    registry = get_model_registry()
    if model_name not in registry:
        raise KeyError(model_name)
    return registry[model_name]
