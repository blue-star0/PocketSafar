# POCKETSAFAR WEB APP: STEP-BY-STEP SETUP GUIDE

## 1. Backend Setup (FastAPI + MongoDB)

### Clone Repository
```bash
git clone https://github.com/PocketSafar/PocketSafar.git
cd PocketSafar
```

### Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Set up .env
Create a `.env` file in the backend directory with the following variables:
```
MONGO_URL=your_mongodb_connection_string
DB_NAME=pocketsafar
EMERGENT_LLM_KEY=your_emergent_llm_api_key
CORS_ORIGINS=http://localhost:3000
```

### Run Backend
```bash
uvicorn server:app --reload
```
Backend will run on `http://localhost:8000`

---

## 2. Frontend Setup (React)

### Navigate to Frontend
```bash
cd frontend
```

### Install Dependencies
```bash
npm install
```

### Set up .env
Create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:8000/api
```

### Run Frontend
```bash
npm start
```

### Visit Application
Open your browser and navigate to `http://localhost:3000`

---

## 3. Connecting Backend & Frontend

### Backend Configuration
- Backend must allow CORS for frontend origin and credentials
- CORS middleware is configured in `server.py`:
  - `allow_credentials=True`
  - `allow_origins` includes frontend URL
  - Accepts all methods and headers

### Frontend Configuration
- Frontend sends all axios requests with `withCredentials: true`
- This ensures cookies (session tokens) are sent with requests

### Authentication Flow
1. User logs in via OAuth provider
2. Backend validates OAuth token with Emergent Auth
3. Backend creates/retrieves user from MongoDB
4. Session token is set as HTTP-only cookie
5. Frontend stores authentication state
6. All subsequent requests include session cookie

### Protected Routes
- Authenticated users can access:
  - Dashboard
  - Travel entries
  - Expense tracking
  - AI travel guide
  - Rewards system

---

## 4. Deployment Tips

### Database
- Use **MongoDB Atlas** for cloud-hosted MongoDB
- Create a cluster and obtain connection string
- Update `MONGO_URL` in backend `.env`

### Backend Hosting
- Deploy FastAPI backend to:
  - Heroku
  - Railway
  - Render
  - AWS/GCP/Azure
- Ensure environment variables are set
- Update CORS origins to include production frontend URL

### Frontend Hosting
- Deploy React frontend to:
  - **Vercel** (recommended)
  - **Netlify**
  - GitHub Pages
- Update API URL to point to production backend

### Security Considerations
- Use **HTTPS** for both frontend and backend in production
- HTTP-only cookies require secure connection
- Session tokens transmitted over HTTPS only
- Set `secure` flag on cookies in production

---

## 5. Conceptual Framework & Flow

### Core Features
1. **Authentication**: OAuth-based login with Emergent Auth integration
2. **Session Validation**: Token-based session management with cookies
3. **Data Interaction**: CRUD operations for travel entries and expenses
4. **Rewards System**: Points and badges for user engagement
5. **AI Travel Guide**: GPT-powered travel recommendations and budget planning

### User Journey
1. User registers/logs in via OAuth
2. Consent screen for data collection and rewards
3. Access to dashboard with personalized features
4. Create travel entries and track expenses
5. Ask AI guide for travel recommendations
6. Calculate trip costs with AI-powered breakdowns
7. Earn points and badges for activities
8. View expense summaries and analytics

---

## 6. Flowchart Overview (Text Description)

```
Start
  ↓
User opens frontend (http://localhost:3000)
  ↓
Login page displayed
  ↓
User clicks "Login with Google" (or other OAuth provider)
  ↓
OAuth flow initiated → Redirected to provider
  ↓
User authenticates with provider
  ↓
Provider redirects back with authorization code
  ↓
Backend validates code with Emergent Auth
  ↓
Backend creates/retrieves user from MongoDB
  ↓
Backend sets session_token cookie (HTTP-only)
  ↓
User authenticated → Redirected to Dashboard
  ↓
User accesses protected features:
  - View/Create Travel Entries
  - Track Expenses
  - Ask AI Guide
  - Calculate Trip Costs
  - View Rewards & Badges
  ↓
Frontend sends requests with withCredentials: true
  ↓
Backend validates session token from cookie
  ↓
Database operations (MongoDB)
  ↓
Response sent to frontend
  ↓
User logs out → Cookie cleared
  ↓
End
```

---

## Additional Resources

- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **React Documentation**: https://react.dev/
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Emergent Auth**: https://emergent-auth.koyeb.app/

---

**Created**: October 2025  
**Repository**: https://github.com/PocketSafar/PocketSafar
