from fastapi import APIRouter, HTTPException
from models.schemas import ContactMessage
from services.supabase_client import supabase

router = APIRouter(prefix="/contact", tags=["contact"])

@router.post("/")
def submit_contact_form(msg: ContactMessage):
    data = {
        "name": msg.name,
        "email": msg.email,
        "subject": msg.subject,
        "message": msg.message
    }
    
    response = supabase.table("contact_messages").insert(data).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to submit message")
        
    return {"status": "success", "message": "Your message has been received."}
