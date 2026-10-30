const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// =========================================================================
// INICIALIZACIÓN DE BASE DE DATOS (AHORA USA ASYNC/AWAIT PARA EVITAR CRASH)
// =========================================================================
const inicializarBaseDeDatos = async () => {
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS catalogo_cursos (id INT AUTO_INCREMENT PRIMARY KEY, titulo VARCHAR(255) NOT NULL, categoria VARCHAR(100) NOT NULL, descripcion TEXT, precio DECIMAL(10,2) DEFAULT 100.00, duracion VARCHAR(100) DEFAULT '5 Semanas (20 Horas)', imagen_url TEXT, video_demo_url TEXT, temario JSON, tipo VARCHAR(50) DEFAULT 'Virtual', horario VARCHAR(100) DEFAULT 'Por definir', instructor VARCHAR(150) DEFAULT 'Staff Académico', enlaceSede TEXT, estado VARCHAR(20) DEFAULT 'activo')`);
    
    await db.query(`CREATE TABLE IF NOT EXISTS matriculas (id INT AUTO_INCREMENT PRIMARY KEY, usuario_alumno VARCHAR(100) NOT NULL, curso_id INT NOT NULL, fecha_matricula TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE KEY matricula_unica (usuario_alumno, curso_id))`);
    
    await db.query(`CREATE TABLE IF NOT EXISTS mensajes (id INT AUTO_INCREMENT PRIMARY KEY, remitente VARCHAR(100) NOT NULL, rol_remitente VARCHAR(50) NOT NULL, destinatario VARCHAR(100) NOT NULL, asunto VARCHAR(200) NOT NULL, contenido TEXT NOT NULL, fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    
    console.log("Tablas inicializadas correctamente (Modo Async/Await)");
  } catch (error) {
    console.error("Aviso al inicializar tablas:", error.message);
  }
};

inicializarBaseDeDatos();

// =========================================================================
// RUTAS DE LA API (TODAS CON ASYNC/AWAIT)
// =========================================================================
app.use('/api/auth', authRoutes);

app.get('/api/catalogo', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM catalogo_cursos ORDER BY id ASC');
    const cursos = results.map(c => ({
      ...c,
      precio: Number(c.precio),
      estado: c.estado || 'activo',
      temario: typeof c.temario === 'string' ? JSON.parse(c.temario) : (c.temario || [])
    }));
    res.json(cursos);
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.post('/api/catalogo', async (req, res) => {
  const { titulo, categoria, descripcion, precio, duracion, imagen_url, video_demo_url, temario, tipo, horario, instructor, enlaceSede } = req.body;
  const temarioJson = JSON.stringify(Array.isArray(temario) ? temario : ['Módulo 1: Introducción']);
  const sql = `INSERT INTO catalogo_cursos (titulo, categoria, descripcion, precio, duracion, imagen_url, video_demo_url, temario, tipo, horario, instructor, enlaceSede, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'activo')`;
  
  try {
    const [result] = await db.query(sql, [titulo, categoria, descripcion, Number(precio), duracion, imagen_url, video_demo_url, temarioJson, tipo, horario, instructor, enlaceSede]);
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.put('/api/catalogo/:id/estado', async (req, res) => {
  try {
    await db.query('UPDATE catalogo_cursos SET estado = ? WHERE id = ?', [req.body.estado, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.get('/api/usuarios', async (req, res) => {
  try {
    const [results] = await db.query('SELECT id, usuario, nombres, rol FROM usuarios ORDER BY id ASC');
    res.json(results || []);
  } catch (err) {
    res.status(500).json([]);
  }
});

app.get('/api/matriculas', async (req, res) => {
  try {
    let sql = 'SELECT * FROM matriculas ORDER BY fecha_matricula DESC';
    let params = [];
    if (req.query.usuario) {
      sql = 'SELECT * FROM matriculas WHERE usuario_alumno = ? ORDER BY fecha_matricula DESC';
      params = [req.query.usuario];
    }
    const [results] = await db.query(sql, params);
    res.json(results || []);
  } catch (err) {
    res.status(500).json([]);
  }
});

app.post('/api/matriculas', async (req, res) => {
  try {
    await db.query('INSERT IGNORE INTO matriculas (usuario_alumno, curso_id) VALUES (?, ?)', [req.body.usuario_alumno, Number(req.body.curso_id)]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.delete('/api/matriculas/:usuario/:cursoId', async (req, res) => {
  try {
    await db.query('DELETE FROM matriculas WHERE usuario_alumno = ? AND curso_id = ?', [req.params.usuario, Number(req.params.cursoId)]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.get('/api/mensajes/:usuario', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM mensajes WHERE destinatario = ? OR remitente = ? OR destinatario = "todos" ORDER BY fecha_envio DESC', [req.params.usuario, req.params.usuario]);
    res.json(results || []);
  } catch (err) {
    res.status(500).json([]);
  }
});

app.post('/api/mensajes', async (req, res) => {
  try {
    const [result] = await db.query('INSERT INTO mensajes (remitente, rol_remitente, destinatario, asunto, contenido) VALUES (?, ?, ?, ?, ?)', [req.body.remitente, req.body.rol_remitente || 'alumno', req.body.destinatario, req.body.asunto || '', req.body.contenido]);
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});