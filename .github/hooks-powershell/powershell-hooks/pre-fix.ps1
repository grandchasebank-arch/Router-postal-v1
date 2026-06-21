# .github/hooks/pre-fix.ps1
# Run BEFORE starting to edit any component
# Captures baseline TypeScript error count so you can see if your fix helped
# Usage: .\pre-fix.ps1

Write-Host ""
Write-Host "🔍 Pre-Fix Baseline Check" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

# Count current TS errors
$tsOutput = npx tsc --noEmit 2>&1
$tsErrors = $tsOutput | Where-Object { $_ -match "error TS" }
$tsCount = if ($tsErrors) { @($tsErrors).Count } else { 0 }

Write-Host ""
Write-Host "TypeScript errors before fix: $tsCount" -ForegroundColor $(if ($tsCount -gt 0) { "Red" } else { "Green" })

if ($tsCount -gt 0) {
    Write-Host ""
    Write-Host "Errors to fix:" -ForegroundColor Yellow
    $tsErrors | Select-Object -First 20 | ForEach-Object { Write-Host $_ -ForegroundColor Red }
}

# Save baseline to temp file for post-fix comparison
$tempDir = $env:TEMP
$tsCount | Out-File -FilePath "$tempDir\portal_panel_pre_fix_count.txt" -Encoding utf8
$tsErrors | Out-File -FilePath "$tempDir\portal_panel_pre_fix_errors.txt" -Encoding utf8

Write-Host ""
Write-Host "Baseline saved to $tempDir\portal_panel_pre_fix_count.txt" -ForegroundColor Gray
Write-Host "Run .\post-fix.ps1 after your changes." -ForegroundColor Gray
Write-Host "=========================" -ForegroundColor Cyan
