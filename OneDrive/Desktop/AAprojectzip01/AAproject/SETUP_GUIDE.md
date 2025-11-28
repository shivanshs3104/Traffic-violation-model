# 🚨 Traffic Violation Detection System - Complete Setup Guide

## Project Structure

```
AAproject/
├── backend/                 # Flask API Backend
│   ├── app.py             # Main Flask application
│   └── requirements.txt    # Python dependencies
│
└── frontend/              # React Dashboard Frontend
    ├── src/
    │   ├── pages/         # Page components
    │   ├── components/    # Reusable components
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    ├── public/
    │   └── index.html
    └── package.json
```

## Prerequisites

- **Python** 3.8+ (for backend)
- **Node.js** 14+ with npm (for frontend)
- **Git** (optional)

## Backend Setup

### 1. Install Python Dependencies

```powershell
cd backend
pip install -r requirements.txt
```

### 2. Run the Flask Server

```powershell
python app.py
```

The backend will start on `http://localhost:5000`

### Verify Backend is Running

Open in browser or use PowerShell:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/health"
```

You should see:
```json
{
  "status": "healthy",
  "violations_file_exists": true,
  "violations_count": 3425
}
```

## Frontend Setup

### 1. Install Node Dependencies

```powershell
cd frontend
npm install
```

### 2. Start React Development Server

```powershell
npm start
```

The frontend will open at `http://localhost:3000`

## Default Login Credentials

Use any of these to login:

| Username | Password |
|----------|----------|
| admin | admin123 |
| user | user123 |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password

### Violations
- `GET /api/violations` - Get all violations (paginated)
- `GET /api/violations/<id>` - Get specific violation details

### Analysis
- `GET /api/analysis/overview` - Get statistics overview
- `GET /api/analysis/timeline` - Get violations timeline
- `GET /api/analysis/violation-types` - Get violation type analysis

### Export
- `GET /api/export/csv` - Export data as CSV
- `GET /api/export/json` - Export data as JSON

### Health
- `GET /api/health` - Health check

## Features

### 🔐 Login Page
- Secure authentication
- Demo credentials
- Session management

### 📊 Dashboard
- Real-time statistics
- Violation counts by type
- Vehicle and person detection
- Quick info section

### 📋 Violations
- Paginated list of all violations
- Detailed violation information
- Search and filter capabilities
- Violation type badges
- Click to expand details

### 📈 Analysis
- Overview statistics
- Timeline analysis (violations by hour)
- Violation type breakdown
- Visual charts
- Distribution graphs

### 💾 Export
- CSV export for Excel
- JSON export for integration
- Complete data structure
- Formatted downloads

## Architecture

### Backend (Flask)
- RESTful API design
- JWT authentication
- CORS enabled
- Pagination support
- JSON data handling

### Frontend (React)
- React Router for navigation
- Component-based architecture
- CSS Modules styling
- Local storage for tokens
- Responsive design

## Customization

### Change API URL
If running backend on different port, update in frontend:
- Find `http://localhost:5000` in component files
- Replace with your API URL

### Add More Users
Edit `app.py`, update the `USERS` dictionary:
```python
USERS = {
    'admin': 'admin123',
    'user': 'user123',
    'newuser': 'newpassword'  # Add new user
}
```

### Modify Violations Data Path
Edit `app.py`:
```python
VIOLATIONS_REPORT_PATH = '/your/path/to/violations_report.json'
```

## Troubleshooting

### Backend Issues

**Connection Refused**
- Ensure backend is running: `python app.py`
- Check port 5000 is available
- On Windows, firewall might block it

**Violations File Not Found**
- Verify path in `app.py` is correct
- Check file exists at specified location
- Use absolute path

### Frontend Issues

**CORS Error**
- Backend is not running
- Check backend started successfully
- Verify API URL is correct

**Login Not Working**
- Ensure backend is running on localhost:5000
- Check credentials in demo section
- Open browser console for error details

**Port Already in Use**
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Development Tips

### Running Both Services

**Terminal 1 - Backend:**
```powershell
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```

### Hot Reload
- Frontend has hot reload enabled
- Backend requires manual restart after code changes

### Browser DevTools
- React DevTools extension
- Network tab to inspect API calls
- Console for errors

## Production Deployment

### Backend
```python
# In app.py, change:
app.run(debug=True)  # Development

# To:
app.run(debug=False, host='0.0.0.0', port=5000)  # Production
```

### Frontend
```powershell
npm run build
# Generates optimized build in build/ folder
```

## Support

For issues or questions:
1. Check browser console for errors
2. Check backend terminal for server errors
3. Verify all prerequisites are installed
4. Ensure backend is running before starting frontend

## License

Your Traffic Violation Detection System
