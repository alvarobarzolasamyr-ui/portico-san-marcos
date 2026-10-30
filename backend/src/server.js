const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// =========================================================================
// INICIALIZACIÓN SEGURA DE BASE DE DATOS Y AUTO-REPARACIÓN DEL ADMIN
// =========================================================================
const inicializarBaseDeDatos = async () => {
  // 1. Tabla de catálogo de cursos
  const sqlCatalogo = `
    CREATE TABLE IF NOT EXISTS catalogo_cursos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      categoria VARCHAR(100) NOT NULL,
      descripcion TEXT,
      precio DECIMAL(10,2) DEFAULT 100.00,
      duracion VARCHAR(100) DEFAULT '5 Semanas (20 Horas)',
      imagen_url TEXT,
      video_demo_url TEXT,
      temario JSON,
      tipo VARCHAR(50) DEFAULT 'Virtual',
      horario VARCHAR(100) DEFAULT 'Por definir',
      instructor VARCHAR(150) DEFAULT 'Staff Académico',
      enlaceSede TEXT,
      estado VARCHAR(20) DEFAULT 'activo'
    )
  `;
  db.query(sqlCatalogo, (err) => {
    if (!err) {
      const columnas = [
        "ALTER TABLE catalogo_cursos ADD COLUMN estado VARCHAR(20) DEFAULT 'activo'",
        "ALTER TABLE catalogo_cursos ADD COLUMN tipo VARCHAR(50) DEFAULT 'Virtual'",
        "ALTER TABLE catalogo_cursos ADD COLUMN horario VARCHAR(100) DEFAULT 'Martes y Jueves - 7:00 PM'",
        "ALTER TABLE catalogo_cursos ADD COLUMN instructor VARCHAR(150) DEFAULT 'Ing. Fabrizio Barzola'",
        "ALTER TABLE catalogo_cursos ADD COLUMN enlaceSede TEXT"
      ];
      columnas.forEach(colSql => db.query(colSql, () => {})); 
    }
  });

  // 2. Tablas auxiliares
  db.query(`CREATE TABLE IF NOT EXISTS matriculas (id INT AUTO_INCREMENT PRIMARY KEY, usuario_alumno VARCHAR(100) NOT NULL, curso_id INT NOT NULL, fecha_matricula TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE KEY matricula_unica (usuario_alumno, curso_id))`, () => {});
  
  db.query(`CREATE TABLE IF NOT EXISTS mensajes (id INT AUTO_INCREMENT PRIMARY KEY, remitente VARCHAR(100) NOT NULL, rol_remitente VARCHAR(50) NOT NULL, destinatario VARCHAR(100) NOT NULL, asunto VARCHAR(200) NOT NULL, contenido TEXT NOT NULL, fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`, () => {});

  // 3. AUTO-REPARACIÓN DEL ADMINISTRADOR (Fuerza la clave a 'admin123')
  try {
    const hashSeguro = await bcrypt.hash('admin123', 10);
    db.query("SELECT id FROM usuarios WHERE usuario = 'admin'", (err, results) => {
      if (results && results.length > 0) {
        db.query("UPDATE usuarios SET password = ? WHERE usuario = 'admin'", [hashSeguro]);
        console.log('Clave del admin reparada y forzada a admin123');
      } else {
        db.query("INSERT INTO usuarios (usuario, password, nombres, rol, estado) VALUES ('admin', ?, 'Administrador General', 'admin', 'activo')", [hashSeguro]);
        console.log('Admin creado correctamente');
      }
    });
  } catch (error) {
    console.log('Error en auto-reparación del admin:', error.message);
  }
};

inicializarBaseDeDatos();

// =========================================================================
// RUTAS DE LA API
// =========================================================================
app.use('/api/auth', authRoutes);

app.get('/api/catalogo', (req, res) => {
  db.query('SELECT * FROM catalogo_cursos ORDER BY id ASC', (err, results) => {
    if (err) return res.status(500).json({ success: false });
    const cursos = results.map(c => ({
      ...c,
      precio: Number(c.precio),
      estado: c.estado || 'activo',
      temario: typeof c.temario === 'string' ? JSON.parse(c.temario) : (c.temario || [])
    }));
    res.json(cursos);
  });
});

app.post('/api/catalogo', (req, res) => {
  const { titulo, categoria, descripcion, precio, duracion, imagen_url, video_demo_url, temario, tipo, horario, instructor, enlaceSede } = req.body;
  const temarioJson = JSON.stringify(Array.isArray(temario) ? temario : ['Módulo 1: Introducción']);
  const sql = `INSERT INTO catalogo_cursos (titulo, categoria, descripcion, precio, duracion, imagen_url, video_demo_url, temario, tipo, horario, instructor, enlaceSede, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'activo')`;
  db.query(sql, [titulo, categoria, descripcion, Number(precio), duracion, imagen_url, video_demo_url, temarioJson, tipo, horario, instructor, enlaceSede], (err, result) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true, id: result.insertId });
  });
});

app.put('/api/catalogo/:id/estado', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  db.query('UPDATE catalogo_cursos SET estado = ? WHERE id = ?', [estado, id], (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
});

app.get('/api/usuarios', (req, res) => {
  db.query('SELECT id, usuario, nombres, rol FROM usuarios ORDER BY id ASC', (err, results) => {
    if (err) return res.status(500).json([]);
    res.json(results || []);
  });
});

app.get('/api/matriculas', (req, res) => {
  const { usuario } = req.query;
  let sql = 'SELECT * FROM matriculas ORDER BY fecha_matricula DESC';
  let params = [];
  if (usuario) {
    sql = 'SELECT * FROM matriculas WHERE usuario_alumno = ? ORDER BY fecha_matricula DESC';
    params = [usuario];
  }
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json([]);
    res.json(results || []);
  });
});

app.post('/api/matriculas', (req, res) => {
  const { usuario_alumno, curso_id } = req.body;
  db.query('INSERT IGNORE INTO matriculas (usuario_alumno, curso_id) VALUES (?, ?)', [usuario_alumno, Number(curso_id)], (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
});

app.delete('/api/matriculas/:usuario/:cursoId', (req, res) => {
  const { usuario, cursoId } = req.params;
  db.query('DELETE FROM matriculas WHERE usuario_alumno = ? AND curso_id = ?', [usuario, Number(cursoId)], (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
});

app.get('/api/mensajes/:usuario', (req, res) => {
  const { usuario } = req.params;
  db.query('SELECT * FROM mensajes WHERE destinatario = ? OR remitente = ? OR destinatario = "todos" ORDER BY fecha_envio DESC', [usuario, usuario], (err, results) => {
    if (err) return res.status(500).json([]);
    res.json(results || []);
  });
});

app.post('/api/mensajes', (req, res) => {
  const { remitente, rol_remitente, destinatario, asunto, contenido } = req.body;
  db.query('INSERT INTO mensajes (remitente, rol_remitente, destinatario, asunto, contenido) VALUES (?, ?, ?, ?, ?)', [remitente, rol_remitente || 'alumno', destinatario, asunto || '', contenido], (err, result) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true, id: result.insertId });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});