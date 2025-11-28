# 🚨 Traffic Signal Violation Detection Dashboard

A complete full-stack web application for managing and analyzing traffic violation data. Features a modern React dashboard with a Flask backend API.

![Status](https://img.shields.io/badge/status-active-success) ![Python](https://img.shields.io/badge/python-3.8+-blue) ![React](https://img.shields.io/badge/react-18.2-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Features

### 🔐 Authentication
- Secure login system with JWT tokens
- Demo credentials included
- Session management
- Auto-logout on token expiration

### 📊 Dashboard
- Real-time statistics overview
- Total violations count
- Violation breakdown by type
- Vehicle and person detection statistics
- Quick navigation guide

### 📋 Violations Management
- Paginated list of all violations
- Detailed violation information
- Click to expand violation details
- Violation type badges with counts
- Image references
- Timestamps
- Vehicle and person information

### 📈 Analytics & Analysis
- **Overview Tab**: Statistics summary and violation breakdown
- **Timeline Tab**: Violations tracked by hour
- **Violation Types Tab**: Detailed analysis of each violation type
- Visual charts and graphs
- Distribution analysis

### 💾 Data Export
- **CSV Format**: Export for Excel and analysis tools
- **JSON Format**: Complete data structure for integration
- Includes all violation information
- Timestamped downloads
- One-click export

## 🚀 Quick Start

### Easiest Method - Run Setup Batch File

1. Double-click `SETUP.bat` to install all dependencies
2. Double-click `START.bat` to launch both services

### Manual Setup

**Backend:**
```powershell
cd backend
pip install -r requirements.txt
python app.py
```

**Frontend:**
```powershell
cd frontend
npm install
npm start
```

Then open: `http://localhost:3000`

## 📝 Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| User | user | user123 |

## 📂 Project Structure

```
AAproject/
├── backend/
│   ├── app.py                 # Flask API
│   ├── requirements.txt       # Dependencies
│   └── README.md             # Backend docs
│
├── frontend/
│   ├── src/
│   │   ├── pages/            # Dashboard, Violations, Analysis, Export
│   │   ├── components/       # Navbar, common components
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
│
├── SETUP_GUIDE.md           # Detailed setup instructions
├── SETUP.bat                # Auto-setup script
└── START.bat                # Start both services
```

## 🛠 Technology Stack

### Backend
- **Framework**: Flask 2.3.3
- **Authentication**: Flask-JWT-Extended 4.5.2
- **CORS**: Flask-CORS 4.0.0
- **Language**: Python 3.8+

### Frontend
- **Framework**: React 18.2
- **Routing**: React Router 6.15
- **Styling**: Pure CSS3
- **Language**: JavaScript (ES6+)

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/login
Headers: Content-Type: application/json
Body: { "username": "admin", "password": "admin123" }
```

### Violations
```
GET /api/violations?page=1&per_page=10
GET /api/violations/<id>
```

### Analysis
```
GET /api/analysis/overview
GET /api/analysis/timeline
GET /api/analysis/violation-types
```

### Export
```
GET /api/export/csv
GET /api/export/json
```

### Health
```
GET /api/health
```

## 📊 Dashboard Features

### Overview Statistics
- Total violations detected
- No helmet violations
- Triple riding violations
- Missing number plate
- Red light violations
- Total vehicles detected
- Total persons detected

### Violation Information Captured
```json
{
  "image": "path/to/image.jpg",
  "timestamp": "2025-11-28 13:24:42",
  "total_violations": 5,
  "vehicle_count": 2,
  "person_count": 3,
  "violations": {
    "no_helmet": [...],
    "triple_riding": [...],
    "no_number_plate": [...],
    "red_light": [...]
  }
}
```

## 🎨 UI Features

### Responsive Design
- Mobile-friendly interface
- Adaptive grid layouts
- Touch-optimized buttons
- Flexible navigation

### Modern Styling
- Gradient backgrounds
- Smooth transitions
- Hover effects
- Color-coded information
- Clear typography

### User Experience
- Intuitive navigation
- Loading states
- Error handling
- Success/failure notifications
- Pagination for large datasets

## ⚙️ Configuration

### Change Backend Port
Edit `backend/app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5000)  # Change 5000
```

### Change Frontend Port
Edit `frontend/package.json` or set env variable:
```powershell
$env:PORT=3001
npm start
```

### Change Violations Data Path
Edit `backend/app.py`:
```python
VIOLATIONS_REPORT_PATH = '/your/path/to/violations_report.json'
```

### Add Users
Edit `backend/app.py`:
```python
USERS = {
    'admin': 'admin123',
    'user': 'user123',
    'newuser': 'newpassword'
}
```

## 🔒 Security Features

- JWT token-based authentication
- Protected API endpoints
- CORS configuration
- Password hashing ready (extend with werkzeug)
- Secure token expiration

## 🐛 Troubleshooting

### Backend won't start
- Check port 5000 is available
- Verify Python 3.8+ installed
- Run: `pip install -r requirements.txt`

### Frontend won't connect
- Ensure backend is running
- Check API URL in component files
- Look at browser console for errors

### CORS Errors
- Backend must be running
- Check firewall settings
- Verify API URL matches backend

### Port Already in Use
```powershell
# Find process on port 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

## 📖 Usage Guide

### 1. Login
- Enter credentials (admin / admin123)
- Token automatically saved to local storage
- Auto-redirected to dashboard

### 2. View Dashboard
- See all statistics at a glance
- Understand violation overview
- Quick navigation guide available

### 3. Browse Violations
- Navigate through paginated list
- Click on any violation to see details
- View violation type badges
- See image references

### 4. Analyze Data
- Switch between Overview, Timeline, and Types tabs
- View statistical charts
- Analyze trends and patterns
- Export analysis

### 5. Export Data
- Choose CSV for spreadsheet programs
- Choose JSON for integration
- Download file automatically
- Keep records for reporting

## 🚀 Deployment

### Production Backend
```python
# Change in app.py
app.run(debug=False, host='0.0.0.0', port=5000)
```

### Production Frontend
```powershell
npm run build
# Generates optimized build/ folder
# Deploy to web server (Nginx, Apache, etc.)
```

## 📋 System Requirements

### Minimum
- Windows 7+ / MacOS 10.12+ / Linux
- 4GB RAM
- 500MB disk space

### Recommended
- Windows 10+ / MacOS 10.15+ / Linux
- 8GB RAM
- 1GB disk space

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 👥 Support

For issues, questions, or suggestions:
1. Check the SETUP_GUIDE.md
2. Review API documentation
3. Check browser console for errors
4. Review backend logs

## 🎓 Learning Resources

- React Documentation: https://react.dev
- Flask Documentation: https://flask.palletsprojects.com
- JWT Authentication: https://jwt.io
- REST APIs: https://restfulapi.net

## ✨ Future Enhancements

- [ ] Database integration (SQLite/PostgreSQL)
- [ ] Advanced filtering and search
- [ ] Real-time notifications
- [ ] Email alerts for violations
- [ ] Role-based access control
- [ ] Data visualization with charts library
- [ ] Mobile app
- [ ] Video processing integration

---

**Made with ❤️ for Traffic Safety**

Last Updated: November 28, 2025
