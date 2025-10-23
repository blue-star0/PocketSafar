"""Forecasting Models for PocketSafar - LSTM/Prophet for Trip Prediction"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import logging

try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except ImportError:
    PROPHET_AVAILABLE = False
    
router = APIRouter(prefix="/api/forecast", tags=["forecast"])
logger = logging.getLogger(__name__)

class ForecastRequest(BaseModel):
    user_id: str
    data_points: List[dict]
    forecast_days: int = 7

@router.post("/predict-trips")
async def predict_future_trips(request: ForecastRequest):
    """Forecast future trip patterns using time series analysis"""
    try:
        if not PROPHET_AVAILABLE:
            # Fallback: Simple moving average
            values = [dp['value'] for dp in request.data_points]
            avg = np.mean(values[-7:]) if len(values) >= 7 else np.mean(values)
            
            predictions = []
            last_date = datetime.fromisoformat(request.data_points[-1]['date'])
            for i in range(1, request.forecast_days + 1):
                pred_date = last_date + timedelta(days=i)
                predictions.append({
                    "date": pred_date.isoformat(),
                    "predicted_value": float(avg),
                    "confidence": "low"
                })
            
            return {"predictions": predictions, "method": "moving_average"}
        
        # Prophet-based forecasting
        df = pd.DataFrame([
            {"ds": pd.to_datetime(dp['date']), "y": dp['value']}
            for dp in request.data_points
        ])
        
        model = Prophet(daily_seasonality=True)
        model.fit(df)
        
        future = model.make_future_dataframe(periods=request.forecast_days)
        forecast = model.predict(future)
        
        predictions = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(request.forecast_days)
        
        return {"predictions": predictions.to_dict('records'), "method": "prophet"}
        
    except Exception as e:
        logger.error(f"Forecasting error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict-demand")
async def predict_travel_demand(location: str, days_ahead: int = 30):
    """Predict travel demand for government analytics"""
    return {"location": location, "forecast_days": days_ahead, "status": "TODO: implement with historical data"}
