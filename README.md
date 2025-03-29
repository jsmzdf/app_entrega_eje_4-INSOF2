
docker run --name app_ren `
  -e POSTGRES_PASSWORD=actividad_eje3 `
  -e POSTGRES_USER=admin_app `
  -e POSTGRES_DB=manager `
  -p 5432:5432 `
  -d postgres:16-alpine





docker run --name app_ren  -e POSTGRES_PASSWORD=actividad_eje3 -e POSTGRES_USER=admin_app -e POSTGRES_DB=manager -p 5432:5432 -d postgres:16-alpine

docker exec -it app_ren  psql -U admin_app -d manager

------ los scripts van en un archivo llamado escript.sql
-- (Opcional) Eliminar las tablas existentes para evitar conflictos
DROP TABLE IF EXISTS Visits CASCADE;
DROP TABLE IF EXISTS Contracts CASCADE;
DROP TABLE IF EXISTS Realestates CASCADE;
DROP TABLE IF EXISTS Users CASCADE;

-- Creación de la tabla Users
CREATE TABLE Users (
    id INT PRIMARY KEY,
    name CHAR(50) NOT NULL,
    email CHAR(50) NOT NULL,
    password CHAR(50) NOT NULL,
    role CHAR(10) NOT NULL CHECK (role IN ('ADMIN','OWNER','TENANT'))
);

-- Creación de la tabla Realestates (inmuebles)
CREATE TABLE Realestates (
    id INT PRIMARY KEY,
    status CHAR(10) NOT NULL CHECK (status IN ('RENTED','AVAILABLE')),
    address CHAR(50) NOT NULL,
    city CHAR(50) NOT NULL,
    state CHAR(50) NOT NULL,
    price INT NOT NULL,
    id_owner INT NOT NULL,
    CONSTRAINT fk_realestate_owner FOREIGN KEY (id_owner) REFERENCES Users(id)
);

-- Creación de la tabla Contracts
CREATE TABLE Contracts (
    id INT PRIMARY KEY,
    id_realstate INT NOT NULL,
    id_tenant INT NOT NULL,
    code_contract CHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_amount INT NOT NULL,
    CONSTRAINT fk_contract_realestate FOREIGN KEY (id_realstate) REFERENCES Realestates(id),
    CONSTRAINT fk_contract_tenant FOREIGN KEY (id_tenant) REFERENCES Users(id)
);

-- Creación de la tabla Visits
CREATE TABLE Visits (
    id INT PRIMARY KEY,
    id_realstate INT NOT NULL,
    id_tenant INT NOT NULL,
    visit_date DATE NOT NULL,
    CONSTRAINT fk_visit_realestate FOREIGN KEY (id_realstate) REFERENCES Realestates(id),
    CONSTRAINT fk_visit_tenant FOREIGN KEY (id_tenant) REFERENCES Users(id)
);

-----------------------------------------------------------
-- Inserción de datos de muestra
-----------------------------------------------------------

-- Tabla Users (usuarios)
INSERT INTO Users (id, name, email, password, role) VALUES
(4, 'Diana', 'diana@example.com', 'password456', 'TENANT'),
(5, 'Edward', 'edward@example.com', 'securepass', 'OWNER'),
(6, 'Fiona', 'fiona@example.com', 'adminpass', 'ADMIN'),
(7, 'George', 'george@example.com', 'password789', 'TENANT'),
(8, 'Hannah', 'hannah@example.com', 'secureme', 'OWNER'),
(9, 'Ian', 'ian@example.com', 'passadmin', 'ADMIN');

-- Tabla Realestates (inmuebles)
INSERT INTO Realestates (id, status, address, city, state, price, id_owner) VALUES
(3, 'AVAILABLE', 'Avenida 1 #10-20', 'Medellín', 'Antioquia', 850000, 5),
(4, 'AVAILABLE', 'Carrera 15 #45-30', 'Cali', 'Valle del Cauca', 700000, 5),
(5, 'RENTED', 'Calle 50 #10-5', 'Bogotá', 'Distrito Capital', 2000000, 2),
(6, 'AVAILABLE', 'Diagonal 23 #30-40', 'Cartagena', 'Bolívar', 1200000, 8),
(7, 'RENTED', 'Calle 80 #20-50', 'Barranquilla', 'Atlántico', 1500000, 8);

-- Tabla Contracts (contratos)
INSERT INTO Contracts (id, id_realstate, id_tenant, code_contract, start_date, end_date, monthly_amount) VALUES
(3, 3, 4, 'CON-003', '2025-07-01', '2026-06-30', 850),
(4, 5, 7, 'CON-004', '2025-03-01', '2026-02-28', 2000),
(5, 7, 4, 'CON-005', '2025-08-15', '2026-08-14', 1500),
(6, 6, 4, 'CON-006', '2025-09-01', '2026-08-31', 1200);

-- Tabla Visits (visitas)
INSERT INTO Visits (id, id_realstate, id_tenant, visit_date) VALUES
(3, 3, 4, '2025-06-15'),
(4, 4, 7, '2025-06-20'),
(5, 6, 4, '2025-06-25'),
(6, 7, 4, '2025-07-01'),
(7, 1, 7, '2025-07-10');
------------------------------------------------------------------------archivo


docker cp D:\00trabajo_universidad\script.sql app_ren:/tmp/script.sql

docker exec -it app_ren psql -U admin_app -d manager -f /tmp/script.sql


docker exec -it app_ren  psql -U admin_app -d manager

\dt
