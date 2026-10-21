const db = require('../config/db');
const bcrypt = require('bcrypt');

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
    // ESTO IMPRIMIRÁ EL ERROR EXACTO EN TU TERMINAL DE NODE
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