@echo off
echo Deteniendo contenedores y eliminando volumenes (limpieza de datos)...
docker compose down -v

echo Iniciando aplicacion con base de datos limpia...
docker compose up -d --build

echo Esperando a que los servicios inicien...
timeout /t 10
docker ps
