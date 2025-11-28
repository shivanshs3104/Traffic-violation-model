@echo off
REM Start Backend
cd /d "%~dp0backend"
start cmd /k python app.py

REM Start Frontend
cd /d "%~dp0frontend"
timeout /t 3
start cmd /k npm start

echo.
echo ============================================
echo   Starting Traffic Violation Detection
echo ============================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Two terminal windows should open automatically.
echo If not, start them manually:
echo.
echo Terminal 1: cd backend && python app.py
echo Terminal 2: cd frontend && npm start
echo.
echo Login with: admin / admin123
echo.
pause
