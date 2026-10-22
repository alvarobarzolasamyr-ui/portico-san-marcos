const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Lista combinada con docentes y alumnos (con sus contraseñas en texto plano originales)
const usuariosAMigrar = [
  // --- DOCENTES ---
  { nombres: 'Carlos', apellidos: 'Mendoza', usuario: 'cendoza', passPlana: 'carlos2026', rol: 'docente' },
  { nombres: 'Ana', apellidos: 'García', usuario: 'agarcia', passPlana: 'ana.garcia*', rol: 'docente' },
  { nombres: 'Miguel', apellidos: 'Ángel', usuario: 'mangel', passPlana: 'miguel987', rol: 'docente' },
  { nombres: 'Rosa', apellidos: 'Fernández', usuario: 'rfernandez', passPlana: 'rosa#2026', rol: 'docente' },
  { nombres: 'Jorge', apellidos: 'Salazar', usuario: 'jsalazar', passPlana: 'jorge.pass', rol: 'docente' },

  // --- ALUMNOS ---
  { nombres: 'Luis', apellidos: 'Alvarez', usuario: 'lalvarez', passPlana: 'alumnoluis2026', rol: 'alumno' },
  { nombres: 'Maria', apellidos: 'Torres', usuario: 'mtorres', passPlana: 'maria.pass123', rol: 'alumno' },
  { nombres: 'Kevin', apellidos: 'Quispe', usuario: 'kquispe', passPlana: 'kevin2026', rol: 'alumno' },
  { nombres: 'Sofia', apellidos: 'Ramirez', usuario: 'sramirez', passPlana: 'sofia.pass#1', rol: 'alumno' },
  { nombres: 'Diego', apellidos: 'Flores', usuario: 'dflores', passPlana: 'dflores2026', rol: 'alumno' }
];

async function migrarYHashearUsuarios() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Conectando a la base de datos de Aiven...');
    const conn = await pool.getConnection();
    console.log('¡Conexión establecida con éxito!\n');

    for (const user of usuariosAMigrar) {
      // Hasheamos la contraseña automáticamente
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.passPlana, saltRounds);

      // Usamos INSERT IGNORE para evitar errores por duplicidad de usuario
      const sql = 'INSERT IGNORE INTO usuarios (nombres, apellidos, usuario, password, estado, rol) VALUES (?, ?, ?, ?, ?, ?)';
      await conn.query(sql, [
        user.nombres,
        user.apellidos,
        user.usuario,
        hashedPassword,
        'activo',
        user.rol
      ]);

      console.log(`✅ [${user.rol.toUpperCase()}] Usuario procesado y hasheado: ${user.usuario} (${user.nombres} ${user.apellidos})`);
    }

    conn.release();
    console.log('\n🎉 ¡Proceso completado! Todos los docentes y alumnos ya están en Aiven con sus contraseñas encriptadas.');
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await pool.end();
  }
}

migrarYHashearUsuarios();