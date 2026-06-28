import os
import google.generativeai as genai
import json
import re
import io
from PIL import Image

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

GEMINI_PROMPT = """You are an expert textile analyst. Analyze this fabric image.
Return ONLY valid JSON (no markdown, no extra text):
{
  "warp_count": <integer 40-250>,
  "weft_count": <integer 40-200>,
  "fabric_type": <"Plain Weave" | "Twill Weave" | "Satin Weave" | "Rib Weave" | "Jacquard Weave" | "Unknown">,
  "weave_pattern": <string max 10 words>,
  "confidence_score": <float 0.0-1.0>,
  "ai_suggestions": <string max 30 words>,
  "fabric_grade": <"Grade A" | "Grade B" | "Grade C">,
  "texture_uniformity": <"High" | "Medium" | "Low">
}
Not a fabric image? → confidence_score: 0.05, fabric_type: "Unknown" """

def analyze_with_gemini(image_bytes: bytes) -> dict | None:
    if not GEMINI_API_KEY:
        print("[Gemini] GEMINI_API_KEY not set.")
        return None
        
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        pil_image = Image.open(io.BytesIO(image_bytes))
        
        response = model.generate_content(
            [GEMINI_PROMPT, pil_image],
            generation_config=genai.GenerationConfig(
                temperature=0.1
            )
        )
        
        raw = response.text.strip()
        raw = re.sub(r"```json|```", "", raw).strip()
        result = json.loads(raw)
        result["analysis_method"] = "google_gemini_flash"
        return result
        
    except Exception as e:
        print(f"[Gemini] Failed: {e}")
        return None
