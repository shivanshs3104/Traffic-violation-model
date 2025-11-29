from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
import json
import os
from datetime import datetime, timedelta
import csv
from functools import wraps
import io
from urllib.parse import urlparse
import requests

MODEL = None  # Lazy-loaded YOLO model (set via MODEL_PATH env)

app = Flask(__name__)

# CORS origins configurable via env (comma separated), default * for demo
allowed_origins = os.getenv('CORS_ALLOW_ORIGINS', '*')
if allowed_origins == '*':
    CORS(app)
else:
    CORS(app, resources={r"/api/*": {"origins": [o.strip() for o in allowed_origins.split(',') if o.strip()]}})

# JWT Configuration via env
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-insecure-change-me')
token_days = int(os.getenv('JWT_ACCESS_TOKEN_DAYS', '30'))
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=token_days)
jwt = JWTManager(app)

# Hardcoded users (In production, use database)
USERS = {
    'admin': 'admin123',
    'user': 'user123'
}

# Allow overriding paths via environment (to avoid parent dir dependency in container)
DEFAULT_VIOLATIONS_PATH = os.path.join(
    os.path.dirname(__file__),
    'data',
    'violations_report.json'
)
VIOLATIONS_REPORT_PATH = os.getenv('VIOLATIONS_PATH', DEFAULT_VIOLATIONS_PATH)

DEFAULT_IMAGES_PATH = os.path.join(
    os.path.dirname(__file__),
    'data'
)
IMAGES_BASE_PATH = os.getenv('IMAGES_PATH', DEFAULT_IMAGES_PATH)


def load_violations():
    """Load violations data from local JSON file or remote URL if provided."""
    if not VIOLATIONS_REPORT_PATH:
        return []
    try:
        parsed = urlparse(VIOLATIONS_REPORT_PATH)
        if parsed.scheme in ("http", "https"):
            resp = requests.get(VIOLATIONS_REPORT_PATH, timeout=10)
            resp.raise_for_status()
            data = resp.json()
        else:
            with open(VIOLATIONS_REPORT_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
        # Support either list of violations or object with 'violations'
        if isinstance(data, dict) and 'violations' in data:
            return data.get('violations', [])
        if isinstance(data, list):
            return data
        return []
    except Exception as e:
        print(f"Error loading violations: {e}")
        return []


@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login endpoint"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Username and password required'}), 400
    
    if username in USERS and USERS[username] == password:
        access_token = create_access_token(identity=username)
        return jsonify({
            'access_token': access_token,
            'username': username,
            'message': 'Login successful'
        }), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401


@app.route('/api/violations', methods=['GET'])
@jwt_required()
def get_violations():
    """Get all violations"""
    violations = load_violations()
    
    # Pagination
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    
    total = len(violations)
    paginated_data = violations[start_idx:end_idx]
    
    return jsonify({
        'data': paginated_data,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': total,
            'pages': (total + per_page - 1) // per_page
        }
    }), 200


@app.route('/api/violations/<int:violation_id>', methods=['GET'])
@jwt_required()
def get_violation_detail(violation_id):
    """Get specific violation details"""
    violations = load_violations()
    
    if violation_id < 0 or violation_id >= len(violations):
        return jsonify({'message': 'Violation not found'}), 404
    
    return jsonify(violations[violation_id]), 200


