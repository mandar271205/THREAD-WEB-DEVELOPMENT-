from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AnalysisRequest(BaseModel):
    upload_id: str
    image_url: str

class AnalysisResponse(BaseModel):
    report_id: str
    weave_type: str
    warp_density: int
    weft_density: int
    confidence_score: float
    quality_grade: str
    status: str

class ContactMessage(BaseModel):
    name: str
    email: str
    subject: str
    message: str
