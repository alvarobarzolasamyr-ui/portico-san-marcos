const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.loginUser = async (req, res) => {
  const { usuario, password } = req.body;
  if (!usuario || !password) return res.status(400).json({ success: false, message: 'Faltan credenciales' });

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
    if (rows.length === 0) return res.status(401).json({ success: false, message: 'Usuario no encontrado' });

    const user = rows[0];
    if (user.estado !== 'activo') return res.status(403).json({ success: false, message: 'Cuenta inactiva' });
    if (!user.password) return res.status(401).json({ success: false, message: 'Clave no registrada' });

    const passwordValido = await bcrypt.compare(password, user.password);
    if (!passwordValido) return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });

    res.json({
      success: true,
      user: { id: user.id, usuario: user.usuario, nombres: user.nombres, rol: user.rol }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, usuario, nombres, rol, estado FROM usuarios');
    res.json({ success: true, users: rows });
  } catch (error) { res.status(500).json({ success: false }); }
};

exports.createUser = async (req, res) => {
  const { usuario, password, nombres, rol } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT IGNORE INTO usuarios (usuario, password, nombres, rol, estado) VALUES (?, ?, ?, ?, "activo")', [usuario, hashedPassword, nombres, rol || 'alumno']);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false }); }
};

exports.updateUser = async (req, res) => {
  try {
    await db.query('UPDATE usuarios SET nombres = ?, rol = ? WHERE id = ?', [req.body.nombres, req.body.rol, req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false }); }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    await db.query('UPDATE usuarios SET estado = ? WHERE id = ?', [req.body.estado, req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false }); }
};

exports.resetPassword = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.query('UPDATE usuarios SET password = ? WHERE id = ?', [hashedPassword, req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false }); }
};

// =========================================================================
// MIGRACIÓN DE USUARIOS A AIVEN
// =========================================================================
exports.migrarAiven = async (req, res) => {
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS usuarios (id INT AUTO_INCREMENT PRIMARY KEY, nombres VARCHAR(100), apellidos VARCHAR(100), usuario VARCHAR(50) UNIQUE, password VARCHAR(255), estado VARCHAR(20) DEFAULT 'activo', rol VARCHAR(20) DEFAULT 'alumno')`);

    const usuarios = [
      { nombres: 'Administrador General', apellidos: 'Admin', usuario: 'admin', passPlana: 'admin123', rol: 'admin' },
      { nombres: 'Carlos', apellidos: 'Mendoza', usuario: 'cendoza', passPlana: 'carlos2026', rol: 'docente' },
      { nombres: 'Ana', apellidos: 'García', usuario: 'agarcia', passPlana: 'ana.garcia*', rol: 'docente' },
      { nombres: 'Jorge', apellidos: 'Salazar', usuario: 'jsalazar', passPlana: 'jorge.pass', rol: 'docente' },
      { nombres: 'Diego', apellidos: 'Flores', usuario: 'dflores', passPlana: 'dflores2026', rol: 'alumno' }
    ];

    for (const u of usuarios) {
      const hash = await bcrypt.hash(u.passPlana, 10);
      await db.query(`INSERT INTO usuarios (nombres, apellidos, usuario, password, estado, rol) VALUES (?, ?, ?, ?, 'activo', ?) ON DUPLICATE KEY UPDATE password = VALUES(password), rol = VALUES(rol)`, [u.nombres, u.apellidos, u.usuario, hash, u.rol]);
    }
    
    res.send(`<h1 style="color:green;text-align:center;padding:50px">¡MIGRACIÓN EXITOSA! Claves reparadas. Ya puedes iniciar como admin / admin123</h1>`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};