@app.route('/api/analysis/overview', methods=['GET'])
@jwt_required()
def get_analysis_overview():
    """Get analysis overview"""
    violations = load_violations()
    
    total_violations = len(violations)
    total_no_helmet = 0
    total_triple_riding = 0
    total_no_number_plate = 0
    total_vehicles = 0
    total_persons = 0
    total_fines = 0
    pending_fines = 0
    paid_fines = 0
    
    violation_types_count = {
        'no_helmet': 0,
        'triple_riding': 0,
        'no_number_plate': 0
    }
    
    for v in violations:
        total_vehicles += v.get('vehicle_count', 0)
        total_persons += v.get('person_count', 0)
        
        # Add fines
        fines_info = v.get('fines', {})
        total_fines += fines_info.get('total_fines', 0)
        pending_fines += fines_info.get('pending_fines', 0)
        paid_fines += fines_info.get('paid_fines', 0)
        
        for vtype, items in v.get('violations', {}).items():
            if isinstance(items, list):
                count = len(items)
                if vtype == 'no_helmet':
                    total_no_helmet += count
                    violation_types_count['no_helmet'] += count
                elif vtype == 'triple_riding':
                    total_triple_riding += count
                    violation_types_count['triple_riding'] += count
                elif vtype == 'no_number_plate':
                    total_no_number_plate += count
                    violation_types_count['no_number_plate'] += count
    
    return jsonify({
        'total_violations': total_violations,
        'total_no_helmet': total_no_helmet,
        'total_triple_riding': total_triple_riding,
        'total_no_number_plate': total_no_number_plate,
        'total_vehicles': total_vehicles,
        'total_persons': total_persons,
        'total_fines': total_fines,
        'pending_fines': pending_fines,
        'paid_fines': paid_fines,
        'violation_types': violation_types_count
    }), 200


@app.route('/api/analysis/timeline', methods=['GET'])
@jwt_required()
def get_timeline_analysis():
    """Get violations timeline by hour"""
    violations = load_violations()
    timeline = {}
    
    for v in violations:
        timestamp = v.get('timestamp', '')
        if timestamp:
            try:
                dt = datetime.strptime(timestamp, '%Y-%m-%d %H:%M:%S')
                hour_key = dt.strftime('%Y-%m-%d %H:00')
                if hour_key not in timeline:
                    timeline[hour_key] = 0
                timeline[hour_key] += v.get('total_violations', 0)
            except:
                pass
    
    return jsonify(sorted(timeline.items())), 200


@app.route('/api/analysis/violation-types', methods=['GET'])
@jwt_required()
def get_violation_types_analysis():
    """Get detailed analysis by violation type"""
    violations = load_violations()
    
    analysis = {
        'no_helmet': {'count': 0, 'details': []},
        'triple_riding': {'count': 0, 'details': []},
        'no_number_plate': {'count': 0, 'details': []}
    }
    
    for idx, v in enumerate(violations):
        for vtype, items in v.get('violations', {}).items():
            if vtype in analysis and isinstance(items, list):
                analysis[vtype]['count'] += len(items)
                for item in items:
                    analysis[vtype]['details'].append({
                        'violation_id': idx,
                        'image': v.get('image', ''),
                        'timestamp': v.get('timestamp', ''),
                        'details': item
                    })
    
    return jsonify(analysis), 200


