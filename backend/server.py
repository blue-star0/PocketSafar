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
from emergentintegrations.llm.chat import LlmChat, UserMessage

# ML pipeline imports
from .ml_pipeline import clean_gps_data, detect_activity, analyze_sentiment, save_to_cloud

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Pydantic Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    picture: Optional[str] = None
    consent_given: bool = False
    rewards_enabled: bool = False
    total_points: int = 0
    badges: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TravelEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    description: str
    location: str
    date: str
    transportation_rating: int
    infrastructure_rating: int
    review: str
    # New optional fields commonly associated with ML processing
    route_points: Optional[List[Dict[str, Any]]] = None
    trip_segments: Optional[List[Dict[str, Any]]] = None
    sentiment: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Expense(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    description: str
    amount: float
    category: str
    date: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ConsentUpdate(BaseModel):
    consent_given: bool

class AIQuery(BaseModel):
    query: str
    location: Optional[str] = None

class ExpenseCalculation(BaseModel):
    budget: float
    duration_days: int
    location: str

# Authentication middleware
security = HTTPBearer(auto_error=False)

# Helper function to get current user
async def get_current_user(session_token: Optional[str], authorization: Optional[str]):
    """Get current user from session token or Authorization header"""
    token = None

    if authorization:
        # Extract token from Authorization header (Bearer token)
        if authorization.startswith("Bearer "):
            token = authorization.replace("Bearer ", "")
        else:
            token = authorization
    elif session_token:
        # Use session token from cookie
        token = session_token

    if not token:
        raise HTTPException(status_code=401, detail="No authentication token provided")

    # Validate session with Emergent Auth
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                "https://emergent-auth.koyeb.app/session",
                headers={"X-Session-ID": token}
            )

            if response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid session")

            auth_data = response.json()

            # Get or create user in our database
            user_data = await db.users.find_one({"email": auth_data["user"]["email"]})

            if not user_data:
                # Create new user
                new_user = User(
                    email=auth_data["user"]["email"],
                    name=auth_data["user"]["name"],
                    picture=auth_data["user"].get("picture")
                )
                await db.users.insert_one(new_user.dict())
                user_data = new_user.dict()

            return User(**user_data)

        except httpx.RequestError:
            raise HTTPException(status_code=401, detail="Authentication service unavailable")

