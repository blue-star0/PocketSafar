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
    transportation_rating: Optional[int] = None
    infrastructure_rating: Optional[int] = None
    review: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Expense(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    description: str
    amount: float
    category: str  # transport, accommodation, food, activities
    date: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ConsentUpdate(BaseModel):
    consent_given: bool

class TravelEntryCreate(BaseModel):
    title: str
    description: str
    location: str
    date: str
    transportation_rating: Optional[int] = None
    infrastructure_rating: Optional[int] = None
    review: Optional[str] = None

class ExpenseCreate(BaseModel):
    description: str
    amount: float
    category: str
    date: str

class AIGuideRequest(BaseModel):
    message: str
    location: Optional[str] = None

class ExpenseCalculation(BaseModel):
    budget: float
    duration_days: int
    location: str

# Helper Functions
def prepare_for_mongo(data):
    if isinstance(data, dict):
        if isinstance(data.get('created_at'), datetime):
            data['created_at'] = data['created_at'].isoformat()
        if isinstance(data.get('expires_at'), datetime):
            data['expires_at'] = data['expires_at'].isoformat()
    return data

async def get_current_user(session_token: Optional[str] = Cookie(None), authorization: Optional[str] = None):
    token = session_token
    if not token and authorization:
        if authorization.startswith("Bearer "):
            token = authorization[7:]
        else:
            token = authorization
    
    if not token:
        raise HTTPException(status_code=401, detail="No session token provided")
    
    session = await db.user_sessions.find_one({"session_token": token})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    if datetime.fromisoformat(session['expires_at']) < datetime.now(timezone.utc):
        await db.user_sessions.delete_one({"session_token": token})
        raise HTTPException(status_code=401, detail="Session expired")
    
    user = await db.users.find_one({"id": session['user_id']})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return User(**user)

# Authentication Routes
@api_router.post("/auth/session")
async def create_session(request: Request, response: Response):
    session_id = request.headers.get("X-Session-ID")
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session ID")
        
        user_data = resp.json()
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data["email"]})
    if not existing_user:
        # Create new user
        user = User(
            email=user_data["email"],
            name=user_data["name"],
            picture=user_data.get("picture")
        )
        user_dict = prepare_for_mongo(user.dict())
        await db.users.insert_one(user_dict)
    else:
        user = User(**existing_user)
    
    # Create session
    session_token = user_data["session_token"]
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    session = UserSession(
        user_id=user.id,
        session_token=session_token,
        expires_at=expires_at
    )
    session_dict = prepare_for_mongo(session.dict())
    await db.user_sessions.insert_one(session_dict)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        max_age=7 * 24 * 60 * 60,
        httponly=True,
        secure=True,
        samesite="none",
        path="/"
    )
    
    return {
        "user": user.dict(),
        "session_token": session_token
    }

@api_router.post("/auth/logout")
async def logout(response: Response, session_token: Optional[str] = Cookie(None)):
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/", samesite="none", secure=True)
    return {"message": "Logged out successfully"}

@api_router.get("/auth/me")
async def get_me(authorization: Optional[str] = None, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(session_token, authorization)
    return user

# Consent Management
@api_router.post("/consent")
async def update_consent(consent_data: ConsentUpdate, authorization: Optional[str] = None, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(session_token, authorization)
    
    update_data = {
        "consent_given": consent_data.consent_given,
        "rewards_enabled": consent_data.consent_given
    }
    
    await db.users.update_one(
        {"id": user.id},
        {"$set": update_data}
    )
    
    # Award welcome badge if consenting for first time
    if consent_data.consent_given and not user.consent_given:
        await db.users.update_one(
            {"id": user.id},
            {
                "$inc": {"total_points": 100},
                "$push": {"badges": "Welcome Explorer"}
            }
        )
    
    return {"message": "Consent updated successfully"}

# Travel Diary Routes
@api_router.post("/travel-entries", response_model=TravelEntry)
async def create_travel_entry(entry_data: TravelEntryCreate, authorization: Optional[str] = None, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(session_token, authorization)
    
    entry = TravelEntry(
        user_id=user.id,
        **entry_data.dict()
    )
    entry_dict = prepare_for_mongo(entry.dict())
    await db.travel_entries.insert_one(entry_dict)
    
    # Award points if user has consent
    if user.rewards_enabled:
        await db.users.update_one(
            {"id": user.id},
            {"$inc": {"total_points": 50}}
        )
        
        # Check for badges
        user_entries = await db.travel_entries.count_documents({"user_id": user.id})
        if user_entries == 1:
            await db.users.update_one(
                {"id": user.id},
                {"$push": {"badges": "First Journey"}}
            )
        elif user_entries == 10:
            await db.users.update_one(
                {"id": user.id},
                {"$push": {"badges": "Travel Enthusiast"}}
            )
    
    return entry

@api_router.get("/travel-entries", response_model=List[TravelEntry])
async def get_travel_entries(authorization: Optional[str] = None, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(session_token, authorization)
    entries = await db.travel_entries.find({"user_id": user.id}).to_list(1000)
    return [TravelEntry(**entry) for entry in entries]

# Expense Tracking Routes
@api_router.post("/expenses", response_model=Expense)
async def create_expense(expense_data: ExpenseCreate, authorization: Optional[str] = None, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(session_token, authorization)
    
    expense = Expense(
        user_id=user.id,
        **expense_data.dict()
    )
    expense_dict = prepare_for_mongo(expense.dict())
    await db.expenses.insert_one(expense_dict)
    
    return expense

@api_router.get("/expenses", response_model=List[Expense])
async def get_expenses(authorization: Optional[str] = None, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(session_token, authorization)
    expenses = await db.expenses.find({"user_id": user.id}).to_list(1000)
    return [Expense(**expense) for expense in expenses]

@api_router.get("/expenses/summary")
async def get_expense_summary(authorization: Optional[str] = None, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(session_token, authorization)
    
    pipeline = [
        {"$match": {"user_id": user.id}},
        {"$group": {
            "_id": "$category",
            "total": {"$sum": "$amount"},
            "count": {"$sum": 1}
        }}
    ]
    
    result = await db.expenses.aggregate(pipeline).to_list(None)
    
    total_spent = sum(item["total"] for item in result)
    
    return {
        "categories": result,
        "total_spent": total_spent
    }

# AI Travel Guide
@api_router.post("/ai-guide")
async def get_ai_guide_response(request: AIGuideRequest, authorization: Optional[str] = None, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(session_token, authorization)
    
    try:
        # Initialize LLM Chat
        chat = LlmChat(
            api_key=os.environ.get('EMERGENT_LLM_KEY'),
            session_id=f"travel_guide_{user.id}",
            system_message="You are an expert AI travel guide for India, specializing in Kerala tourism and Indian travel experiences. Provide helpful, accurate, and engaging travel advice including recommendations for places to visit, local cuisine, cultural events, transportation options, and budget planning. Focus on authentic experiences and practical travel tips."
        ).with_model("openai", "gpt-5")
        
        # Create user message with location context if provided
        message_text = request.message
        if request.location:
            message_text = f"For location: {request.location}\n\nUser question: {request.message}"
        
        user_message = UserMessage(text=message_text)
        response = await chat.send_message(user_message)
        
        return {"response": response}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Guide error: {str(e)}")

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
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
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