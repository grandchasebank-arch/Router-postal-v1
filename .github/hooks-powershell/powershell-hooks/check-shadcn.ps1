# .github/hooks/check-shadcn.ps1
# Finds any component NOT using the correct shadcn import path
# Usage: .\check-shadcn.ps1 [optional-path]
# Example: .\check-shadcn.ps1 src\components\dashboard

param(
    [string]$Target = "src"
)

Write-Host ""
Write-Host "🔎 shadcn Component Import Checker" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Scanning: $Target"
Write-Host ""

# Check for direct radix imports (should go through @/components/ui)
Write-Host "── Direct @radix-ui imports (should use @/components/ui instead) ──" -ForegroundColor Yellow
$radix = Get-ChildItem -Path $Target -Recurse -Include "*.tsx","*.ts" -ErrorAction SilentlyContinue |
    Select-String -Pattern "from '@radix-ui|from `"@radix-ui" -ErrorAction SilentlyContinue

if (-not $radix) {
    Write-Host "✅ None found" -ForegroundColor Green
} else {
    $radix | ForEach-Object { Write-Host $_.ToString() -ForegroundColor Red }
}

Write-Host ""

# Check for shadcn package direct imports
Write-Host "── Direct shadcn package imports ──" -ForegroundColor Yellow
$shadcnDirect = Get-ChildItem -Path $Target -Recurse -Include "*.tsx","*.ts" -ErrorAction SilentlyContinue |
    Select-String -Pattern "from 'shadcn|from `"shadcn" -ErrorAction SilentlyContinue

if (-not $shadcnDirect) {
    Write-Host "✅ None found" -ForegroundColor Green
} else {
    $shadcnDirect | ForEach-Object { Write-Host $_.ToString() -ForegroundColor Red }
}

Write-Host ""

# List all @/components/ui imports to verify they're correct
Write-Host "── All @/components/ui imports (should all look correct) ──" -ForegroundColor Yellow
Get-ChildItem -Path $Target -Recurse -Include "*.tsx","*.ts" -ErrorAction SilentlyContinue |
    Select-String -Pattern "from '@/components/ui" -ErrorAction SilentlyContinue |
    Select-Object -First 40 |
    ForEach-Object { Write-Host $_.ToString() -ForegroundColor Gray }

Write-Host ""

# Find components installed in src/components/ui
Write-Host "── shadcn components installed in this project ──" -ForegroundColor Yellow
Get-ChildItem -Path "src\components\ui" -Filter "*.tsx" -ErrorAction SilentlyContinue |
    ForEach-Object { Write-Host $_.BaseName -ForegroundColor Cyan }

Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "✅ Check complete" -ForegroundColor Green
