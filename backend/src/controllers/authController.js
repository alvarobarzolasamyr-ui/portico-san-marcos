const db = require('../config/db');
const bcrypt = require('bcryptjs'); // Usamos la librería segura para Render

// ==========================================
// 1. INICIO DE SESIÓN PROTEGIDO (ANTI-CRASH)
// ==========================================
exports.loginUser = async (req, res) => {
  const { usuario, password } = req.body;
  
  if (!usuario || !password) {
    return res.status(400).json({ success: false, message: 'Faltan credenciales' });
  }

  try {
    console.log('Intentando iniciar sesión para:', usuario);
    const [rows] = await db.query(
      'SELECT id, usuario, password, nombres, rol, estado FROM usuarios WHERE usuario = ?',
      [usuario]
    );

    if (rows.length === 0) {
      console.log('Usuario no encontrado en BD.');
      return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }

    const user = rows[0];

    // Verificar si la cuenta está activa ANTES de chequear el hash
    if (user.estado !== 'activo') {
      console.log('Cuenta inactiva.');
      return res.status(403).json({ success: false, message: 'Tu cuenta se encuentra inactiva' });
    }

    // Verificar si tiene contraseña (evita crash)
    if (!user.password) {
      return res.status(401).json({ success: false, message: 'Usuario sin contraseña registrada' });
    }

    // Comparación segura (Escudo protector)
    const passwordValido = await bcrypt.compare(password, user.password);

    if (!passwordValido) {
      console.log('La contraseña no coincide.');
      return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }

    console.log('¡Login exitoso para:', usuario);
    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        usuario: user.usuario,
        nombres: user.nombres,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error('❌ ERROR EVITADO EN LOGIN:', error.message);
    res.status(500).json({ success: false, message: 'Error de validación en BD. Si la cuenta es antigua, solicita reset de clave.' });
  }
};

// ==========================================
// 2. GESTIÓN DE USUARIOS
// ==========================================
exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, usuario, nombres, rol, estado FROM usuarios');
    res.json({ success: true, users: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al consultar usuarios' });
  }
};

exports.createUser = async (req, res) => {
  const { usuario, password, nombres, rol } = req.body;
  try {
    const [existing] = await db.query('SELECT id FROM usuarios WHERE usuario = ?', [usuario]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'El usuario ya existe' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO usuarios (usuario, password, nombres, rol, estado) VALUES (?, ?, ?, ?, "activo")',
      [usuario, hashedPassword, nombres, rol || 'alumno']
    );
    res.json({ success: true, message: 'Usuario registrado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombres, rol } = req.body;
  try {
    await db.query('UPDATE usuarios SET nombres = ?, rol = ? WHERE id = ?', [nombres, rol, id]);
    res.json({ success: true, message: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar' });
  }
};

exports.toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; // 'activo' o 'inactivo'
  try {
    await db.query('UPDATE usuarios SET estado = ? WHERE id = ?', [estado, id]);
    res.json({ success: true, message: 'Estado actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al cambiar estado' });
  }
};

exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('UPDATE usuarios SET password = ? WHERE id = ?', [hashedPassword, id]);
    res.json({ success: true, message: 'Contraseña restablecida con Bcrypt' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al cambiar contraseña' });
  }
};

// ==========================================
// 3. MIGRACIÓN Y CREACIÓN MASIVA ORIGINAL
// ==========================================
exports.migrarAiven = async (req, res) => {
  try {
    // Asegurar tabla
    await db.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombres VARCHAR(100),
        apellidos VARCHAR(100),
        usuario VARCHAR(50) UNIQUE,
        password VARCHAR(255),
        estado VARCHAR(20) DEFAULT 'activo',
        rol VARCHAR(20) DEFAULT 'alumno'
      )
    `);

    // Lista de docentes, alumnos (MÁS EL ADMIN)
    const usuariosAMigrar = [
      { nombres: 'Administrador General', apellidos: 'Admin', usuario: 'admin', passPlana: 'admin123', rol: 'admin' },
      { nombres: 'Carlos', apellidos: 'Mendoza', usuario: 'cendoza', passPlana: 'carlos2026', rol: 'docente' },
      { nombres: 'Ana', apellidos: 'García', usuario: 'agarcia', passPlana: 'ana.garcia*', rol: 'docente' },
      { nombres: 'Miguel', apellidos: 'Ángel', usuario: 'mangel', passPlana: 'mangel987', rol: 'docente' },
      { nombres: 'Rosa', apellidos: 'Fernández', usuario: 'rfernandez', passPlana: 'rosa#2026', rol: 'docente' },
      { nombres: 'Jorge', apellidos: 'Salazar', usuario: 'jsalazar', passPlana: 'jorge.pass', rol: 'docente' },
      { nombres: 'Luis', apellidos: 'Alvarez', usuario: 'lalvarez', passPlana: 'alumnoluis2026', rol: 'alumno' },
      { nombres: 'Maria', apellidos: 'Torres', usuario: 'mtorres', passPlana: 'maria.pass123', rol: 'alumno' },
      { nombres: 'Kevin', apellidos: 'Quispe', usuario: 'kquispe', passPlana: 'kevin2026', rol: 'alumno' },
      { nombres: 'Sofia', apellidos: 'Ramirez', usuario: 'sramirez', passPlana: 'sofia.pass#1', rol: 'alumno' },
      { nombres: 'Diego', apellidos: 'Flores', usuario: 'dflores', passPlana: 'dflores2026', rol: 'alumno' }
    ];

    // Insertar/Actualizar
    for (const user of usuariosAMigrar) {
      const hashedPassword = await bcrypt.hash(user.passPlana, 10);
      
      // Si el usuario existe, se actualiza su hash (para arreglar claves corruptas previas)
      const sqlUpsert = `
        INSERT INTO usuarios (nombres, apellidos, usuario, password, estado, rol) 
        VALUES (?, ?, ?, ?, 'activo', ?)
        ON DUPLICATE KEY UPDATE password = VALUES(password), rol = VALUES(rol)
      `;
      await db.query(sqlUpsert, [user.nombres, user.apellidos, user.usuario, hashedPassword, user.rol]);
    }

    res.send(`
      <div style="font-family: sans-serif; text-align: center; padding: 40px;">
        <h2 style="color: #16a34a;">¡Usuarios y contraseñas reparadas en Aiven!</h2>
        <p>Todos los usuarios (incluyendo el Admin) han sido encriptados correctamente.</p>
        <p><strong>Admin:</strong> admin / admin123</p>
        <p><strong>Diego Flores:</strong> dflores / dflores2026</p>
      </div>
    `);
  } catch (error) {
    console.error('Error durante la migración:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};