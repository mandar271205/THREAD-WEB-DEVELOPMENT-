import os
from openai import OpenAI
import base64
import json
import re

NIM_API_KEY = os.getenv("NVIDIA_NIM_API_KEY")

if NIM_API_KEY:
    NIM_CLIENT = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=NIM_API_KEY,
        timeout=15.0
    )
else:
    NIM_CLIENT = None

NIM_PROMPT = """You are a textile quality control expert with 20 years of experience.
Analyze this fabric image and return ONLY a valid JSON object — no markdown, no explanation.

Required JSON format:
{
  "warp_count": <integer, estimated threads per cm in vertical/warp direction, range 40-250>,
  "weft_count": <integer, estimated threads per cm in horizontal/weft direction, range 40-200>,
  "fabric_type": <exactly one of: "Plain Weave", "Twill Weave", "Satin Weave", "Rib Weave", "Jacquard Weave", "Unknown">,
  "weave_pattern": <brief pattern description, max 10 words>,
  "confidence_score": <float 0.0 to 1.0, how confident you are in this analysis>,
  "ai_suggestions": <one specific actionable quality improvement suggestion, max 30 words>,
  "fabric_grade": <exactly one of: "Grade A", "Grade B", "Grade C">,
  "texture_uniformity": <exactly one of: "High", "Medium", "Low">
}

If this is NOT a fabric/textile image, return confidence_score: 0.05 and fabric_type: "Unknown".
DO NOT include any text outside the JSON object."""

def analyze_with_nim(image_bytes: bytes) -> dict | None:
    if not NIM_CLIENT:
        print("[NIM] NVIDIA_NIM_API_KEY not set.")
        return None
        
    try:
        image_b64 = base64.b64encode(image_bytes).decode("utf-8")
        
        response = NIM_CLIENT.chat.completions.create(
            model="meta/llama-3.2-90b-vision-instruct",
            messages=[{
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_b64}"
                        }
                    },
                    {
                        "type": "text",
                        "text": NIM_PROMPT
                    }
                ]
            }],
            max_tokens=400,
            temperature=0.1
        )
        
        raw = response.choices[0].message.content.strip()
        raw = re.sub(r"```json|```", "", raw).strip()
        result = json.loads(raw)
        result["analysis_method"] = "nvidia_nim_llama32_90b"
        return result
        
    except Exception as e:
        print(f"[NIM] Failed: {e}")
        return None
