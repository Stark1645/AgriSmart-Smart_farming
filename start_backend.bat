@echo off
title AgriSmart Backend (Spring Boot)
color 0B
set "ROOT=%~dp0"
cd /d "%ROOT%backend"
echo ===================================================
echo   Starting AgriSmart Spring Boot Backend (Port 8080)
echo ===================================================
mvn spring-boot:run
pause
