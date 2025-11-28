@echo off
REM Traffic Violation Detection System - Quick Start
REM This script starts both backend and frontend

echo.
echo ============================================
echo   Traffic Violation Detection System
echo   Quick Start Script
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python is not installed!
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo ✓ Node.js found
echo ✓ Python found
echo.

REM Get current directory
set SCRIPT_DIR=%~dp0

echo Installing backend dependencies...
cd /d "%SCRIPT_DIR%backend"
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd /d "%SCRIPT_DIR%frontend"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo To start the application:
echo.
echo 1. Backend (Terminal 1):
echo    cd backend
echo    python app.py
echo.
echo 2. Frontend (Terminal 2):
echo    cd frontend
echo    npm start
echo.
echo Then open: http://localhost:3000
echo Login with: admin / admin123
echo.
pause
