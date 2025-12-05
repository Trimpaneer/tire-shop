$env:PGPASSWORD = "Nicopro88+"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d ruedafusa -c "SELECT version();" 2>&1 | Out-String
