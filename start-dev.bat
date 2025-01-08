@echo off
echo Starting development environment...

:: Kill all Node.js processes first
echo Killing all Node.js processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak

:: Double-check and kill any remaining processes on ports
echo Checking for remaining processes on ports...
for %%p in (3000,3001,3002,3003,3004,3005) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| find ":%%p" ^| find "LISTENING"') do (
        echo Killing process on port %%p (PID: %%a)
        taskkill /F /PID %%a 2>nul
    )
)

:: Wait for ports to be fully released
echo Waiting for ports to be released...
timeout /t 3 /nobreak

:: Start Convex in a new window
echo Starting Convex...
start "Convex Server" cmd /c "npx convex dev"

:: Wait for Convex to start
echo Waiting for Convex to start...
timeout /t 5 /nobreak

:: Start Next.js in the same window
echo Starting Next.js...
cmd /k "npm run dev"
