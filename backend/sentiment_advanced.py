"""Advanced Sentiment Analysis using BERT - Extends TextBlob"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import logging

try:
    from transformers import pipeline
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False

from textblob import TextBlob

router = APIRouter(prefix="/api/sentiment", tags=["sentiment"])
logger = logging.getLogger(__name__)

_sentiment_analyzer = None

def get_sentiment_analyzer():
    global _sentiment_analyzer
    if _sentiment_analyzer is None and TRANSFORMERS_AVAILABLE:
        _sentiment_analyzer = pipeline("sentiment-analysis")
    return _sentiment_analyzer

class ReviewRequest(BaseModel):
    text: str
    use_bert: bool = False

@router.post("/analyze-review")
async def analyze_review(request: ReviewRequest):
    """Analyze trip review sentiment using TextBlob or BERT"""
    try:
        blob = TextBlob(request.text)
        textblob_result = {
            "polarity": blob.sentiment.polarity,
            "subjectivity": blob.sentiment.subjectivity,
            "assessment": "positive" if blob.sentiment.polarity > 0 else "negative" if blob.sentiment.polarity < 0 else "neutral"
        }
        
        result = {"textblob": textblob_result}
        
        if request.use_bert and TRANSFORMERS_AVAILABLE:
            analyzer = get_sentiment_analyzer()
            if analyzer:
                bert_result = analyzer(request.text[:512])[0]
                result["bert"] = bert_result
        elif request.use_bert:
            result["bert_error"] = "Transformers not installed. Install with: pip install transformers torch"
        
        return {"success": True, "results": result}
        
    except Exception as e:
        logger.error(f"Sentiment analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