# Routes
@api_router.get("/auth/me")
async def get_me(authorization: Optional[str] = None, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(session_token, authorization)
    return user

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("session_token")
    return {"message": "Logged out successfully"}

@api_router.post("/consent")
async def update_consent(consent_data: ConsentUpdate, authorization: Optional[str] = None, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(session_token, authorization)

    # Update user consent
    update_data = {
        "consent_given": consent_data.consent_given,
        "rewards_enabled": consent_data.consent_given
    }

    # If user gives consent for the first time, add welcome rewards
    if consent_data.consent_given and not user.consent_given:
        update_data["total_points"] = user.total_points + 100  # Welcome bonus
        update_data["badges"] = user.badges + ["Welcome Explorer"] if "Welcome Explorer" not in user.badges else user.badges

    await db.users.update_one(
        {"id": user.id},
        {"$set": update_data}
    )

    return {"message": "Consent updated successfully", "rewards_enabled": consent_data.consent_given}

@api_router.post("/travel-entries")
async def create_travel_entry(entry: TravelEntry, authorization: Optional[str] = None, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(session_token, authorization)
    entry.user_id = user.id

    # ML processing before saving
    try:
        # Clean GPS route points if provided
        if entry.route_points:
            cleaned_points = clean_gps_data(entry.route_points)
            entry.route_points = cleaned_points

        # Detect activity for trip segments if provided
        if entry.trip_segments:
            detected_segments = detect_activity(entry.trip_segments)
            entry.trip_segments = detected_segments

        # Analyze sentiment from review
        if entry.review:
            entry.sentiment = analyze_sentiment(entry.review)

    except Exception as e:
        # Log and continue with raw data if ML processing fails
        logging.getLogger(__name__).error(f"ML processing error: {e}")

    # Insert travel entry
    await db.travel_entries.insert_one(entry.dict())

    # Optionally save to cloud if AWS is configured
    try:
        save_to_cloud({**entry.dict(), "user_id": user.id}, key_prefix='travel_entries')
    except Exception as e:
        logging.getLogger(__name__).warning(f"Cloud save skipped or failed: {e}")

    # Add points for travel entry if rewards are enabled
    if user.rewards_enabled:
        new_points = user.total_points + 50  # Points per entry
        badges = user.badges.copy()

        # Check for new badges
        user_entries_count = await db.travel_entries.count_documents({"user_id": user.id})
        if user_entries_count == 1 and "First Journey" not in badges:
            badges.append("First Journey")
        elif user_entries_count >= 5 and "Travel Enthusiast" not in badges:
            badges.append("Travel Enthusiast")

        await db.users.update_one(
            {"id": user.id},
            {"$set": {"total_points": new_points, "badges": badges}}
        )

    return {"message": "Travel entry created successfully", "id": entry.id}

@api_router.get("/travel-entries")
async def get_travel_entries(authorization: Optional[str] = None, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(session_token, authorization)
    entries = await db.travel_entries.find({"user_id": user.id}).to_list(length=None)
    return entries

@api_router.post("/expenses")
async def create_expense(expense: Expense, authorization: Optional[str] = None, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(session_token, authorization)
    expense.user_id = user.id

    await db.expenses.insert_one(expense.dict())
    return {"message": "Expense created successfully", "id": expense.id}

@api_router.get("/expenses")
async def get_expenses(authorization: Optional[str] = None, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(session_token, authorization)
    expenses = await db.expenses.find({"user_id": user.id}).to_list(length=None)
    return expenses

@api_router.get("/expenses/summary")
async def get_expense_summary(authorization: Optional[str] = None, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(session_token, authorization)

    # Aggregate expenses by category
    pipeline = [
        {"$match": {"user_id": user.id}},
        {
            "$group": {
                "_id": "$category",
                "total": {"$sum": "$amount"},
                "count": {"$sum": 1}
            }
        }
    ]

    category_summary = await db.expenses.aggregate(pipeline).to_list(length=None)

    # Calculate total spent
    total_spent = sum(item["total"] for item in category_summary)

    return {
        "categories": category_summary,
        "total_spent": total_spent
    }

@api_router.post("/ai-guide")
async def ask_ai_guide(query: AIQuery, authorization: Optional[str] = None, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(session_token, authorization)

    try:
        # Initialize AI chat with Emergent LLM
        chat = LlmChat(
            api_key=os.environ.get('EMERGENT_LLM_KEY'),
            session_id=f"ai_guide_{user.id}",
            system_message="You are an expert travel guide for India with deep knowledge of culture, attractions, transportation, food, safety, and local customs. Provide helpful, accurate, and culturally sensitive travel advice. Focus on practical tips, hidden gems, and authentic experiences. Always consider budget options and safety recommendations."
        ).with_model("openai", "gpt-5")

        # Add location context if provided
        context_query = query.query
        if query.location:
            context_query = f"For travel to {query.location} in India: {query.query}"

        user_message = UserMessage(text=context_query)
        response = await chat.send_message(user_message)

        return {"response": response, "location": query.location}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

# Expense Calculator
@api_router.post("/calculate-trip-cost")
async def calculate_trip_cost(calc_data: ExpenseCalculation, authorization: Optional[str] = None, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(session_token, authorization)

    try:
        # Use AI to provide budget breakdown
        chat = LlmChat(
            api_key=os.environ.get('EMERGENT_LLM_KEY'),
            session_id=f"budget_calc_{user.id}",
            system_message="You are a travel budget calculator for India. Provide realistic cost breakdowns for trips including accommodation, food, transportation, activities, and miscellaneous expenses. Give practical budget advice."
        ).with_model("openai", "gpt-5")

        message = f"Calculate and break down travel costs for a {calc_data.duration_days}-day trip to {calc_data.location} in India with a budget of ₹{calc_data.budget}. Provide detailed daily budget breakdown and recommendations."

        user_message = UserMessage(text=message)
        response = await chat.send_message(user_message)

        # Basic calculation
        daily_budget = calc_data.budget / calc_data.duration_days

        return {
            "total_budget": calc_data.budget,
            "duration_days": calc_data.duration_days,
            "daily_budget": daily_budget,
            "ai_recommendations": response,
            "location": calc_data.location
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")

# Include the router in the main app
app.include_router(api_router)
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
