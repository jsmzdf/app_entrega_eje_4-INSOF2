
docker run --name app_ren `
  -e POSTGRES_PASSWORD=actividad_eje3 `
  -e POSTGRES_USER=admin_app `
  -e POSTGRES_DB=manager `
  -p 5432:5432 `
  -d postgres:16-alpine





docker run --name app_ren  -e POSTGRES_PASSWORD=actividad_eje3 -e POSTGRES_USER=admin_app -e POSTGRES_DB=manager -p 5432:5432 -d postgres:16-alpine

docker exec -it app_ren  psql -U admin_app -d manager




docker cp D:\00trabajo_universidad\script.sql app_ren:/tmp/script.sql

docker exec -it app_ren psql -U admin_app -d manager -f /tmp/script.sql


docker exec -it app_ren  psql -U admin_app -d manager

\dt
