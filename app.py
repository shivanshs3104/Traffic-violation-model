from flask import Flask, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
import json

# ====== App Setup ======
app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "violations.db")
RESULT_FILE = os.path.join(BASE_DIR, "results", "violations.json")
IMAGE_FOLDER = r"E:\ai_traffic\dataset\valid\images"

# ====== Database Config ======
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_PATH}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# ====== Model ======
class Violation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(255))
    license_plate = db.Column(db.String(100))
    violation = db.Column(db.String(255))
    motorbike = db.Column(db.Integer)
    person = db.Column(db.Integer)
    helmet = db.Column(db.Integer)
    license_plate_detected = db.Column(db.Integer)

# ====== Helper: Import JSON to DB ======
def import_json_to_db():
    if not os.path.exists(RESULT_FILE):
        print("⚠️ No results.json file found.")
        return
    with open(RESULT_FILE, "r") as f:
        data = json.load(f)
    for item in data:
        det = item.get("detections", {})
        record = Violation(
            image=item.get("image"),
            license_plate=item.get("license_plate"),
            violation=item.get("violation"),
            motorbike=det.get("motorbike", 0),
            person=det.get("person", 0),
            helmet=det.get("helmet", 0),
            license_plate_detected=det.get("license_plate", 0),
        )
        db.session.add(record)
    db.session.commit()
    print(f"✅ Imported {len(data)} records into database.")

# ====== Initialize DB ======
with app.app_context():
    db.create_all()
    if Violation.query.count() == 0:
        import_json_to_db()

# ====== Routes ======
@app.route("/api/violations", methods=["GET"])
def get_violations():
    data = Violation.query.all()
    result = [
        {
            "id": v.id,
            "image": v.image,
            "license_plate": v.license_plate,
            "violation": v.violation,
            "detections": {
                "motorbike": v.motorbike,
                "person": v.person,
                "helmet": v.helmet,
                "license_plate": v.license_plate_detected,
            },
        }
        for v in data
    ]
    return jsonify(result)

@app.route("/images/<path:filename>")
def get_image(filename):
    return send_from_directory(IMAGE_FOLDER, filename)

# ====== Run Server ======
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
