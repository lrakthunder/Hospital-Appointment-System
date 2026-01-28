@echo off
echo ====================================
echo  Hospital Appointment System Startup
echo ====================================
echo.

echo [1/2] Starting Laravel Backend (Port 8000)...
start "Laravel Backend" cmd /k "cd /d "%~dp0" && php -S 127.0.0.1:8000 -t public_html"
timeout /t 3 > nul

echo.
echo [2/2] Starting Angular Frontend (Port 4200)...
start "Angular Frontend" cmd /k "cd /d "%~dp0client" && npm start"

echo.
echo ====================================
echo  System Starting...
echo ====================================
echo.
echo Backend API:  http://127.0.0.1:8000
echo Frontend:     http://localhost:4200
echo.
echo Login at: http://localhost:4200/login
echo.
echo Demo Credentials:
echo Admin:   admin@hospital.com / password
echo User:    user@test.com / password
echo Doctor:  doctor@test.com / password
echo.
echo Press any key to exit (servers will keep running)...
pause > nul
