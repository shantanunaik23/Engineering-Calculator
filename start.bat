@echo off
REM ────────────────────────────────────────────────────────────────
REM Engineering Calculator Quick Start (Windows)
REM ────────────────────────────────────────────────────────────────

echo.
echo  ╔════════════════════════════════════════════════════════════╗
echo  ║  Engineering Calculator - Quick Start                      ║
echo  ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where /q node
if errorlevel 1 (
    echo  ❌ Node.js not found!
    echo.
    echo  Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo  ✅ Node.js detected
node --version
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo  📦 Installing dependencies (npm install)...
    echo.
    call npm install
    if errorlevel 1 (
        echo  ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
    echo  ✅ Dependencies installed
) else (
    echo  ✅ Dependencies already installed
)

echo.
echo  🚀 Starting Engineering Calculator server...
echo.
echo  ───────────────────────────────────────────────────────────
echo  
echo  📍 Open your browser: http://localhost:3000
echo  
echo  ───────────────────────────────────────────────────────────
echo.
echo  Press Ctrl+C to stop the server
echo.

REM Start the server
call npm start

pause
