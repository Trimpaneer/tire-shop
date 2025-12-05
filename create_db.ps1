$env:PGPASSWORD = "Nicopro88+"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE ruedafusa;" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Database created successfully"
} else {
    Write-Host "Database might already exist or error occurred"
}
