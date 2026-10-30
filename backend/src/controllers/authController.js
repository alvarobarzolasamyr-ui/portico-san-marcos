const db = require('../config/db');
const bcrypt = require('bcryptjs'); // Usamos la librería a prueba de fallos en Render

exports.loginUser = async (req, res) => {
  const { usuario, password } = req.body;
  try {
    console.log('Intentando iniciar sesión para el usuario:', usuario);
    
    const [rows] = await db.query(
      'SELECT id, usuario, password, nombres, rol, estado FROM usuarios WHERE usuario = ?',
      [usuario]
    );

    if (rows.length === 0) {
      console.log('Usuario no encontrado en la base de datos.');
      return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }

    const user = rows[0];
    console.log('Usuario encontrado, verificando contraseña...');

    const passwordValido = await bcrypt.compare(password, user.password);

    if (!passwordValido) {
      console.log('La contraseña no coincide con el hash.');
      return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }

    if (user.estado !== 'activo') {
      console.log('La cuenta está inactiva.');
      return res.status(403).json({ success: false, message: 'Tu cuenta se encuentra inactiva' });
    }

    console.log('¡Inicio de sesión exitoso!');
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
    console.error('❌ ERROR CRÍTICO EN LOGIN:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor', errorDetalle: error.message });
  }
};

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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await db.query(
      'INSERT INTO usuarios (usuario, password, nombres, rol, estado) VALUES (?, ?, ?, ?, "activo")',
      [usuario, hashedPassword, nombres, rol || 'alumno']
    );
    res.json({ success: true, message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error en createUser:', error);
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
  const { estado } = req.body;
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await db.query('UPDATE usuarios SET password = ? WHERE id = ?', [hashedPassword, id]);
    res.json({ success: true, message: 'Contraseña restablecida' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al cambiar contraseña' });
  }
};

// --- RUTA MÁGICA PARA REPARAR CONTRASEÑAS Y CREAR AL ADMIN EN AIVEN ---
exports.migrarAiven = async (req, res) => {
  try {
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

    // El admin está aquí para que se encripte correctamente
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

    for (const user of usuariosAMigrar) {
      const hashedPassword = await bcrypt.hash(user.passPlana, 10);
      const sqlUpsert = `
        INSERT INTO usuarios (nombres, apellidos, usuario, password, estado, rol) 
        VALUES (?, ?, ?, ?, 'activo', ?)
        ON DUPLICATE KEY UPDATE password = VALUES(password), rol = VALUES(rol)
      `;
      await db.query(sqlUpsert, [user.nombres, user.apellidos, user.usuario, hashedPassword, user.rol]);
    }

    res.send(`
      <div style="font-family: sans-serif; text-align: center; padding: 40px;">
        <h2 style="color: #16a34a;">¡Usuarios reparados con éxito en Aiven!</h2>
        <p>Ya puedes iniciar sesión con <strong>admin</strong> (clave: admin123) y <strong>dflores</strong> (clave: dflores2026).</p>
      </div>
    `);
  } catch (error) {
    console.error('Error durante la migración a Aiven:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};