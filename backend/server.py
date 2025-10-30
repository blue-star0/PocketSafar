from fastapi import FastAPI, APIRouter, HTTPException, Cookie, Response, Request
from fastapi.security import HTTPBearer
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import httpx

# ML pipeline imports
from .ml_pipeline import clean_gps_data, detect_activity, analyze_sentiment, save_to_cloud

# New ML model routers
from vision_model import router as vision_router
from forecast_model import router as forecast_router
from analytics import router as analytics_router
from sentiment_advanced import router as sentiment_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix='/api')

# Security scheme
bearer_scheme = HTTPBearer()

# Pydantic models
class LocationData(BaseModel):
    latitude: float
    longitude: float
    timestamp: str
    user_id: str

class TripCreate(BaseModel):
    destination: str
    start_date: str
    end_date: str
    budget: Optional[float] = None

class ExpenseCreate(BaseModel):
    trip_id: str
    amount: float
    category: str
    description: Optional[str] = None
    date: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    username: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserLogin(BaseModel):
    email: str
    password: str

class AIGuideRequest(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = None

class BudgetCalculatorRequest(BaseModel):
    location: str
    duration_days: int
    budget: float

# Session management
active_sessions = {}

async def get_current_user(token: str = None) -> User:
    """Validate session and return current user"""
    if not token or token not in active_sessions:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return active_sessions[token]

# Health check endpoint
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "PocketSafar API",
        "version": "1.0",
        "docs": "/docs",
        "health": "/api/health"
    }

# User registration endpoint
@api_router.post("/register")
async def register(user_data: UserLogin):
    try:
        # Check if user exists
        existing_user = await db.users.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")
        
        # Create new user
        user = User(
            email=user_data.email,
            username=user_data.email.split('@')[0]
        )
        
        # Save to database
        await db.users.insert_one(user.dict())
        
        # Create session
        session_token = str(uuid.uuid4())
        active_sessions[session_token] = user
        
        return {
            "message": "User registered successfully",
            "session_token": session_token,
            "user": user.dict()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration error: {str(e)}")

# User login endpoint
@api_router.post("/login")
async def login(credentials: UserLogin):
    try:
        # Find user
        user_doc = await db.users.find_one({"email": credentials.email})
        if not user_doc:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create user object
        user = User(**user_doc)
        
        # Create session
        session_token = str(uuid.uuid4())
        active_sessions[session_token] = user
        
        return {
            "message": "Login successful",
            "session_token": session_token,
            "user": user.dict()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login error: {str(e)}")

# Logout endpoint
@api_router.post("/logout")
async def logout(token: str = None):
    if token and token in active_sessions:
        del active_sessions[token]
    return {"message": "Logged out successfully"}

# Location tracking endpoint
@api_router.post("/track-location")
async def track_location(location_data: LocationData, token: str = None):
    try:
        user = await get_current_user(token)
        
        # Clean GPS data
        cleaned_data = clean_gps_data(
            location_data.latitude,
            location_data.longitude,
            location_data.timestamp
        )
        
        # Detect activity
        activity = detect_activity(cleaned_data)
        
        # Save to database
        location_record = {
            "user_id": user.id,
            "latitude": cleaned_data['latitude'],
            "longitude": cleaned_data['longitude'],
            "timestamp": cleaned_data['timestamp'],
            "activity": activity,
            "created_at": datetime.now(timezone.utc)
        }
        
        await db.locations.insert_one(location_record)
        
        # Save to cloud
        save_to_cloud(location_record)
        
        return {
            "status": "success",
            "location": location_record,
            "activity": activity
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tracking error: {str(e)}")

# Trip creation endpoint
@api_router.post("/trips")
async def create_trip(trip_data: TripCreate, token: str = None):
    try:
        user = await get_current_user(token)
        
        trip = {
            "id": str(uuid.uuid4()),
            "user_id": user.id,
            "destination": trip_data.destination,
            "start_date": trip_data.start_date,
            "end_date": trip_data.end_date,
            "budget": trip_data.budget,
            "created_at": datetime.now(timezone.utc)
        }
        
        await db.trips.insert_one(trip)
        
        return {
            "status": "success",
            "trip": trip
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trip creation error: {str(e)}")

# Get user trips
@api_router.get("/trips")
async def get_trips(token: str = None):
    try:
        user = await get_current_user(token)
        
        trips = await db.trips.find({"user_id": user.id}).to_list(length=100)
        
        return {
            "status": "success",
            "trips": trips
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trips: {str(e)}")

# Expense tracking endpoint
@api_router.post("/expenses")
async def create_expense(expense_data: ExpenseCreate, token: str = None):
    try:
        user = await get_current_user(token)
        
        expense = {
            "id": str(uuid.uuid4()),
            "user_id": user.id,
            "trip_id": expense_data.trip_id,
            "amount": expense_data.amount,
            "category": expense_data.category,
            "description": expense_data.description,
            "date": expense_data.date,
            "created_at": datetime.now(timezone.utc)
        }
        
        await db.expenses.insert_one(expense)
        
        return {
            "status": "success",
            "expense": expense
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Expense tracking error: {str(e)}")

# AI Travel Guide endpoint - EMERGENT INTEGRATIONS REMOVED
@api_router.post("/ai-guide")
async def ai_guide(request: AIGuideRequest, token: str = None):
    try:
        user = await get_current_user(token)
        
        # AI functionality disabled - emergentintegrations package removed
        # Previously used LlmChat for AI-powered travel recommendations
        
        return {
            "response": "AI travel guide feature is currently unavailable. The AI integration has been removed.",
            "query": request.query,
            "status": "unavailable"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI guide error: {str(e)}")

# Budget Calculator endpoint - EMERGENT INTEGRATIONS REMOVED
@api_router.post("/calculate-trip-cost")
async def calculate_trip_cost(calc_data: BudgetCalculatorRequest, token: str = None):
    try:
        user = await get_current_user(token)
        
        # Basic calculation
        daily_budget = calc_data.budget / calc_data.duration_days
        
        # AI functionality disabled - emergentintegrations package removed
        # Previously used LlmChat for AI-powered budget recommendations
        
        return {
            "total_budget": calc_data.budget,
            "duration_days": calc_data.duration_days,
            "daily_budget": daily_budget,
            "location": calc_data.location,
            "ai_recommendations": "AI budget recommendations are currently unavailable. The AI integration has been removed.",
            "basic_breakdown": {
                "accommodation": daily_budget * 0.4,
                "food": daily_budget * 0.3,
                "transportation": daily_budget * 0.2,
                "activities": daily_budget * 0.1
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

# Include new ML model routers
app.include_router(vision_router)
app.include_router(forecast_router)
app.include_router(analytics_router)
app.include_router(sentiment_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
