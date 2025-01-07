@echo off
echo Stopping development servers...

:: Kill processes on port 3000 (Next.js)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /F /PID %%a

:: Kill any node.exe processes running Convex (this will find the Convex process)
taskkill /F /IM "node.exe" /FI "WINDOWTITLE eq Convex Server"

echo All servers stopped!
