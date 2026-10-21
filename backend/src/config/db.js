const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

// Verificación rápida de la conexión al iniciar
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('¡Conectado exitosamente a la base de datos MySQL con soporte de promesas!');
    connection.release();
  } catch (err) {
    console.error('Error al conectar a la base de datos MySQL:', err);
  }
})();

module.exports = db;