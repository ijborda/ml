import importlib
import os
import pickle
from pathlib import Path
from typing import Any, Dict

import joblib

MODEL_ROOT = Path(os.getenv("MODEL_ROOT", "/app/models"))


def _load_model(model_name: str) -> Any:
    model_path = MODEL_ROOT / f"{model_name}.pkl"
    if not model_path.exists():
        raise FileNotFoundError(f"Model file not found: {model_path}")

    try:
        with model_path.open("rb") as handle:
            return pickle.load(handle)
    except (pickle.PickleError, EOFError, AttributeError, ImportError, IndexError, ValueError):
        return joblib.load(model_path)


def get_model_registry() -> Dict[str, Any]:
    registry: Dict[str, Any] = {}

    for file_path in sorted(MODEL_ROOT.glob("*.pkl")):
        model_name = file_path.stem
        registry[model_name] = _load_model(model_name)

    return registry


def get_model(model_name: str) -> Any:
    registry = get_model_registry()
    if model_name not in registry:
        raise KeyError(model_name)
    return registry[model_name]
