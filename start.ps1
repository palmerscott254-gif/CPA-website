# CPA Academy - Startup Script (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    CPA Academy - Startup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Starting Django Backend..." -ForegroundColor Green
$backendPath = Join-Path $scriptDir "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; python manage.py runserver"

Write-Host ""
Write-Host "Waiting 3 seconds for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Starting React Frontend..." -ForegroundColor Green
$frontendPath = Join-Path $scriptDir "Frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm start"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Both servers are starting up..." -ForegroundColor White
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor White
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
