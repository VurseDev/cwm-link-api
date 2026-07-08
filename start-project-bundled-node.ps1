param(
    [string]$NodeDir = (Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) 'tools\node'),
    [switch]$CheckOnly,
    [switch]$SkipInstall,
    [switch]$NoStart
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = $root
$clientDir = Join-Path $root 'client'
$authDir = Join-Path $root 'auth-service'

function Write-Step([string]$Message) {
    Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Test-Command([string]$Name) {
    return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

function Ensure-Tool([string]$Name, [string]$InstallHint) {
    if (Test-Command $Name) {
        return
    }

    Write-Host "$Name not found. $InstallHint" -ForegroundColor Yellow
    throw "Missing required tool: $Name"
}

function Ensure-EnvFile([string]$Source, [string]$Destination) {
    if (-not (Test-Path $Destination)) {
        Copy-Item $Source $Destination -Force
        Write-Host "Created $Destination from example" -ForegroundColor Green
    }
}

function Get-EnvValue([string]$Path, [string]$Key) {
    if (-not (Test-Path $Path)) {
        return $null
    }
    foreach ($line in Get-Content $Path) {
        if ($line -match "^\s*$Key\s*=\s*(.+)\s*$") {
            return $matches[1].Trim()
        }
    }
    return $null
}

function Test-PortInUse([int]$Port) {
    try {
        return (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue) -ne $null
    } catch {
        $pattern = ":$Port\s"
        return (netstat -ano | Select-String $pattern) -ne $null
    }
}

function Find-FreePort([int]$StartPort, [int]$MaxPort=3100) {
    for ($p = $StartPort; $p -le $MaxPort; $p++) {
        if (-not (Test-PortInUse $p)) {
            return $p
        }
    }
    throw "No free port found between $StartPort and $MaxPort."
}

function Get-NodeExe([string]$NodeDir) {
    $nodeExe = Join-Path $NodeDir 'node.exe'
    if (-not (Test-Path $nodeExe)) {
        throw "Node binary not found at $nodeExe. Provide a valid -NodeDir containing node.exe."
    }
    return $nodeExe
}

function Get-NpmCli([string]$NodeDir) {
    $npmCli = Join-Path $NodeDir 'node_modules\npm\bin\npm-cli.js'
    if (-not (Test-Path $npmCli)) {
        throw "NPM CLI not found at $npmCli. Ensure $NodeDir contains node_modules\npm\bin\npm-cli.js."
    }
    return $npmCli
}

function Invoke-CommandIn([string]$WorkingDirectory, [string]$Command, [string[]]$Arguments) {
    Push-Location $WorkingDirectory
    try {
        & $Command @Arguments
        if ($LASTEXITCODE -ne 0) {
            throw "Command failed with exit code ${LASTEXITCODE}: $Command $($Arguments -join ' ')"
        }
    }
    finally {
        Pop-Location
    }
}

$nodeExe = Get-NodeExe $NodeDir
$npmCli = Get-NpmCli $NodeDir

Write-Step 'Checking prerequisites'
Ensure-Tool 'bun' 'Install Bun from https://bun.sh and reopen PowerShell.'

if ($CheckOnly) {
    Write-Host 'Environment looks good. No services were started.' -ForegroundColor Green
    exit 0
}

Write-Step 'Preparing environment files'
Ensure-EnvFile (Join-Path $root '.env.example') (Join-Path $root '.env')
Ensure-EnvFile (Join-Path $clientDir '.env.example') (Join-Path $clientDir '.env')
Ensure-EnvFile (Join-Path $authDir '.env.example') (Join-Path $authDir '.env')

if (-not $SkipInstall) {
    Write-Step 'Installing backend dependencies'
    if (-not (Test-Path (Join-Path $backendDir 'node_modules'))) {
        Invoke-CommandIn $backendDir $nodeExe @($npmCli, 'install')
    }

    Write-Step 'Installing frontend dependencies'
    if (-not (Test-Path (Join-Path $clientDir 'node_modules'))) {
        Invoke-CommandIn $clientDir $nodeExe @($npmCli, 'install')
    }

    Write-Step 'Installing auth-service dependencies'
    if (-not (Test-Path (Join-Path $authDir 'node_modules'))) {
        Invoke-CommandIn $authDir 'bun' @('install')
    }
}
else {
    Write-Host 'Skipping dependency installation because -SkipInstall was supplied.' -ForegroundColor Yellow
}

Write-Step 'Preparing Prisma and Drizzle databases'
Invoke-CommandIn $backendDir $nodeExe @($npmCli, 'run', 'prisma:generate')
Invoke-CommandIn $backendDir $nodeExe @($npmCli, 'run', 'prisma:deploy')
Invoke-CommandIn $authDir 'bun' @('run', 'db:generate')
Invoke-CommandIn $authDir 'bun' @('run', 'db:migrate')

$backendPortText = Get-EnvValue (Join-Path $root '.env') 'PORT'
if (-not $backendPortText) {
    $backendPortText = '3005'
}
$backendPort = [int]$backendPortText
$chosenPort = Find-FreePort $backendPort
if ($chosenPort -ne $backendPort) {
    Write-Host "Port $backendPort is in use. Using next available port $chosenPort instead." -ForegroundColor Yellow
}
else {
    Write-Step "Using backend port $chosenPort"
}

if ($NoStart) {
    Write-Host 'Setup complete. Services were not started because -NoStart was supplied.' -ForegroundColor Green
    exit 0
}

Write-Step 'Starting services'
$authCommand = 'cd /d "{0}" && bun run dev' -f $authDir
$apiCommand = 'cd /d "{0}" && "{1}" "{2}" run start:dev' -f $backendDir, $nodeExe, $npmCli
$frontendCommand = 'cd /d "{0}" && "{1}" "{2}" run dev' -f $clientDir, $nodeExe, $npmCli

Start-Process cmd -ArgumentList '/k', $authCommand -WindowStyle Normal | Out-Null
Start-Process cmd -ArgumentList '/k', $apiCommand -WindowStyle Normal | Out-Null
Start-Process cmd -ArgumentList '/k', $frontendCommand -WindowStyle Normal | Out-Null

Write-Host ''
Write-Host 'Auth service: http://localhost:3000' -ForegroundColor Green
Write-Host "Backend API: http://localhost:$chosenPort" -ForegroundColor Green
Write-Host 'Frontend: http://localhost:5173' -ForegroundColor Green
Write-Host ''
Write-Host 'All services were launched in separate terminal windows.' -ForegroundColor Green
