# 🚀 Quick Reference Guide

## Starting the Application

### Option 1: Automatic (Recommended)
```powershell
# Double-click one of these files:
START.bat      # Starts both services automatically
SETUP.bat      # Setup dependencies first, then start
```

### Option 2: Manual
**Terminal 1 - Backend:**
```powershell
cd backend
pip install -r requirements.txt
python app.py
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm install
npm start
```

## Login Information

```
URL: http://localhost:3000

Username: admin
Password: admin123

OR

Username: user
Password: user123
```

## What Each Page Does

### 🔐 Login Page
- Secure authentication
- Enter credentials
- Get JWT token
- Auto-redirect to dashboard

### 📊 Dashboard
- View all statistics
- Violation breakdown
- Vehicle/Person count
- Quick info cards

### 📋 Violations
- See all detected violations
- Paginated list (10 per page)
- Click to expand details
- View violation types
- See timestamps and images

### 📈 Analysis
- **Overview Tab**: Statistics summary
- **Timeline Tab**: Violations by hour
- **Types Tab**: Detailed breakdown by type
- Visual charts

### 💾 Export
- **CSV Export**: For Excel/Sheets
- **JSON Export**: For integration
- One-click download
- All data included

## Common Commands

### Backend Commands
```powershell
# Install dependencies
pip install -r requirements.txt

# Run backend
python app.py

# Check if running
curl http://localhost:5000/api/health
```

### Frontend Commands
```powershell
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Clear cache
npm cache clean --force
```

## Troubleshooting

### Backend won't start
```powershell
# Check Python version
python --version  # Should be 3.8+

# Install missing packages
pip install -r requirements.txt

# Try different port if 5000 is busy
# Edit backend/app.py and change port
```

### Frontend won't start
```powershell
# Check Node version
node --version  # Should be 14+

# Clear and reinstall
del package-lock.json
rm -r node_modules
npm install
npm start

# Try different port
set PORT=3001
npm start
```

### Login fails
- [ ] Backend is running?
- [ ] Check credentials (admin / admin123)
- [ ] Check browser console for errors
- [ ] Try clearing browser cache

### No data showing
- [ ] Violations file exists?
- [ ] Backend running?
- [ ] Check network tab in browser DevTools
- [ ] Check backend terminal for errors

## File Locations

### Important Files
- **Backend**: `backend/app.py`
- **Frontend**: `frontend/src/App.js`
- **Data**: `traffic-signal-violation-detection/result/violations_report (1).json`
- **Docs**: `README.md`, `SETUP_GUIDE.md`, `ARCHITECTURE.md`

### Add/Edit Features
- **Add pages**: `frontend/src/pages/`
- **Add components**: `frontend/src/components/`
- **Add routes**: `backend/app.py` (add @app.route)
- **Add users**: `backend/app.py` (edit USERS dict)

## API Quick Reference

### Get Violations
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/violations?page=1&per_page=10
```

### Get Analysis
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/analysis/overview
```

### Export Data
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/export/json
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

## Port Reference

- **Frontend**: 3000
- **Backend**: 5000
- **Node Package Manager**: Uses port 5000 for proxy

If ports conflict:
```powershell
# Windows - Find process using port
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F

# OR use different port
set PORT=3001
npm start
```

## Keyboard Shortcuts

### Browser DevTools
- **F12**: Open DevTools
- **Ctrl+Shift+I**: Open Inspector
- **Ctrl+Shift+J**: Open Console
- **Ctrl+Shift+N**: Network Tab
- **Ctrl+Shift+C**: Element Picker

### VS Code
- **Ctrl+`**: Toggle Terminal
- **Ctrl+Shift+P**: Command Palette
- **F5**: Start Debugging
- **Ctrl+S**: Save File

## Performance Tips

### Frontend
- Close unused tabs to save memory
- Clear browser cache periodically
- Use production build for better performance

### Backend
- Restart if using lots of memory
- Check CPU usage in Task Manager
- Increase Python memory if needed

## Customization Quick Tips

### Change Port
**Backend** - Edit `backend/app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=8000)  # Changed from 5000
```

**Frontend** - Set environment variable:
```powershell
$env:PORT=8080
npm start
```

### Change API URL
Edit component files, find and replace:
```
http://localhost:5000  →  http://your-api-url
```

### Add Database
1. Install database driver (sqlite3, psycopg2, etc.)
2. Modify `backend/app.py`
3. Update data loading functions
4. Frontend stays the same!

### Add Authentication Methods
1. Modify login endpoint in `backend/app.py`
2. Add OAuth/SSO libraries
3. Update LoginPage component
4. Rest stays the same!

## File Size Reference

```
Project Size:
├── Backend: ~50KB (Python files)
├── Frontend: ~2-5MB (with node_modules)
├── Data: ~50MB (violations_report.json)
└── Total: ~50-55MB

After npm install: ~300MB+
After npm run build: ~200KB+ (optimized)
```

## Browser Compatibility

✅ Supported:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

⚠️ Not Tested:
- IE 11 (use modern browser)

## Network Requirements

- Minimum: 1 Mbps
- Recommended: 5+ Mbps
- For local: No internet required

## Storage Requirements

- Disk Space: 500MB minimum
- RAM: 2GB minimum, 4GB+ recommended
- Windows: 7+

## Support Checklist

Before asking for help:
- [ ] Restarted both services?
- [ ] Checked backend logs?
- [ ] Cleared browser cache?
- [ ] Verified Python/Node installed?
- [ ] Read SETUP_GUIDE.md?
- [ ] Checked README.md?

## Quick Links

- **GitHub**: [Your Repository]
- **Documentation**: See README.md
- **Setup Guide**: See SETUP_GUIDE.md
- **Architecture**: See ARCHITECTURE.md
- **Python**: https://python.org
- **Node.js**: https://nodejs.org
- **React**: https://react.dev
- **Flask**: https://flask.palletsprojects.com

---

**Last Updated**: November 28, 2025

For detailed info, see full documentation files!
