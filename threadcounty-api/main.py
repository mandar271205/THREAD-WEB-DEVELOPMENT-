import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, reports, dashboard, contact, admin

app = FastAPI(title="ThreadCounty API", version="1.0.0")

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "https://threadcounty-nu.vercel.app,https://threadcounty.vercel.app,http://localhost:3000",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=os.getenv("ALLOWED_ORIGIN_REGEX"),
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
