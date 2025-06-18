Write-Host "Checking if pnpm is installed..."

# Check if pnpm is available
$pnpm = Get-Command pnpm -ErrorAction SilentlyContinue

if (-not $pnpm) {
    Write-Host "Pnpm is not installed. Installing now..."
    npm install -g @pnpm/exe@latest-10 --force
    Write-Host "Pnpm installation script executed."
    Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/k runWindows.ps1"
    Pause
    exit
} else {
    Write-Host "Pnpm is already installed."
}

Write-Host "Starting the application..."
Write-Host "Starting backend and frontend in new terminal windows..."

# Start backend in new window
Start-Process -WindowStyle Normal -FilePath "cmd.exe" -ArgumentList "/k cd backend && npm install && npm start"

# Start frontend in new window
Start-Process -WindowStyle Normal -FilePath "cmd.exe" -ArgumentList "/k cd frontend && pnpm install && pnpm start"

Pause
exit