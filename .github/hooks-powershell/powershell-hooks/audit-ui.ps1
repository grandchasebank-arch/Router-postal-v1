# .github/hooks/audit-ui.ps1
# Full UI audit — run this at the START of any fix session
# Usage: .\audit-ui.ps1

Write-Host ""
Write-Host "╔══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║      Portal Panel — UI Audit         ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 1. TypeScript errors
Write-Host "── TypeScript errors ──────────────────" -ForegroundColor Yellow
$tsOutput = npx tsc --noEmit 2>&1
$tsErrors = $tsOutput | Where-Object { $_ -match "error TS" }

if (-not $tsErrors) {
    Write-Host "✅ No TypeScript errors" -ForegroundColor Green
} else {
    $tsErrors | Select-Object -First 30 | ForEach-Object { Write-Host $_ -ForegroundColor Red }
    Write-Host ""
    Write-Host "⚠️  $($tsErrors.Count) TypeScript error(s) found" -ForegroundColor Yellow
}

Write-Host ""

# 2. Wrong import paths (non-@/components/ui shadcn imports)
Write-Host "── Wrong shadcn import paths ──────────" -ForegroundColor Yellow
$wrongImports = Get-ChildItem -Path "src" -Recurse -Include "*.tsx","*.ts" -ErrorAction SilentlyContinue |
    Select-String -Pattern "from 'shadcn|from `"shadcn|from '@radix-ui|from `"@radix-ui" -ErrorAction SilentlyContinue

if (-not $wrongImports) {
    Write-Host "✅ All shadcn imports use @/components/ui/" -ForegroundColor Green
} else {
    Write-Host "❌ Wrong import paths found:" -ForegroundColor Red
    $wrongImports | ForEach-Object { Write-Host $_.ToString() -ForegroundColor Red }
}

Write-Host ""

# 3. Missing cn() import
Write-Host "── cn() import check ──────────────────" -ForegroundColor Yellow
$cnWrong = Get-ChildItem -Path "src\components" -Recurse -Include "*.tsx" -ErrorAction SilentlyContinue |
    Select-String -Pattern "from '.*utils'" -ErrorAction SilentlyContinue |
    Where-Object { $_ -notmatch "@/lib/utils" }

if (-not $cnWrong) {
    Write-Host "✅ cn() imported from @/lib/utils everywhere" -ForegroundColor Green
} else {
    Write-Host "❌ Wrong cn() import paths:" -ForegroundColor Red
    $cnWrong | ForEach-Object { Write-Host $_.ToString() -ForegroundColor Red }
}

Write-Host ""

# 4. Components with TODO/FIXME
Write-Host "── TODO / FIXME markers ───────────────" -ForegroundColor Yellow
$todos = Get-ChildItem -Path "src" -Recurse -Include "*.tsx","*.ts" -ErrorAction SilentlyContinue |
    Select-String -Pattern "TODO|FIXME|HACK|BROKEN|BUG" -ErrorAction SilentlyContinue

if (-not $todos) {
    Write-Host "✅ No TODO/FIXME markers" -ForegroundColor Green
} else {
    $todos | Select-Object -First 20 | ForEach-Object { Write-Host $_.ToString() -ForegroundColor Yellow }
}

Write-Host ""

# 5. Installed shadcn components
Write-Host "── Installed shadcn components ────────" -ForegroundColor Yellow
$uiComponents = Get-ChildItem -Path "src\components\ui" -Filter "*.tsx" -ErrorAction SilentlyContinue |
    ForEach-Object { $_.BaseName } |
    Join-String -Separator ", "

Write-Host "📦 $uiComponents" -ForegroundColor Cyan

Write-Host ""

# 6. Routes defined vs files present
Write-Host "── Route files present ─────────────────" -ForegroundColor Yellow
$routeFiles = Get-ChildItem -Path "src\routes" -Filter "*.tsx" -Recurse -ErrorAction SilentlyContinue |
    ForEach-Object { $_.BaseName } |
    Join-String -Separator " "

Write-Host "📄 $routeFiles" -ForegroundColor Cyan

Write-Host ""
Write-Host "╔══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║            Audit complete            ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
