import os
import cv2
import easyocr
import json
from ultralytics import YOLO

# ====== Paths ======
MODEL_PATH = r"C:\Users\vikas\runs\detect\train43\weights\best.pt"
RESULTS_DIR = "results"
os.makedirs(RESULTS_DIR, exist_ok=True)

# ====== Load Model ======
model = YOLO(MODEL_PATH)
reader = easyocr.Reader(['en'])

# ====== Input Folder ======
IMAGE_FOLDER = r"E:\ai_traffic\dataset\valid\images"

violations = []

for img_name in os.listdir(IMAGE_FOLDER):
    if not img_name.lower().endswith(('.jpg', '.png', '.jpeg')):
        continue

    img_path = os.path.join(IMAGE_FOLDER, img_name)
    img = cv2.imread(img_path)
    if img is None:
        print(f"⚠️ Could not read image: {img_path}")
        continue

    results = model(img)
    detections = results[0].boxes.data.tolist()

    detected = {
        "motorbike": 0,
        "person": 0,
        "helmet": 0,
        "license_plate": 0
    }

    # ===== Count Objects =====
    for det in detections:
        cls_id = int(det[5])
        conf = det[4]
        if conf < 0.25:
            continue
        label = model.names[cls_id].strip().lower()
        if label in detected:
            detected[label] += 1

    # ===== Violation Logic =====
    violation_type = []
    if detected["motorbike"] > 0:
        # Helmet violation
        if detected["helmet"] < detected["person"]:
            violation_type.append("Helmet Missing")

        # Triple riding violation
        if detected["person"] > 2:
            violation_type.append("Triple Riding")

    # ===== License Plate OCR =====
    license_text = "License Plate Not Visible"
    ocr_done = False

    if detected["license_plate"] > 0:
        for box in results[0].boxes:
            cls_id = int(box.cls[0])
            if model.names[cls_id].lower() == "license_plate":
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                plate_crop = img[y1:y2, x1:x2]
                if plate_crop.size != 0:
                    gray = cv2.cvtColor(plate_crop, cv2.COLOR_BGR2GRAY)
                    ocr_result = reader.readtext(gray)
                    text_results = [res[1] for res in ocr_result if len(res[1]) >= 4]
                    if text_results:
                        license_text = text_results[0]
                        ocr_done = True
                        break

    # Fallback OCR if cropped plate not readable
    if not ocr_done:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        ocr_result = reader.readtext(gray)
        text_results = [res[1] for res in ocr_result if len(res[1]) >= 4]
        if text_results:
            license_text = text_results[0]

    # ===== Save Data =====
    violations.append({
        "image": img_name,
        "license_plate": license_text,
        "violation": ", ".join(violation_type) if violation_type else "No Violation",
        "detections": detected
    })

# ===== Save JSON =====
output_path = os.path.join(RESULTS_DIR, "violations.json")
with open(output_path, "w") as f:
    json.dump(violations, f, indent=4)

print(f"✅ Detection complete! Results saved to {output_path}")
