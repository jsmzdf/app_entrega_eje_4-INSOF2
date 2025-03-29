// config/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'admin_app',           // Reemplaza con el usuario configurado en Docker/tu entorno
  host: 'localhost',           // O la IP/hostname donde se encuentra PostgreSQL
  database: 'manager',         // Nombre de la base de datos
  password: 'actividad_eje3',  // La contraseña definida
  port: 5432,                  // Puerto de conexión (el predeterminado de PostgreSQL es 5432)
});

module.exports = pool;