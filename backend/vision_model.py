"""Vision Model for PocketSafar - CNN-based Image Processing"""

from fastapi import APIRouter, File, UploadFile, HTTPException
from typing import List, Dict, Any
import logging

try:
    import tensorflow as tf
    from tensorflow.keras.applications import MobileNetV2
    from tensorflow.keras.preprocessing import image
    from tensorflow.keras.applications.mobilenet_v2 import preprocess_input, decode_predictions
    import numpy as np
    from PIL import Image
    import io
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False

router = APIRouter(prefix="/api/vision", tags=["vision"])
logger = logging.getLogger(__name__)

_model = None

def get_model():
    global _model
    if _model is None and TF_AVAILABLE:
        _model = MobileNetV2(weights='imagenet')
    return _model

@router.post("/predict-image")
async def predict_image(file: UploadFile = File(...)):
    """Analyze uploaded travel image using CNN"""
    if not TF_AVAILABLE:
        return {"error": "TensorFlow not installed. Install with: pip install tensorflow pillow"}
    
    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents))
        img = img.resize((224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
        
        model = get_model()
        predictions = model.predict(img_array)
        decoded = decode_predictions(predictions, top=3)[0]
        
        results = [
            {"label": label, "description": desc, "confidence": float(conf)}
            for (label, desc, conf) in decoded
        ]
        
        logger.info(f"Image analyzed: {results[0]['description']}")
        return {"success": True, "predictions": results}
        
    except Exception as e:
        logger.error(f"Vision model error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/cluster-photos")
async def cluster_travel_photos(user_id: str, trip_id: str):
    """Cluster travel photos by visual similarity"""
    return {"message": "Photo clustering - TODO: implement with trip images from DB"}
