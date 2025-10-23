# PocketSafar Setup Guide

This guide walks you through installation, environment setup, running the backend and frontend, executing tests, troubleshooting, and useful resources.

## 1) Prerequisites
- Git, Python 3.11+, Node.js 18+ and npm
- MongoDB (local or cloud URI)
- Optional: Docker and Docker Compose

## 2) Clone the Repository
```bash
git clone https://github.com/PocketSafar/PocketSafar.git
cd PocketSafar
```

## 3) Environment Setup

### Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
pip install -r requirements.txt
# Dev tools (optional): pip install -r requirements-dev.txt || pip install black flake8 mypy pytest pytest-cov
cp .env.example .env
# Edit .env with your values
```
Example .env keys:
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=pocketsafar
EMERGENT_LLM_KEY=your_api_key
CORS_ORIGINS=http://localhost:3000
```

### Frontend (React/TypeScript)
```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env with API base URL, e.g. VITE_API_URL=http://localhost:8000
```

## 4) Running the App

### Run Backend
From backend directory with venv activated:
```bash
uvicorn app.main:app --reload  # or uvicorn server:app --reload based on repo
```
Backend should be available at:
- http://localhost:8000
- Docs: http://localhost:8000/docs

### Run Frontend
From frontend directory:
```bash
npm run dev
```
Frontend should be available at:
- http://localhost:3000

## 5) Running Tests

### Backend tests
```bash
cd backend
pytest -q --cov
```
Optional quality checks:
```bash
black --check .
flake8
mypy .
```

### Frontend tests
```bash
cd frontend
npm test
npm run lint
```

## 6) Troubleshooting
- Backend won’t start (port in use): change port `uvicorn app.main:app --reload --port 8001`
- Mongo connection failed: verify MONGO_URL and MongoDB is running/accessible
- CORS errors: confirm CORS_ORIGINS matches frontend origin (http://localhost:3000)
- 404/500 from API: check server logs; verify routes; run `pytest` to catch regressions
- Node build errors: remove node_modules and reinstall `rm -rf node_modules && npm install`
- Env not loading: ensure `.env` exists and keys are spelled correctly

## 7) Docker (optional)
If provided, you can use Docker Compose:
```bash
docker compose up --build
```
This will build and run both backend and frontend with default ports.

## 8) Useful Resources
- FastAPI docs: https://fastapi.tiangolo.com/
- React docs: https://react.dev/
- TypeScript: https://www.typescriptlang.org/docs/
- MongoDB: https://www.mongodb.com/docs/

If you run into issues, please open an issue on GitHub with logs and steps to reproduce.
