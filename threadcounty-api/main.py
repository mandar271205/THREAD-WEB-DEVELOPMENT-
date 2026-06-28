from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, reports, dashboard, contact, admin

app = FastAPI(title="ThreadCounty API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://threadcounty.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(reports.router)
app.include_router(dashboard.router)
app.include_router(contact.router)
app.include_router(admin.router)

@app.get("/health")
def health(): return {"status": "ok", "service": "ThreadCounty API"}
