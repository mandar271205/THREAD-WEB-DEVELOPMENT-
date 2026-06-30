from fastapi import APIRouter, Depends
from middleware.auth import get_current_user
from services.supabase_client import supabase

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats")
def get_dashboard_stats(user_id: str = Depends(get_current_user)):
    # Get total uploads
    uploads_response = supabase.table("uploads").select("id", count="exact").eq("user_id", user_id).execute()
    total_uploads = uploads_response.count if uploads_response.count else 0
    
    # Get total reports
    reports_response = supabase.table("reports").select("id", count="exact").eq("user_id", user_id).execute()
    total_reports = reports_response.count if reports_response.count else 0
    
    # Get recent reports
    recent_response = supabase.table("reports").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(5).execute()
    
    # Subscription info
    try:
        sub_response = supabase.table("subscriptions").select("*").eq("user_id", user_id).execute()
        subscription = sub_response.data[0] if sub_response.data else {"plan": "free", "status": "active"}
    except Exception as e:
        print(f"Failed to query subscriptions table: {e}")
        subscription = {"plan": "free", "status": "active"}
    
    return {
        "total_uploads": total_uploads,
        "total_reports": total_reports,
        "recent_activity": recent_response.data,
        "subscription": subscription
    }