@app.route('/api/export/csv', methods=['GET'])
@jwt_required()
def export_csv():
    """Export violations data as CSV"""
    violations = load_violations()
    
    csv_data = []
    headers = ['ID', 'Image', 'Timestamp', 'Total Violations', 'No Helmet', 'Triple Riding', 'No Number Plate', 'Total Fine', 'Paid Fine', 'Pending Fine', 'Vehicles', 'Persons']
    
    for idx, v in enumerate(violations):
        fines = v.get('fines', {})
        row = [
            idx,
            v.get('image', ''),
            v.get('timestamp', ''),
            v.get('total_violations', 0),
            len(v.get('violations', {}).get('no_helmet', [])),
            len(v.get('violations', {}).get('triple_riding', [])),
            len(v.get('violations', {}).get('no_number_plate', [])),
            fines.get('total_fines', 0),
            fines.get('paid_fines', 0),
            fines.get('pending_fines', 0),
            v.get('vehicle_count', 0),
            v.get('person_count', 0)
        ]
        csv_data.append(row)
    
    csv_filename = f"violations_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    filepath = os.path.join('/tmp', csv_filename)
    
    try:
        with open(filepath, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            writer.writerows(csv_data)
        
        return jsonify({
            'message': 'CSV exported successfully',
            'filename': csv_filename
        }), 200
    except Exception as e:
        return jsonify({'message': f'Error exporting CSV: {str(e)}'}), 500


@app.route('/api/export/json', methods=['GET'])
@jwt_required()
def export_json():
    """Export violations data as JSON"""
    violations = load_violations()
    
    json_filename = f"violations_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    
    return jsonify({
        'data': violations,
        'filename': json_filename,
        'exported_at': datetime.now().isoformat()
    }), 200


@app.route('/api/fines/summary', methods=['GET'])
@jwt_required()
def get_fines_summary():
    """Get summary of all fines"""
    violations = load_violations()
    
    total_fines = 0
    paid_fines = 0
    pending_fines = 0
    total_fines_count = 0
    paid_fines_count = 0
    pending_fines_count = 0
    
    for v in violations:
        fines = v.get('fines', {})
        total_fines += fines.get('total_fines', 0)
        paid_fines += fines.get('paid_fines', 0)
        pending_fines += fines.get('pending_fines', 0)
        
        for fine in fines.get('fines_list', []):
            total_fines_count += 1
            if fine.get('status') == 'paid':
                paid_fines_count += 1
            else:
                pending_fines_count += 1
    
    return jsonify({
        'total_fines_amount': total_fines,
        'paid_fines_amount': paid_fines,
        'pending_fines_amount': pending_fines,
        'total_fines_count': total_fines_count,
        'paid_fines_count': paid_fines_count,
        'pending_fines_count': pending_fines_count,
        'collection_rate': round((paid_fines / total_fines * 100) if total_fines > 0 else 0, 2)
    }), 200


@app.route('/api/fines/all', methods=['GET'])
@jwt_required()
def get_all_fines():
    """Get all fines with pagination"""
    violations = load_violations()
    
    all_fines = []
    for violation_idx, v in enumerate(violations):
        fines = v.get('fines', {})
        for fine in fines.get('fines_list', []):
            fine['violation_index'] = violation_idx
            fine['violation_timestamp'] = v.get('timestamp', '')
            all_fines.append(fine)
    
    # Pagination
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    status_filter = request.args.get('status', None)  # pending or paid
    
    if status_filter:
        all_fines = [f for f in all_fines if f.get('status') == status_filter]
    
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    
    total = len(all_fines)
    paginated_data = all_fines[start_idx:end_idx]
    
    return jsonify({
        'data': paginated_data,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': total,
            'pages': (total + per_page - 1) // per_page
        }
    }), 200


