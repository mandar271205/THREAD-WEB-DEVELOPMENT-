import cv2
import numpy as np
from PIL import Image
import io

FABRIC_TYPE_MAP = {
    (0, 0.4): "Plain Weave",      # very regular → plain
    (0.4, 0.6): "Twill Weave",    # moderate variation
    (0.6, 0.8): "Satin Weave",    # less regular
    (0.8, 1.0): "Jacquard Weave", # complex pattern
}

def analyze_with_opencv(image_bytes: bytes) -> dict | None:
    try:
        # Decode image
        pil_img = Image.open(io.BytesIO(image_bytes)).convert("L")  # grayscale
        img = np.array(pil_img, dtype=np.float32)
        
        # Resize to standard size for consistent analysis
        img = cv2.resize(img, (512, 512))
        
        # Apply Gaussian blur to reduce noise before FFT
        img_blur = cv2.GaussianBlur(img, (3, 3), 0)
        
        # 2D FFT
        f = np.fft.fft2(img_blur)
        fshift = np.fft.fftshift(f)
        magnitude = 20 * np.log(np.abs(fshift) + 1)
        
        rows, cols = img.shape
        crow, ccol = rows // 2, cols // 2
        
        # Zero out DC component (center) to focus on texture frequencies
        magnitude[crow-5:crow+5, ccol-5:ccol+5] = 0
        
        # Horizontal profile → weft (horizontal threads)
        h_profile = magnitude[crow, ccol+5:ccol+80]
        # Vertical profile → warp (vertical threads)  
        v_profile = magnitude[crow+5:crow+80, ccol]
        
        # Find dominant frequency peaks
        weft_peak = int(np.argmax(h_profile)) + 5
        warp_peak = int(np.argmax(v_profile)) + 5
        
        # Convert frequency index to threads/cm
        # Assumes image represents ~5cm x 5cm fabric patch (standard macro shot)
        # Calibration: freq_index * (512/5) / 512 * scale_factor
        CALIBRATION = 2.2  # empirically tuned for typical fabric macro photos
        warp_count = max(40, min(250, int(warp_peak * CALIBRATION)))
        weft_count = max(40, min(200, int(weft_peak * CALIBRATION)))
        
        # Texture regularity = how "peaked" the FFT is (high peak = regular weave)
        h_regularity = float(np.max(h_profile)) / (float(np.mean(h_profile)) + 1e-6)
        v_regularity = float(np.max(v_profile)) / (float(np.mean(v_profile)) + 1e-6)
        regularity = min(1.0, (h_regularity + v_regularity) / 2 / 30)
        
        # Map regularity to fabric type
        fabric_type = "Plain Weave"
        for (low, high), ftype in FABRIC_TYPE_MAP.items():
            if low <= (1 - regularity) < high:
                fabric_type = ftype
                break
        
        # Confidence based on how clear the FFT peaks are
        confidence = min(0.85, 0.4 + regularity * 0.45)
        
        # Texture uniformity
        std_dev = float(np.std(img_blur))
        uniformity = "High" if std_dev < 30 else ("Medium" if std_dev < 60 else "Low")
        
        # Grade based on thread density and uniformity
        total_density = warp_count + weft_count
        if total_density > 240 and uniformity == "High":
            grade = "Grade A"
        elif total_density > 160:
            grade = "Grade B"
        else:
            grade = "Grade C"
        
        return {
            "warp_count": warp_count,
            "weft_count": weft_count,
            "fabric_type": fabric_type,
            "weave_pattern": f"FFT-detected {fabric_type.lower()} structure",
            "confidence_score": round(confidence, 2),
            "ai_suggestions": f"Thread density {total_density} threads/cm². {'Excellent quality.' if grade == 'Grade A' else 'Consider increasing thread count for premium grade.'}",
            "fabric_grade": grade,
            "texture_uniformity": uniformity,
            "analysis_method": "opencv_fft"
        }
        
    except Exception as e:
        print(f"[OpenCV] Failed: {e}")
        return None
