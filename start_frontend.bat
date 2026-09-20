@echo off
title AgriSmart Frontend (React + Vite)
color 0A
set "ROOT=%~dp0"
cd /d "%ROOT%frontend"
echo ===================================================
echo   Starting AgriSmart React Frontend (Port 5173)
echo ===================================================
npm run dev
pause
