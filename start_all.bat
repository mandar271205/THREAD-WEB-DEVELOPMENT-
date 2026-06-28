@echo off
echo Starting ThreadCounty Platform...

echo Installing FastAPI dependencies...
cd threadcounty-api
pip install -r requirements.txt

echo Starting FastAPI Backend...
start "ThreadCounty API" cmd /c "python -m uvicorn main:app --reload --port 8000"

echo Starting Next.js Frontend...
cd ../nextjs
start "ThreadCounty Frontend" cmd /c "npm run dev"

echo Both services are starting!
echo Next.js: http://localhost:3000
echo FastAPI: http://localhost:8000
