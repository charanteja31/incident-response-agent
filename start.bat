@echo off
echo ========================================================
echo         RescueOps AI - Intelligent Command Center
echo ========================================================
echo.
echo Installing dependencies...
call npm install

echo.
echo Starting RescueOps AI Backend Server and Frontend...
call npm run start

pause
