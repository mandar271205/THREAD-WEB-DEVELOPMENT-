from fastapi import APIRouter, Depends, HTTPException
from models.schemas import AnalysisRequest, AnalysisResponse
from middleware.auth import get_current_user
from services.ai_analyzer import analyze_fabric
from services.supabase_client import supabase
import requests

router = APIRouter(prefix="/analyze", tags=["analyze"])

@router.post("/", response_model=AnalysisResponse)
async def analyze_fabric_endpoint(request: AnalysisRequest, user_id: str = Depends(get_current_user)):
    try:
        # Download image from URL
        img_response = requests.get(request.image_url)
        if img_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Could not fetch image from URL")
            
        image_bytes = img_response.content
        
        # Run parallel AI analysis
        results = await analyze_fabric(image_bytes, request.image_url)
        
        # Save to Supabase DB via Service Role (mapping new AI keys to existing DB schema)
        report_data = {
            "upload_id": request.upload_id,
            "user_id": user_id,
            "weave_type": results["fabric_type"],
            "warp_density": results["warp_count"],
            "weft_density": results["weft_count"],
            "confidence_score": results["confidence_score"] * 100, # DB might expect percentage or frontend does
            "quality_grade": results["fabric_grade"].replace("Grade ", ""),
            "notes": results["ai_suggestions"]
        }
        
        # Ensure confidence score is 0-100 format if that's what frontend uses
        if report_data["confidence_score"] <= 1.0:
            report_data["confidence_score"] = int(report_data["confidence_score"] * 100)
            
        response = supabase.table("reports").insert(report_data).execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to save report")
            
        report = response.data[0]
        
        # Update upload status
        supabase.table("uploads").update({"status": "completed"}).eq("id", request.upload_id).execute()
        
        return {
            "report_id": report["id"],
            "weave_type": report["weave_type"],
            "warp_density": report["warp_density"],
            "weft_density": report["weft_density"],
            "confidence_score": report["confidence_score"],
            "quality_grade": report["quality_grade"],
            "status": "completed"
        }
        
    except Exception as e:
        # On error update upload status to failed
        supabase.table("uploads").update({"status": "failed"}).eq("id", request.upload_id).execute()
        raise HTTPException(status_code=500, detail=str(e))
