"""ML Pipeline Helper Functions for PocketSafar

This module provides machine learning utilities for:
- GPS data cleaning using Isolation Forest
- Activity detection based on speed
- Sentiment analysis for travel reviews
- AWS S3 cloud storage integration
"""

import numpy as np
from sklearn.ensemble import IsolationForest
from textblob import TextBlob
from typing import List, Dict, Any, Optional
import boto3
from botocore.exceptions import ClientError
import os
import logging
import json
from datetime import datetime

logger = logging.getLogger(__name__)


def clean_gps_data(route_points: List[Dict[str, Any]], contamination: float = 0.1) -> List[Dict[str, Any]]:
    """
    Clean GPS data using Isolation Forest for outlier detection.
    
    Args:
        route_points: List of GPS coordinate dictionaries with 'lat' and 'lng' keys
        contamination: Expected proportion of outliers (default: 0.1)
    
    Returns:
        Cleaned list of GPS points with outliers removed
    """
    if not route_points or len(route_points) < 2:
        return route_points
    
    try:
        # Extract coordinates
        coords = np.array([[point.get('lat', 0), point.get('lng', 0)] for point in route_points])
        
        # Train Isolation Forest
        iso_forest = IsolationForest(
            contamination=contamination,
            random_state=42,
            n_estimators=100
        )
        
        # Predict outliers (-1 for outliers, 1 for inliers)
        predictions = iso_forest.fit_predict(coords)
        
        # Filter out outliers
        cleaned_points = [point for point, pred in zip(route_points, predictions) if pred == 1]
        
        logger.info(f"GPS cleaning: {len(route_points)} -> {len(cleaned_points)} points")
        return cleaned_points
        
    except Exception as e:
        logger.error(f"GPS cleaning error: {e}")
        return route_points  # Return original on error


def detect_activity(trip_segments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Detect travel mode/activity based on speed analysis.
    
    Speed thresholds (km/h):
    - Walking: 0-6
    - Cycling: 6-20
    - Driving: 20-100
    - Train/Bus: 40-120
    - Flying: >120
    
    Args:
        trip_segments: List of trip segment dictionaries with speed or distance/time data
    
    Returns:
        Trip segments with added 'detected_activity' field
    """
    if not trip_segments:
        return trip_segments
    
    for segment in trip_segments:
        try:
            # Get or calculate speed
            speed_kmh = segment.get('speed')
            
            if speed_kmh is None:
                # Calculate speed from distance and time if available
                distance_km = segment.get('distance_km')
                duration_hours = segment.get('duration_hours')
                
                if distance_km and duration_hours and duration_hours > 0:
                    speed_kmh = distance_km / duration_hours
                else:
                    segment['detected_activity'] = 'unknown'
                    continue
            
            # Classify activity based on speed
            if speed_kmh < 6:
                activity = 'walking'
            elif speed_kmh < 20:
                activity = 'cycling'
            elif speed_kmh < 40:
                activity = 'driving'
            elif speed_kmh < 120:
                activity = 'train_or_bus'
            else:
                activity = 'flying'
            
            segment['detected_activity'] = activity
            segment['speed_kmh'] = round(speed_kmh, 2)
            
        except Exception as e:
            logger.error(f"Activity detection error for segment: {e}")
            segment['detected_activity'] = 'unknown'
    
    logger.info(f"Activity detection completed for {len(trip_segments)} segments")
    return trip_segments


def analyze_sentiment(review: str) -> Dict[str, Any]:
    """
    Analyze sentiment of travel review using TextBlob.
    
    Args:
        review: Text review to analyze
    
    Returns:
        Dictionary containing:
        - polarity: Float from -1 (negative) to 1 (positive)
        - subjectivity: Float from 0 (objective) to 1 (subjective)
        - sentiment_label: 'positive', 'neutral', or 'negative'
    """
    if not review or not isinstance(review, str):
        return {
            'polarity': 0.0,
            'subjectivity': 0.0,
            'sentiment_label': 'neutral'
        }
    
    try:
        blob = TextBlob(review)
        polarity = blob.sentiment.polarity
        subjectivity = blob.sentiment.subjectivity
        
        # Classify sentiment
        if polarity > 0.1:
            label = 'positive'
        elif polarity < -0.1:
            label = 'negative'
        else:
            label = 'neutral'
        
        result = {
            'polarity': round(polarity, 3),
            'subjectivity': round(subjectivity, 3),
            'sentiment_label': label
        }
        
        logger.info(f"Sentiment analysis: {label} (polarity: {polarity:.3f})")
        return result
        
    except Exception as e:
        logger.error(f"Sentiment analysis error: {e}")
        return {
            'polarity': 0.0,
            'subjectivity': 0.0,
            'sentiment_label': 'neutral'
        }


def save_to_cloud(data: Dict[str, Any], bucket_name: Optional[str] = None, 
                  key_prefix: str = 'travel_data') -> Optional[str]:
    """
    Save data to AWS S3 cloud storage.
    
    Args:
        data: Dictionary data to save as JSON
        bucket_name: S3 bucket name (defaults to AWS_S3_BUCKET env var)
        key_prefix: Prefix for the S3 object key
    
    Returns:
        S3 object URL if successful, None otherwise
    """
    # Check if AWS is configured
    aws_access_key = os.environ.get('AWS_ACCESS_KEY_ID')
    aws_secret_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
    aws_region = os.environ.get('AWS_REGION', 'us-east-1')
    bucket_name = bucket_name or os.environ.get('AWS_S3_BUCKET')
    
    if not all([aws_access_key, aws_secret_key, bucket_name]):
        logger.warning("AWS credentials not configured. Skipping cloud save.")
        return None
    
    try:
        # Initialize S3 client
        s3_client = boto3.client(
            's3',
            aws_access_key_id=aws_access_key,
            aws_secret_access_key=aws_secret_key,
            region_name=aws_region
        )
        
        # Generate unique key
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        user_id = data.get('user_id', 'unknown')
        entry_id = data.get('id', 'unknown')
        object_key = f"{key_prefix}/{user_id}/{timestamp}_{entry_id}.json"
        
        # Upload data
        s3_client.put_object(
            Bucket=bucket_name,
            Key=object_key,
            Body=json.dumps(data, default=str),
            ContentType='application/json'
        )
        
        # Generate URL
        url = f"https://{bucket_name}.s3.{aws_region}.amazonaws.com/{object_key}"
        logger.info(f"Data saved to S3: {url}")
        return url
        
    except ClientError as e:
        logger.error(f"AWS S3 error: {e}")
        return None
    except Exception as e:
        logger.error(f"Cloud save error: {e}")
        return None
