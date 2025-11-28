# 📖 Documentation Index

Welcome to the Traffic Violation Detection Dashboard! Here's your complete guide.

## 📋 Quick Start (5 minutes)

Start here if you want to get running immediately:

1. **Automatic Start**: Double-click `START.bat` 
2. **Open Browser**: http://localhost:3000
3. **Login**: Use `admin` / `admin123`
4. **Explore**: Click through different sections

**See**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

## 📚 Documentation Files

### 1. **README.md** - Project Overview
- Complete project description
- Features list
- Technology stack
- Troubleshooting
- **Read this**: To understand what the project does

### 2. **SETUP_GUIDE.md** - Detailed Setup Instructions
- Prerequisites
- Step-by-step backend setup
- Step-by-step frontend setup
- Customization guide
- API endpoint reference
- **Read this**: For detailed setup and configuration

### 3. **QUICK_REFERENCE.md** - Quick Command Reference
- Starting commands
- Login credentials
- Page descriptions
- Common commands
- Troubleshooting checklist
- **Read this**: When you need quick answers

### 4. **ARCHITECTURE.md** - System Architecture
- Application flow diagram
- Component hierarchy
- Data flow
- Technology stack diagram
- Security architecture
- **Read this**: To understand how everything connects

### 5. **SETUP.bat** - Automatic Setup
- Installs all dependencies
- Creates virtual environments
- Ready to start
- **Run this**: First time setup

### 6. **START.bat** - Quick Start
- Starts both services
- Opens terminals
- Ready to use
- **Run this**: Every time to start

## 🎯 Getting Started by Role

### 👨‍💻 Developers
1. Read: README.md
2. Read: ARCHITECTURE.md
3. Run: SETUP.bat
4. Start: START.bat
5. Edit: `frontend/src/` and `backend/app.py`

### 📊 Data Analysts
1. Read: QUICK_REFERENCE.md
2. Run: START.bat
3. Navigate to Analysis page
4. Export data to CSV
5. Use in Excel/Tools

### 🔧 System Administrators
1. Read: SETUP_GUIDE.md
2. Read: ARCHITECTURE.md
3. Configure: Backend port, data path, users
4. Deploy: Production setup section
5. Monitor: Check health endpoint

### 👥 End Users
1. Read: QUICK_REFERENCE.md (FAQ section)
2. Run: START.bat
3. Login with provided credentials
4. Browse violations and analysis
5. Export reports as needed

## 📁 Project Structure

```
AAproject/
├── README.md                           ← Start here
├── SETUP_GUIDE.md                      ← Detailed setup
├── QUICK_REFERENCE.md                  ← Quick help
├── ARCHITECTURE.md                     ← How it works
├── INDEX.md                            ← You are here!
├── SETUP.bat                           ← Auto setup
├── START.bat                           ← Quick start
│
├── backend/                            ← Python Flask API
│   ├── app.py                         ← Main backend code
│   └── requirements.txt               ← Python packages
│
├── frontend/                           ← React Dashboard
│   ├── src/
│   │   ├── pages/                     ← Dashboard, Violations, etc.
│   │   ├── components/                ← Navbar, etc.
│   │   ├── App.js                     ← Main React app
│   │   ├── index.js                   ← React entry point
│   │   └── *.css                      ← Styling
│   ├── public/
│   │   └── index.html                 ← HTML template
│   └── package.json                   ← Node packages
│
└── traffic-signal-violation-detection/  ← Your data
    ├── result/
    │   └── violations_report.json     ← Main data file
    └── [other project files]
```

## 🚀 Step-by-Step Instructions

### First Time Setup (15 minutes)

**Step 1**: Open PowerShell in project directory
```powershell
cd c:\Users\shiva\OneDrive\Desktop\AAprojectzip01\AAproject
```

**Step 2**: Run setup (installs everything)
```powershell
.\SETUP.bat
```

**Step 3**: Run application
```powershell
.\START.bat
```

**Step 4**: Browser opens to http://localhost:3000
- Wait 10-15 seconds for React to compile
- Login with: `admin` / `admin123`

**Step 5**: Explore!
- Click on Violations
- Click on Analysis
- Try Export

### Subsequent Starts (2 seconds)
```powershell
.\START.bat
```

## 🔌 API Endpoints Quick List

All endpoints require JWT token in Authorization header.

```
GET    /api/health                    Health check
POST   /api/auth/login               Login
GET    /api/violations               All violations (paginated)
GET    /api/violations/<id>          Specific violation
GET    /api/analysis/overview        Statistics
GET    /api/analysis/timeline        Timeline data
GET    /api/analysis/violation-types Violation analysis
GET    /api/export/csv               Export as CSV
GET    /api/export/json              Export as JSON
```

