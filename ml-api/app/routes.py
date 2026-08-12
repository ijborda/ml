import base64
from typing import Any, Dict, List

import numpy as np
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from .models import get_model

router = APIRouter()


class PredictionRequest(BaseModel):
    data: List[float] | List[List[float]] | None = None
    image: Dict[str, Any] | None = None


def _prepare_array(payload: PredictionRequest) -> np.ndarray:
    if payload.image is not None:
        image_data = payload.image.get("data")
        if not image_data:
            raise HTTPException(status_code=400, detail="Image payload is missing base64 data.")

        decoded = base64.b64decode(image_data)
        array = np.frombuffer(decoded, dtype=np.uint8).astype(float)
        if array.size == 0:
            raise HTTPException(status_code=400, detail="Decoded image is empty.")
        return array.reshape(1, -1)

    if payload.data is None:
        raise HTTPException(status_code=400, detail="Request body must include either 'data' or 'image'.")

    arr = np.asarray(payload.data, dtype=float)
    if arr.ndim == 1:
        arr = arr.reshape(1, -1)
    return arr


@router.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@router.get("/models")
def list_models() -> Dict[str, List[str]]:
    from .models import get_model_registry

    return {"models": sorted(get_model_registry().keys())}


@router.post("/marito-or-not")
def predict_marito_or_not(payload: PredictionRequest) -> Dict[str, Any]:
    model = get_model("marito_or_not")
    arr = _prepare_array(payload)

    prediction = model.predict(arr)
    result: Dict[str, Any] = {"prediction": prediction.tolist()}
    if hasattr(model, "predict_proba"):
        result["probability"] = model.predict_proba(arr).tolist()
    return result


@router.post("/models/{model_name}")
def predict_model(model_name: str, payload: PredictionRequest) -> Dict[str, Any]:
    try:
        model = get_model(model_name)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=f"Model '{model_name}' not found.") from exc

    arr = _prepare_array(payload)
    prediction = model.predict(arr)
    result: Dict[str, Any] = {"prediction": prediction.tolist()}
    if hasattr(model, "predict_proba"):
        result["probability"] = model.predict_proba(arr).tolist()
    return result
