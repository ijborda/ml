import base64
from io import BytesIO
from typing import Any, Dict, List

import numpy as np
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastai.vision.all import PILImage

from .models import get_model

router = APIRouter()


class PredictionRequest(BaseModel):
    data: List[float] | List[List[float]] | None = None
    image: Dict[str, Any] | None = None


def _prepare_image(payload: PredictionRequest) -> PILImage:
    if payload.image is None:
        raise HTTPException(status_code=400, detail="Request body must include an image payload.")

    image_data = payload.image.get("data")
    if not image_data:
        raise HTTPException(status_code=400, detail="Image payload is missing base64 data.")

    decoded = base64.b64decode(image_data)
    if not decoded:
        raise HTTPException(status_code=400, detail="Decoded image is empty.")

    return PILImage.create(BytesIO(decoded))


def _prepare_array(payload: PredictionRequest) -> np.ndarray:
    if payload.data is None:
        raise HTTPException(status_code=400, detail="Request body must include either 'data' or 'image'.")

    arr = np.asarray(payload.data, dtype=float)
    if arr.ndim == 1:
        arr = arr.reshape(1, -1)
    return arr


def _serialize_fastai_prediction(prediction: tuple[Any, Any, Any]) -> Dict[str, Any]:
    predicted_label, predicted_index, probabilities = prediction

    return {
        "prediction": int(predicted_index),
        "label": str(predicted_label),
        "probability": probabilities.tolist(),
    }


@router.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@router.get("/models")
def list_models() -> Dict[str, List[str]]:
    from .models import get_model_registry

    return {"models": sorted(get_model_registry().keys())}


@router.post("/marito-or-not")
def predict_marito_or_not(payload: PredictionRequest) -> Dict[str, Any]:
    model = get_model("marito-or-not")

    if payload.image is not None:
        image = _prepare_image(payload)
        return _serialize_fastai_prediction(model.predict(image))

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

    if payload.image is not None:
        image = _prepare_image(payload)
        return _serialize_fastai_prediction(model.predict(image))

    arr = _prepare_array(payload)
    prediction = model.predict(arr)
    result: Dict[str, Any] = {"prediction": prediction.tolist()}
    if hasattr(model, "predict_proba"):
        result["probability"] = model.predict_proba(arr).tolist()
    return result
