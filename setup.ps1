# CPA Academy - Setup Script (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    CPA Academy - Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Check if Python is installed
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found. Please install Python 3.8+ from https://python.org" -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js from https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Setting up Backend..." -ForegroundColor Green
$backendPath = Join-Path $scriptDir "backend"

# Install Python dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
Set-Location $backendPath
pip install -r requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Python dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install Python dependencies" -ForegroundColor Red
    exit 1
}

# Run migrations
Write-Host "Running database migrations..." -ForegroundColor Yellow
python manage.py makemigrations
python manage.py migrate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database migrations completed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to run migrations" -ForegroundColor Red
    exit 1
}

# Populate sample data
Write-Host "Populating sample data..." -ForegroundColor Yellow
python manage.py populate_data

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Sample data populated" -ForegroundColor Green
} else {
    Write-Host "! Sample data population failed (this is optional)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Setting up Frontend..." -ForegroundColor Green
$frontendPath = Join-Path $scriptDir "Frontend"

# Install Node.js dependencies
Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
Set-Location $frontendPath
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install Node.js dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application:" -ForegroundColor White
Write-Host "1. Run: .\start.ps1" -ForegroundColor Yellow
Write-Host "2. Or manually start both servers:" -ForegroundColor Yellow
Write-Host "   - Backend:  cd backend && python manage.py runserver" -ForegroundColor Yellow
Write-Host "   - Frontend: cd Frontend && npm start" -ForegroundColor Yellow
Write-Host ""
Write-Host "Access the application at:" -ForegroundColor White
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "- Backend:  http://localhost:8000" -ForegroundColor Yellow
Write-Host "- Admin:    http://localhost:8000/admin (admin/admin123)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor White
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
