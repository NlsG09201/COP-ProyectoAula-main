Write-Output "Deteniendo contenedores y eliminando volúmenes (limpieza de datos)..."
docker compose down -v

Write-Output "Iniciando aplicación con base de datos limpia..."
docker compose up -d --build

Write-Output "Esperando a que los servicios inicien..."
Start-Sleep -Seconds 10
docker ps
