import asyncio
from concurrent.futures import ThreadPoolExecutor
from .nim_analyzer import analyze_with_nim
from .gemini_analyzer import analyze_with_gemini
from .opencv_analyzer import analyze_with_opencv
from .mock_analyzer import analyze_mock

executor = ThreadPoolExecutor(max_workers=3)

def _confidence(result: dict | None) -> float:
    if result is None:
        return -1.0
    return float(result.get("confidence_score", 0))

async def analyze_fabric(image_bytes: bytes, file_path: str) -> dict:
    """
    Runs NIM + Gemini + OpenCV in parallel.
    Returns result with highest confidence_score.
    Falls back to mock if all fail.
    """
    loop = asyncio.get_event_loop()
    
    # Run all 3 in parallel (thread pool for blocking calls)
    nim_future    = loop.run_in_executor(executor, analyze_with_nim, image_bytes)
    gemini_future = loop.run_in_executor(executor, analyze_with_gemini, image_bytes)
    opencv_future = loop.run_in_executor(executor, analyze_with_opencv, image_bytes)
    
    nim_result, gemini_result, opencv_result = await asyncio.gather(
        nim_future, gemini_future, opencv_future,
        return_exceptions=True
    )
    
    # Filter out exceptions (treat as None)
    def safe(r):
        return r if isinstance(r, dict) else None
    
    candidates = [
        safe(nim_result),
        safe(gemini_result), 
        safe(opencv_result)
    ]
    
    # Pick best by confidence
    best = max(candidates, key=_confidence, default=None)
    
    if best is None or _confidence(best) < 0.1:
        best = analyze_mock(file_path)
    
    # Always include all methods' confidence for transparency (optional, shows judges your pipeline)
    best["pipeline"] = {
        "nim_confidence":    _confidence(safe(nim_result)),
        "gemini_confidence": _confidence(safe(gemini_result)),
        "opencv_confidence": _confidence(safe(opencv_result)),
        "selected": best.get("analysis_method")
    }
    
    return best
