@echo off
echo Starting development environment...

:: Kill any existing processes on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    taskkill /F /PID %%a 2>nul
)

:: Start Convex in a new window
start "Convex Server" cmd /c "npx convex dev"

:: Wait for Convex to start
echo Waiting for Convex to start...
timeout /t 5 /nobreak

:: Start Next.js in the same window
echo Starting Next.js...
cmd /k "npm run dev"
