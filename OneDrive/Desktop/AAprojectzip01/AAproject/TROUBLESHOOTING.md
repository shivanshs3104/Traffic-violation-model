# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### 🔴 Application Won't Start

#### Problem: "python is not recognized"
**Solution:**
1. Python not installed
   ```powershell
   # Download from https://www.python.org/downloads/
   # Make sure to check "Add Python to PATH" during install
   ```
2. Python not in PATH
   ```powershell
   # Add manually to PATH environment variable
   # Or reinstall Python and check the PATH option
   ```

#### Problem: "npm is not recognized"
**Solution:**
1. Node.js not installed
   ```powershell
   # Download from https://nodejs.org/
   # Install with default options
   ```
2. Restart PowerShell after installing
   ```powershell
   # Close and reopen PowerShell to reload PATH
   ```

---

### 🔴 Backend Issues (Port 5000)

#### Problem: "Address already in use"
**Error:** `OSError: [WinError 10048] Only one usage of each socket address`

**Solution 1 - Use different port:**
```python
# Edit backend/app.py, change last line:
app.run(debug=True, host='0.0.0.0', port=8000)  # Changed from 5000
```

**Solution 2 - Kill existing process:**
```powershell
# Find process on port 5000
netstat -ano | findstr :5000
# Output: TCP    127.0.0.1:5000    LISTENING    1234
# Kill it (replace 1234 with actual PID)
taskkill /PID 1234 /F
```

**Solution 3 - System restart**
```powershell
Restart-Computer
```

#### Problem: Backend starts but won't respond
**Solution:**
```powershell
# Test if backend is running
curl http://localhost:5000/api/health

# If connection refused, check:
# 1. Is it still running in terminal?
# 2. Any errors in terminal output?
# 3. Is firewall blocking it?
```

#### Problem: "ModuleNotFoundError: No module named 'flask'"
**Solution:**
```powershell
cd backend
pip install -r requirements.txt

# Or install individually
pip install Flask==2.3.3
pip install Flask-CORS==4.0.0
pip install Flask-JWT-Extended==4.5.2
```

---

### 🔴 Frontend Issues (Port 3000)

#### Problem: "Port 3000 already in use"
**Solution 1 - Use different port:**
```powershell
$env:PORT=3001
npm start
```

**Solution 2 - Kill process:**
```powershell
# Find and kill
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Solution 3 - Stop other services**
```powershell
# Check what's running on 3000
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
```

#### Problem: npm modules won't install
**Solution:**
```powershell
cd frontend

# Clear cache
npm cache clean --force

# Delete existing node_modules
rm -r node_modules
rm package-lock.json

# Reinstall
npm install
```

#### Problem: "Cannot find module React"
**Solution:**
```powershell
# Reinstall all packages
npm install

# Check if node_modules exists
ls node_modules | grep react

# If missing, try:
npm install react react-dom react-router-dom
```

#### Problem: React won't compile
**Error:** Various compilation errors

**Solution:**
```powershell
# 1. Check for syntax errors in your code
# 2. Clear cache
npm cache clean --force

# 3. Delete build artifacts
rm -r build
rm package-lock.json

# 4. Reinstall and restart
npm install
npm start
```

---

### 🔴 Connection Issues

#### Problem: CORS Error (Access-Control-Allow-Origin)
**Error in console:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
```
This means backend is not running!

1. Ensure backend is running: python backend/app.py
2. Check backend shows no errors
3. Test manually: curl http://localhost:5000/api/health
4. Refresh browser after backend starts
```

#### Problem: Frontend can't reach backend
**Frontend shows:** "Connection error. Make sure backend is running"

**Solutions:**
```powershell
# 1. Is backend running?
# Terminal 1: python backend/app.py

# 2. Is it on port 5000?
netstat -ano | findstr :5000

# 3. Test the endpoint
curl http://localhost:5000/api/health

# 4. Check firewall
# Windows Defender might block it
# Add Python to firewall exceptions
```

#### Problem: "localhost refused to connect"
**Solution:**
1. Backend not running
2. Try different port
3. Firewall issue
4. System needs restart

---

### 🔴 Login Issues

#### Problem: Login fails with any credentials
**Solutions:**

```
1. Check backend is running
   Terminal should show: "Running on http://127.0.0.1:5000"

2. Check credentials are correct
   Default: admin / admin123
   or: user / user123

3. Check browser console for errors
   Press F12 → Console tab

4. Check network requests
   Press F12 → Network tab → Try login → See request

5. Restart backend and try again
```

#### Problem: Token not saved
**Solution:**
```javascript
// Browser localStorage might be disabled
// Open DevTools and check:
// F12 → Application → Local Storage

// Also try:
// 1. Clear browser cache: Ctrl+Shift+Delete
// 2. Try different browser
// 3. Disable browser extensions
```

---

### 🔴 Data Not Showing

#### Problem: "No violations found"
**Solutions:**

```powershell
# 1. Check violations file exists
Test-Path "traffic-signal-violation-detection/result/violations_report (1).json"

# 2. Check file path in backend/app.py
# Should match the actual location

# 3. Check file is valid JSON
# Open it in VS Code and check syntax

# 4. Verify backend can read it
# Add print statement in app.py:
print(f"File exists: {os.path.exists(VIOLATIONS_REPORT_PATH)}")
print(f"File path: {VIOLATIONS_REPORT_PATH}")
```

#### Problem: API returns empty data
**Solution:**
```powershell
# Test API directly:
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/violations

