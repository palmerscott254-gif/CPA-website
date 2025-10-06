@echo off
echo ========================================
echo    CPA Academy - Startup Script
echo ========================================
echo.

echo Starting Django Backend...
cd /d "%~dp0backend"
start "Django Backend" cmd /k "python manage.py runserver"

echo.
echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting React Frontend...
cd /d "%~dp0Frontend"
start "React Frontend" cmd /k "npm start"

echo.
echo ========================================
echo Both servers are starting up...
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to exit...
pause >nul