@app.route('/api/fines/mark-paid', methods=['POST'])
@jwt_required()
def mark_fine_paid():
    """Mark a fine as paid (in memory only - for demo purposes)"""
    data = request.get_json()
    violation_idx = data.get('violation_idx')
    fine_id = data.get('fine_id')
    payment_method = data.get('payment_method', 'cash')
    
    try:
        violations = load_violations()
        if violation_idx < 0 or violation_idx >= len(violations):
            return jsonify({'message': 'Violation not found'}), 404
        
        violation = violations[violation_idx]
        fines = violation.get('fines', {})
        
        for fine in fines.get('fines_list', []):
            if fine.get('fine_id') == fine_id and fine.get('status') != 'paid':
                fine['status'] = 'paid'
                fine['paid_date'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                fine['payment_method'] = payment_method
                
                # Update fine totals
                pending_amount = fines.get('pending_fines', 0)
                paid_amount = fines.get('paid_fines', 0)
                
                fine_amount = fine.get('amount', 0)
                fines['pending_fines'] = max(0, pending_amount - fine_amount)
                fines['paid_fines'] = paid_amount + fine_amount
                
                # Save changes (in production, this would be a database update)
                with open(VIOLATIONS_REPORT_PATH, 'w', encoding='utf-8') as f:
                    json.dump(violations, f, indent=2, ensure_ascii=False)
                
                return jsonify({
                    'message': 'Fine marked as paid successfully',
                    'fine': fine
                }), 200
        
        return jsonify({'message': 'Fine not found or already paid'}), 404
    except Exception as e:
        return jsonify({'message': f'Error marking fine as paid: {str(e)}'}), 500


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    violations = load_violations()
    parsed = urlparse(VIOLATIONS_REPORT_PATH or '')
    is_remote = parsed.scheme in ("http", "https")
    exists = False
    try:
        if VIOLATIONS_REPORT_PATH:
            if is_remote:
                # HEAD may be blocked by some hosts; fall back to GET status if needed
                try:
                    r = requests.head(VIOLATIONS_REPORT_PATH, timeout=5)
                    exists = r.status_code == 200
                except Exception:
                    r = requests.get(VIOLATIONS_REPORT_PATH, timeout=5)
                    exists = r.status_code == 200
            else:
                exists = os.path.exists(VIOLATIONS_REPORT_PATH)
    except Exception:
        exists = False
    return jsonify({
        'status': 'healthy',
        'violations_file_exists': exists,
        'violations_count': len(violations),
        'violations_path': VIOLATIONS_REPORT_PATH,
        'violations_source': 'remote' if is_remote else ('local' if VIOLATIONS_REPORT_PATH else 'unset')
    }), 200


@app.route('/api/images/<path:filename>', methods=['GET'])
def serve_image(filename):
    """Serve images from the images directory"""
    try:
        # Try multiple possible paths
        possible_paths = [
            os.path.join(IMAGES_BASE_PATH, filename),
            os.path.join(IMAGES_BASE_PATH, 'helmet detection and number plate.v1i.yolov8', 'train', 'images', os.path.basename(filename)),
            os.path.join(IMAGES_BASE_PATH, 'helmet detection and number plate.v1i.yolov8', 'valid', 'images', os.path.basename(filename)),
        ]
        
        for image_path in possible_paths:
            # Security check - prevent directory traversal
            if not os.path.abspath(image_path).startswith(os.path.abspath(IMAGES_BASE_PATH)):
                continue
            
            if os.path.exists(image_path):
                return send_from_directory(os.path.dirname(image_path), os.path.basename(image_path))
        
        # Return a placeholder if file doesn't exist
        placeholder = (
            b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\xc8\x00\x00\x00\xc8'
            b'\x08\x02\x00\x00\x00N\x1d\xc9\xd5\x00\x00\x00\x19tEXtSoftware\x00Adobe'
            b' ImageReadyq\xc9e<\x00\x00\x1e\x00IDATx\xdaec\xf8\x0f\x00\x00\x03\x01'
            b'\x01\x00\x18\xdd\x8d\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
        )
        return placeholder, 200, {'Content-Type': 'image/png'}
    except Exception as e:
        return jsonify({'message': f'Error serving image: {str(e)}'}), 500


@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Endpoint not found'}), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify({'message': 'Internal server error'}), 500


@app.route('/api/detect', methods=['POST'])
@jwt_required(optional=True)
def detect():
    """Run model inference on uploaded image (requires MODEL_PATH)."""
    global MODEL
    model_path = os.getenv('MODEL_PATH', '')
    if MODEL is None and model_path and os.path.exists(model_path):
        try:
            from ultralytics import YOLO
            MODEL = YOLO(model_path)
        except Exception as e:
            return jsonify({'message': f'Failed to load model: {str(e)}'}), 500

    if MODEL is None:
        return jsonify({'message': 'Model not available. Set MODEL_PATH env and ensure file exists.'}), 503

    if 'image' not in request.files:
        return jsonify({'message': 'Image file field "image" required'}), 400

    # Import Pillow only when needed, and handle missing dependency gracefully
    try:
        from PIL import Image
    except Exception:
        return jsonify({'message': 'Pillow (PIL) not installed on server'}), 500

    file = request.files['image']
    try:
        img_bytes = file.read()
        image = Image.open(io.BytesIO(img_bytes))
    except Exception:
        return jsonify({'message': 'Invalid image'}), 400

    try:
        results = MODEL(image)
        parsed = []
        for r in results:  # ultralytics result list
            boxes = getattr(r, 'boxes', None)
            if boxes is None:
                continue
            for b in boxes:
                xyxy = b.xyxy.cpu().numpy().tolist()[0]
                cls = int(b.cls.cpu().item()) if hasattr(b, 'cls') else None
                conf = float(b.conf.cpu().item()) if hasattr(b, 'conf') else None
                parsed.append({'bbox': xyxy, 'class': cls, 'confidence': conf})
        return jsonify({'detections': parsed, 'count': len(parsed)}), 200
    except Exception as e:
        return jsonify({'message': f'Inference error: {str(e)}'}), 500


if __name__ == '__main__':
    debug_flag = os.getenv('FLASK_DEBUG', 'false').lower() == 'true'
    port = int(os.getenv('PORT', '5000'))
    app.run(debug=debug_flag, host='0.0.0.0', port=port)
