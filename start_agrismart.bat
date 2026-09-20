@echo off
title AgriSmart Full-Stack Launcher
color 0A

echo ======================================================================
echo           AGRISMART: SMART FARMING & PRECISION AGRICULTURE           
echo               Frontend + Backend Full-Stack Launcher                 
echo ======================================================================
echo.

set "ROOT=%~dp0"

echo [1/3] Verifying environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not found in PATH!
    pause
    exit /b 1
)

where mvn >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Maven is not installed or not found in PATH!
    pause
    exit /b 1
)
echo [OK] Node.js and Maven detected.
echo.

echo [2/3] Starting Spring Boot Backend on http://localhost:8080 ...
start "AgriSmart Backend (Spring Boot: 8080)" cmd /k "cd /d "%ROOT%backend" && echo Starting Spring Boot Backend... && mvn spring-boot:run"

echo [3/3] Starting React Vite Frontend on http://localhost:5173 ...
start "AgriSmart Frontend (React: 5173)" cmd /k "cd /d "%ROOT%frontend" && echo Starting React Vite Server... && npm run dev"

echo.
echo ======================================================================
echo  AgriSmart Services are starting up:
echo   - Frontend UI: http://localhost:5173
echo   - Backend API: http://localhost:8080/api
echo   - Swagger UI:  http://localhost:8080/swagger-ui/index.html
echo ======================================================================
echo.
echo Opening browser in 6 seconds...
timeout /t 6 /nobreak >nul

start http://localhost:5173
echo [SUCCESS] AgriSmart is running! You may close or minimize this launcher window.
pause
