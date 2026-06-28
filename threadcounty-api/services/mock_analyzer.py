import hashlib
import random

FABRIC_TYPES = ["Plain Weave", "Twill Weave", "Satin Weave", "Rib Weave", "Jacquard Weave"]
SUGGESTIONS = [
    "Thread tension appears uniform. No corrective action needed.",
    "Slight irregularity detected in warp direction. Check loom tension.",
    "Weft density lower than optimal. Increase picks per inch by 5–8%.",
    "Excellent weave consistency. Suitable for Grade A certification.",
    "Minor variation in thread spacing detected. Inspect yarn quality.",
]

def analyze_mock(file_path: str) -> dict:
    seed = int(hashlib.md5(file_path.encode()).hexdigest(), 16) % 100000
    rng = random.Random(seed)
    
    warp = rng.randint(80, 180)
    weft = rng.randint(60, 140)
    fabric = rng.choice(FABRIC_TYPES)
    confidence = round(rng.uniform(0.72, 0.91), 2)
    total = warp + weft
    
    return {
        "warp_count": warp,
        "weft_count": weft,
        "fabric_type": fabric,
        "weave_pattern": f"Standard {fabric.split()[0].lower()} construction",
        "confidence_score": confidence,
        "ai_suggestions": rng.choice(SUGGESTIONS),
        "fabric_grade": "Grade A" if total > 240 else ("Grade B" if total > 160 else "Grade C"),
        "texture_uniformity": rng.choice(["High", "High", "Medium"]),  # bias toward High
        "analysis_method": "mock_deterministic"
    }
