# .github/hooks/post-fix.ps1
# Run AFTER editing any component
# Compares to pre-fix baseline and reports improvement/regression
# Usage: .\post-fix.ps1

Write-Host ""
Write-Host "✅ Post-Fix Verification" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

# Get current error count
$tsOutput = npx tsc --noEmit 2>&1
$tsErrors = $tsOutput | Where-Object { $_ -match "error TS" }
$tsCount = if ($tsErrors) { @($tsErrors).Count } else { 0 }

# Compare with baseline if available
$baselineFile = "$env:TEMP\portal_panel_pre_fix_count.txt"
if (Test-Path $baselineFile) {
    $preCount = [int](Get-Content $baselineFile -Raw).Trim()
    $diff = $preCount - $tsCount

    Write-Host ""
    Write-Host "Before fix: $preCount errors"
    Write-Host "After fix:  $tsCount errors"

    if ($diff -gt 0) {
        Write-Host "✅ Fixed $diff error(s)" -ForegroundColor Green
    } elseif ($diff -lt 0) {
        Write-Host "❌ INTRODUCED $([Math]::Abs($diff)) new error(s) — review your changes" -ForegroundColor Red
    } else {
        Write-Host "→ No change in error count" -ForegroundColor Yellow
    }
} else {
    Write-Host "No baseline found (run .\pre-fix.ps1 first)" -ForegroundColor Yellow
    Write-Host "Current errors: $tsCount"
}

if ($tsCount -gt 0) {
    Write-Host ""
    Write-Host "Remaining errors:" -ForegroundColor Yellow
    $tsErrors | Select-Object -First 20 | ForEach-Object { Write-Host $_ -ForegroundColor Red }
}

Write-Host ""

# Check shadcn imports didn't break
Write-Host "── shadcn import check ──" -ForegroundColor Yellow
$bad = Get-ChildItem -Path "src" -Recurse -Include "*.tsx" -ErrorAction SilentlyContinue |
    Select-String -Pattern "from 'shadcn|from '@radix-ui" -ErrorAction SilentlyContinue

if (-not $bad) {
    Write-Host "✅ shadcn imports are correct" -ForegroundColor Green
} else {
    Write-Host "❌ Bad shadcn imports found — fix before committing:" -ForegroundColor Red
    $bad | ForEach-Object { Write-Host $_.ToString() -ForegroundColor Red }
}

Write-Host ""
Write-Host "========================" -ForegroundColor Cyan

if ($tsCount -eq 0 -and -not $bad) {
    Write-Host "✅ All checks passed — ready to commit" -ForegroundColor Green
    exit 0
} else {
    Write-Host "⚠️  Issues remain — keep fixing" -ForegroundColor Yellow
    exit 1
}
