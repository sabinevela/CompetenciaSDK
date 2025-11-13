#!/usr/bin/env pwsh
# CompetenciaSDK - Quick Setup Script
# Run this script to get started quickly

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║      CompetenciaSDK - Automated Setup Script          ║" -ForegroundColor Cyan
Write-Host "║      Climate & Disaster Alert Platform                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

$prerequisites = @{
    "Node.js" = { node --version }
    "npm" = { npm --version }
    "git" = { git --version }
}

$allOK = $true
foreach ($name in $prerequisites.Keys) {
    try {
        $version = & $prerequisites[$name] 2>&1 | Select-Object -First 1
        Write-Host "  ✅ $name - $version" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ $name - NOT FOUND (required)" -ForegroundColor Red
        $allOK = $false
    }
}

if (-not $allOK) {
    Write-Host "`n❌ Missing prerequisites. Please install Node.js and git." -ForegroundColor Red
    exit 1
}

# Setup backend
Write-Host "`n🖥️  Setting up backend..." -ForegroundColor Yellow

if (Test-Path "server") {
    Push-Location server
    
    if (-not (Test-Path "node_modules")) {
        Write-Host "  📦 Installing backend dependencies..."
        npm install
    } else {
        Write-Host "  ✅ Backend dependencies already installed"
    }
    
    if (-not (Test-Path ".env")) {
        Write-Host "  📝 Creating .env from template..."
        Copy-Item .env.example .env
        Write-Host "  ⚠️  Edit server/.env with your API keys:" -ForegroundColor Yellow
        Write-Host "      - OPENWEATHER_KEY from https://openweathermap.org/api"
        Write-Host "      - OPENAI_API_KEY from https://platform.openai.com/api-keys"
    } else {
        Write-Host "  ✅ .env already exists"
    }
    
    Pop-Location
} else {
    Write-Host "  ❌ server/ folder not found" -ForegroundColor Red
}

# Setup frontend
Write-Host "`n📱 Setting up frontend..." -ForegroundColor Yellow

if (-not (Test-Path "node_modules")) {
    Write-Host "  📦 Installing frontend dependencies..."
    npm install
} else {
    Write-Host "  ✅ Frontend dependencies already installed"
}

# Setup verification
Write-Host "`n✅ Setup complete!`n" -ForegroundColor Green

Write-Host "📖 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "1. Configure API keys:"
Write-Host "   Edit: server\.env"
Write-Host "   Get OpenWeatherMap key: https://openweathermap.org/api"
Write-Host "   Get OpenAI key: https://platform.openai.com/api-keys`n"

Write-Host "2. Start backend (Terminal 1):"
Write-Host "   cd server"
Write-Host "   npm run dev`n"

Write-Host "3. Start frontend (Terminal 2):"
Write-Host "   npm start`n"

Write-Host "4. Open Expo Go app on your device"
Write-Host "   Scan the QR code from Terminal 2`n"

Write-Host "5. Test the API:"
Write-Host "   See TESTING.md for curl commands`n"

Write-Host "📚 READ FIRST:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "  1. QUICKSTART.md (5 min) - Quick setup guide"
Write-Host "  2. README.md (10 min) - Project overview"
Write-Host "  3. ARCHITECTURE.md (15 min) - System design"
Write-Host "  4. DOCS_INDEX.md - Complete documentation map`n"

Write-Host "🚀 READY FOR DEVELOPMENT!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"