# Check JSON file:
# 1. Open violations_report.json
# 2. Check it's valid JSON
# 3. Check it's not empty
# 4. Try first 100 lines: less -n 100 violations_report.json
```

---

### 🔴 Performance Issues

#### Problem: Application is slow
**Solutions:**

```
Frontend:
1. Check browser - too many tabs open?
2. Close DevTools if open
3. Disable browser extensions
4. Clear browser cache
5. Try Incognito mode

Backend:
1. Check memory usage: Task Manager
2. Restart backend
3. Large JSON file loading slowly?
4. Consider database instead of JSON
```

#### Problem: Pagination not working
**Solution:**
```powershell
# Check backend logs for errors
# Try specific page: /api/violations?page=2&per_page=10
# If 404, data might be empty
```

---

### 🟡 Minor Issues

#### Problem: Styling looks wrong
**Solution:**
```powershell
cd frontend
npm install  # Reinstall packages
npm start    # Restart frontend

# Also try:
# Ctrl+Shift+Delete in browser to clear cache
# F12 → Application → Cache → Clear All
```

#### Problem: Buttons don't respond
**Solution:**
```
1. Check browser console for JavaScript errors (F12)
2. Try refreshing page (F5)
3. Close DevTools (F12)
4. Restart browser
```

#### Problem: Export button doesn't work
**Solution:**
```powershell
# 1. Ensure backend is running
# 2. Check browser allows downloads
# 3. Check /tmp folder has write permissions
# 4. Try different export format

# Check backend logs for export errors
```

---

### 🟢 Verification Steps

#### Check Everything is Working

```powershell
# 1. Python is installed
python --version  # Should show version 3.8+

# 2. Node is installed
node --version    # Should show version 14+

# 3. Backend dependencies installed
cd backend
pip list | findstr Flask

# 4. Frontend dependencies installed
cd ../frontend
npm list react    # Should show react version

# 5. Start backend
cd ../backend
python app.py
# Should show: Running on http://127.0.0.1:5000

# 6. Test backend
# In another PowerShell:
curl http://localhost:5000/api/health
# Should return JSON

# 7. Start frontend (in another terminal)
cd frontend
npm start
# Should compile and open browser

# 8. Login
# Should work with admin/admin123
```

---

### 📞 Getting Help

#### Before Asking for Help

- [ ] Checked terminal output for errors?
- [ ] Read SETUP_GUIDE.md?
- [ ] Tried restarting both services?
- [ ] Cleared browser cache?
- [ ] Checked firewall?
- [ ] Verified Python/Node/npm installed?
- [ ] Looked at browser console (F12)?
- [ ] Checked violations file exists?

#### Debug Information to Collect

```powershell
# Python version
python --version

# Node version
node --version
npm --version

# Windows version
systeminfo | findstr /C:"OS Name" /C:"OS Version"

# Backend logs (copy from terminal)
# Frontend console logs (F12 → Console)
# Network requests (F12 → Network)

# Error messages (exact text)
# Steps to reproduce
```

---

## Emergency Fix

If everything is broken, try this:

```powershell
# 1. Stop both services (Ctrl+C in terminals)

# 2. Clean everything
cd backend
Remove-Item -Recurse -Force venv -ErrorAction SilentlyContinue

cd ../frontend
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# 3. Reinstall
cd ../backend
pip install -r requirements.txt

cd ../frontend
npm install

# 4. Start fresh
cd ../backend
python app.py

# (new terminal)
cd frontend
npm start

# 5. Visit http://localhost:3000
# Login with admin / admin123
```

---

## Still Stuck?

### Try These Resources

1. **Official Docs**
   - Python: https://docs.python.org/3/
   - Node.js: https://nodejs.org/docs/
   - React: https://react.dev/learn
   - Flask: https://flask.palletsprojects.com/

2. **Online Help**
   - Stack Overflow: Search your error
   - GitHub Issues: Search similar problems
   - ChatGPT/Copilot: Describe the issue

3. **Project Documentation**
   - README.md - Overview
   - SETUP_GUIDE.md - Setup help
   - ARCHITECTURE.md - How it works
   - QUICK_REFERENCE.md - Quick answers

---

## Prevention Tips

1. **Keep terminal open** - See errors as they happen
2. **Check file paths** - Most issues are path-related
3. **One thing at a time** - Change one setting, test
4. **Read error messages** - They usually tell you what's wrong
5. **Restart services** - Fixes many issues
6. **Clear caches** - npm and browser
7. **Check prerequisites** - Python, Node, npm versions

---

## Performance Optimization

### If Running Slowly

**Backend:**
```python
# Add to app.py before routes:
from functools import lru_cache

@lru_cache(maxsize=1)
def load_violations():
    # Cached violations loading
```

**Frontend:**
```javascript
// React optimization
import { memo } from 'react';
export default memo(YourComponent);
```

---

## Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| "Port already in use" | Another app using port | Change port or kill process |
| "ModuleNotFoundError" | Package not installed | `pip install package_name` |
| "CORS error" | Backend not running | Start backend on port 5000 |
| "Cannot find module" | npm module missing | `npm install` |
| "Connection refused" | Backend not running | Check backend terminal |
| "Invalid credentials" | Wrong username/password | Use admin/admin123 |
| "File not found" | Wrong path in app.py | Check violations file location |
| "Permission denied" | Access rights | Run terminal as admin |

---

**Last Updated**: November 28, 2025

**Remember**: Most issues are solved by:
1. Restarting the service
2. Reading the error message carefully
3. Checking the relevant documentation

Good luck! 🚀
