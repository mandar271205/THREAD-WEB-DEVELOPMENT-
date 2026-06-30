from fastapi import APIRouter, Depends, HTTPException
from middleware.auth import get_current_user
from services.supabase_client import supabase

router = APIRouter(prefix="/admin", tags=["admin"])

def check_admin(user_id: str):
    response = supabase.table("profiles").select("role").eq("id", user_id).execute()
    if not response.data or response.data[0].get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")

@router.get("/stats")
def get_admin_stats(user_id: str = Depends(get_current_user)):
    check_admin(user_id)
    
    # Get total users
    users_response = supabase.table("profiles").select("id", count="exact").execute()
    total_users = users_response.count if users_response.count else 0
    
    # Get total uploads globally
    uploads_response = supabase.table("uploads").select("id", count="exact").execute()
    total_uploads = uploads_response.count if uploads_response.count else 0
    
    return {
        "total_users": total_users,
        "total_uploads": total_uploads
    }

@router.get("/users")
def get_all_users(user_id: str = Depends(get_current_user)):
    check_admin(user_id)
    response = supabase.table("profiles").select("*").order("created_at", desc=True).execute()
    return response.data