See [SETUP_GUIDE.md](SETUP_GUIDE.md#-api-endpoints) for detailed examples.

## 🎨 Dashboard Pages

### 🔐 Login Page
- Enter credentials
- Create session
- Save JWT token

### 📊 Dashboard
- Statistics overview
- Violation counts
- Quick navigation

### 📋 Violations Page
- List all violations
- Paginated (10 per page)
- Click to expand
- See violation details

### 📈 Analysis Page
- Overview statistics
- Timeline chart
- Violation type analysis
- Data visualization

### 💾 Export Page
- Download CSV
- Download JSON
- Complete data included

## 🔑 Login Credentials

```
Username: admin        Username: user
Password: admin123     Password: user123
```

Change these in `backend/app.py` USERS dictionary.

## ⚙️ Common Customizations

### Add New User
Edit `backend/app.py`:
```python
USERS = {
    'admin': 'admin123',
    'user': 'user123',
    'newuser': 'newpass'  # Add here
}
```

### Change Backend Port
Edit `backend/app.py`:
```python
app.run(port=8000)  # Change from 5000
```

### Use Different Data File
Edit `backend/app.py`:
```python
VIOLATIONS_REPORT_PATH = '/new/path/violations.json'
```

### Add New Dashboard Page
1. Create `frontend/src/pages/NewPage.js`
2. Add route in `frontend/src/App.js`
3. Add navigation link in `frontend/src/components/Navbar.js`

## 🐛 Common Issues

### "Connection refused on port 5000"
- Backend not running
- Run `python backend/app.py` in separate terminal

### "Module not found" (Python)
- Install dependencies: `pip install -r requirements.txt`

### "Cannot find module" (Node)
- Install packages: `npm install`

### "Port already in use"
- Kill process: `netstat -ano | findstr :3000`
- Or use different port

### "No data showing"
- Check violations file exists
- Check file path in `backend/app.py`
- Check backend is running

## 📞 Support Resources

### In This Project
- README.md - Overview and features
- SETUP_GUIDE.md - Detailed setup help
- ARCHITECTURE.md - How system works
- QUICK_REFERENCE.md - Quick answers

### External Resources
- Python: https://python.org/docs
- Node.js: https://nodejs.org/docs
- React: https://react.dev/learn
- Flask: https://flask.palletsprojects.com
- JWT: https://jwt.io

## 🎓 Learning Path

### For Beginners
1. Read: README.md
2. Watch: Basic React/Flask tutorials online
3. Read: QUICK_REFERENCE.md
4. Run: START.bat
5. Explore: Click around dashboard

### For Intermediate
1. Read: ARCHITECTURE.md
2. Read: SETUP_GUIDE.md
3. Review: backend/app.py code
4. Review: frontend/src code
5. Try: Make small customizations

### For Advanced
1. Study: Complete architecture
2. Review: All code files
3. Add: Database integration
4. Deploy: To production server
5. Scale: For larger datasets

## 📋 Checklist for First Run

- [ ] Python 3.8+ installed
- [ ] Node.js 14+ installed
- [ ] Project files downloaded
- [ ] Run SETUP.bat (or manual setup)
- [ ] Run START.bat
- [ ] Wait for React to compile (10-15 seconds)
- [ ] Browser opens to localhost:3000
- [ ] Login with admin/admin123
- [ ] See dashboard with statistics
- [ ] Click Violations page - see list
- [ ] Click Analysis page - see charts
- [ ] Click Export page - download data

## 🎯 Next Steps

### Ready to Use?
→ Go to [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

### Need Setup Help?
→ Go to [SETUP_GUIDE.md](SETUP_GUIDE.md)

### Want to Customize?
→ Go to [SETUP_GUIDE.md#customization](SETUP_GUIDE.md#customization)

### Understanding Architecture?
→ Go to [ARCHITECTURE.md](ARCHITECTURE.md)

### Need General Info?
→ Go to [README.md](README.md)

## 🚀 Start Now!

```powershell
cd c:\Users\shiva\OneDrive\Desktop\AAprojectzip01\AAproject
.\SETUP.bat        # First time only
.\START.bat        # Every time to start
```

Then open: **http://localhost:3000**

Login with: **admin / admin123**

---

**Version**: 1.0  
**Last Updated**: November 28, 2025  
**Status**: Ready to Use ✅

**Questions?** Check the relevant documentation file above!
