# Kill any process using port 3000
$processId = (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue).OwningProcess
if ($processId) {
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Write-Host "Killed process using port 3000"
    Start-Sleep -Seconds 1
}

# Start Convex in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npx convex dev"

# Wait a moment for Convex to start
Start-Sleep -Seconds 2

# Start Next.js
npm run dev
