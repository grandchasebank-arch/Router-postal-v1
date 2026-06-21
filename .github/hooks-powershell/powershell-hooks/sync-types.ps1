# .github/hooks/sync-types.ps1
# Re-generates Supabase TypeScript types from your project schema
# Usage: $env:SUPABASE_PROJECT_ID="your_id"; .\sync-types.ps1

Write-Host ""
Write-Host "🔄 Supabase Type Sync" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan

if (-not $env:SUPABASE_PROJECT_ID) {
    Write-Host "⚠️  SUPABASE_PROJECT_ID not set" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Gray
    Write-Host '  $env:SUPABASE_PROJECT_ID = "abcdefgh"' -ForegroundColor White
    Write-Host "  .\sync-types.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "Find your project ID at: https://supabase.com/dashboard → Project Settings → General" -ForegroundColor Gray
    exit 1
}

$projectId = $env:SUPABASE_PROJECT_ID
$outputPath = "src\integrations\supabase\types.ts"
$backupPath = "src\integrations\supabase\types.ts.bak"

Write-Host "Project ID: $projectId"
Write-Host "Output: $outputPath"
Write-Host ""

# Backup existing types
if (Test-Path $outputPath) {
    Copy-Item -Path $outputPath -Destination $backupPath -Force
    Write-Host "Backed up existing types to types.ts.bak" -ForegroundColor Gray
}

# Generate new types
$result = npx supabase gen types typescript --project-id $projectId 2>&1

if ($LASTEXITCODE -eq 0) {
    # Write the output to the file
    $result | Out-File -FilePath $outputPath -Encoding utf8
    Write-Host "✅ Types generated successfully" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next: run 'npx tsc --noEmit' to check for type errors from schema changes" -ForegroundColor Gray
} else {
    Write-Host "❌ Type generation failed" -ForegroundColor Red
    Write-Host $result -ForegroundColor Red

    if (Test-Path $backupPath) {
        Write-Host "Restoring backup..." -ForegroundColor Yellow
        Move-Item -Path $backupPath -Destination $outputPath -Force
    }
    exit 1
}

Write-Host "=====================" -ForegroundColor Cyan
