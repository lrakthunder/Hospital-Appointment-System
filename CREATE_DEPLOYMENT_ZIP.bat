@echo off
echo Creating deployment package...
echo.

REM Delete old deployment zip if exists
if exist "Hospital-Appointment-System-DEPLOYMENT.zip" del "Hospital-Appointment-System-DEPLOYMENT.zip"

echo Building Angular frontend...
cd client
call npm run build -- --configuration production
cd ..

echo.
echo Creating zip package (excluding node_modules and client source)...
echo.

REM Using PowerShell to create zip excluding certain folders
powershell -Command "& {Get-ChildItem -Path '.' -Exclude 'client','node_modules','.git','Hospital-Appointment-System-DEPLOYMENT.zip','*.bat' | Compress-Archive -DestinationPath 'Hospital-Appointment-System-DEPLOYMENT.zip' -Force}"

echo.
echo ========================================
echo Deployment package created successfully!
echo File: Hospital-Appointment-System-DEPLOYMENT.zip
echo ========================================
echo.
echo Upload this zip file to Hostinger along with:
echo 1. The SQL database file
echo 2. DEPLOYMENT_INSTRUCTIONS.md
echo.
pause
