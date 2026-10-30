const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// =========================================================================
// 1. INICIALIZACIÓN AUTOMÁTICA DE TABLAS Y PERFIL ADMIN EN MYSQL (AIVEN)
// =========================================================================
const inicializarBaseDeDatos = () => {
  // Asegurar tabla de catálogo de cursos con columna 'estado'
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
    if (err) console.error('Error verificando tabla catalogo_cursos:', err);
    // Añadir columnas adicionales en caso de que la tabla ya existiera antes
    const alterQueries = [
      "ALTER TABLE catalogo_cursos ADD COLUMN estado VARCHAR(20) DEFAULT 'activo'",
      "ALTER TABLE catalogo_cursos ADD COLUMN tipo VARCHAR(50) DEFAULT 'Virtual'",
      "ALTER TABLE catalogo_cursos ADD COLUMN horario VARCHAR(100) DEFAULT 'Martes y Jueves - 7:00 PM'",
      "ALTER TABLE catalogo_cursos ADD COLUMN instructor VARCHAR(150) DEFAULT 'Ing. Fabrizio Barzola'",
      "ALTER TABLE catalogo_cursos ADD COLUMN enlaceSede TEXT"
    ];
    alterQueries.forEach(q => db.query(q, () => {}));
  });

  // Tabla de matrículas (Cursos que lleva cada estudiante)
  const sqlMatriculas = `
    CREATE TABLE IF NOT EXISTS matriculas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_alumno VARCHAR(100) NOT NULL,
      curso_id INT NOT NULL,
      fecha_matricula TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY matricula_unica (usuario_alumno, curso_id)
    )
  `;
  db.query(sqlMatriculas, (err) => {
    if (err) console.error('Error creando tabla matriculas:', err);
  });

  // Tabla de mensajería interna entre perfiles
  const sqlMensajes = `
    CREATE TABLE IF NOT EXISTS mensajes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      remitente VARCHAR(100) NOT NULL,
      rol_remitente VARCHAR(50) NOT NULL,
      destinatario VARCHAR(100) NOT NULL,
      asunto VARCHAR(200) NOT NULL,
      contenido TEXT NOT NULL,
      fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(sqlMensajes, (err) => {
    if (err) console.error('Error creando tabla mensajes:', err);
  });

  // Crear usuario 'admin' por defecto (Clave: admin123) si no existe
  db.query("SELECT * FROM usuarios WHERE usuario = 'admin'", async (err, results) => {
    if (!err && results && results.length === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      db.query(
        "INSERT INTO usuarios (usuario, password, nombres, rol) VALUES ('admin', ?, 'Administrador General', 'admin')",
        [hash],
        (errInsert) => {
          if (!errInsert) console.log('Perfil Admin creado automáticamente (admin / admin123)');
        }
      );
    }
  });
};

inicializarBaseDeDatos();

// Rutas de autenticación existentes
app.use('/api/auth', authRoutes);

// =========================================================================
// 2. RUTAS DE CURSOS (GUARDAR, LISTAR, HABILITAR / DESHABILITAR)
// =========================================================================
app.get('/api/catalogo', (req, res) => {
  db.query('SELECT * FROM catalogo_cursos ORDER BY id ASC', (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error al consultar cursos' });
    }
    const cursos = results.map(c => ({
      ...c,
      precio: Number(c.precio),
      estado: c.estado || 'activo',
      temario: typeof c.temario === 'string' ? JSON.parse(c.temario) : (c.temario || [])
    }));
    res.json(cursos);
  });
});

// Añadir un nuevo curso a la Base de Datos (Solo Admin)
app.post('/api/catalogo', (req, res) => {
  const { titulo, categoria, descripcion, precio, duracion, imagen_url, video_demo_url, temario, tipo, horario, instructor, enlaceSede } = req.body;
  const temarioJson = JSON.stringify(Array.isArray(temario) ? temario : ['Módulo 1: Introducción y Fundamentos']);

  const sql = `
    INSERT INTO catalogo_cursos 
    (titulo, categoria, descripcion, precio, duracion, imagen_url, video_demo_url, temario, tipo, horario, instructor, enlaceSede, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'activo')
  `;
  db.query(
    sql,
    [
      titulo,
      categoria || 'Ingeniería',
      descripcion || '',
      Number(precio) || 100,
      duracion || '5 Semanas (20 Horas)',
      imagen_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
      video_demo_url || 'https://www.youtube.com/embed/fc_cA62Z1kQ',
      temarioJson,
      tipo || 'Virtual',
      horario || 'Martes y Jueves - 7:00 PM',
      instructor || 'Ing. Fabrizio Barzola',
      enlaceSede || 'https://zoom.us/j/9876543210'
    ],
    (err, result) => {
      if (err) {
        console.error('Error al guardar curso:', err);
        return res.status(500).json({ success: false, message: 'Error al guardar curso en BD' });
      }
      res.json({ success: true, id: result.insertId, message: 'Curso añadido en la base de datos' });
    }
  );
});

// Habilitar o Deshabilitar un curso en la Base de Datos (Solo Admin)
app.put('/api/catalogo/:id/estado', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; // 'activo' o 'inactivo'
  db.query('UPDATE catalogo_cursos SET estado = ? WHERE id = ?', [estado, id], (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error al cambiar estado del curso' });
    }
    res.json({ success: true, message: `Curso actualizado a ${estado}` });
  });
});

// =========================================================================
// 3. RUTAS DE PERFILES Y MATRÍCULAS DE ESTUDIANTES
// =========================================================================
// Obtener lista de usuarios registrados en BD
app.get('/api/usuarios', (req, res) => {
  db.query('SELECT id, usuario, nombres, rol FROM usuarios ORDER BY id ASC', (err, results) => {
    if (err) return res.status(500).json([]);
    res.json(results);
  });
});

// Obtener todas las matrículas (o las de un alumno específico)
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
    res.json(results);
  });
});

// Asignar un curso al perfil de un estudiante
app.post('/api/matriculas', (req, res) => {
  const { usuario_alumno, curso_id } = req.body;
  db.query(
    'INSERT IGNORE INTO matriculas (usuario_alumno, curso_id) VALUES (?, ?)',
    [usuario_alumno, Number(curso_id)],
    (err) => {
      if (err) return res.status(500).json({ success: false, message: 'Error al matricular estudiante' });
      res.json({ success: true, message: 'Curso asignado al estudiante correctamente' });
    }
  );
});

// Quitar un curso del perfil de un estudiante
app.delete('/api/matriculas/:usuario/:cursoId', (req, res) => {
  const { usuario, cursoId } = req.params;
  db.query(
    'DELETE FROM matriculas WHERE usuario_alumno = ? AND curso_id = ?',
    [usuario, Number(cursoId)],
    (err) => {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true, message: 'Matrícula eliminada' });
    }
  );
});

// =========================================================================
// 4. RUTAS DE MENSAJERÍA INTERNA CON BASE DE DATOS
// =========================================================================
app.get('/api/mensajes/:usuario', (req, res) => {
  const { usuario } = req.params;
  const sql = `
    SELECT * FROM mensajes 
    WHERE destinatario = ? OR remitente = ? OR destinatario = 'todos'
    ORDER BY fecha_envio DESC
  `;
  db.query(sql, [usuario, usuario], (err, results) => {
    if (err) return res.status(500).json([]);
    res.json(results);
  });
});

app.post('/api/mensajes', (req, res) => {
  const { remitente, rol_remitente, destinatario, asunto, contenido } = req.body;
  if (!remitente || !destinatario || !contenido) {
    return res.status(400).json({ success: false, message: 'Datos incompletos' });
  }
  const sql = `
    INSERT INTO mensajes (remitente, rol_remitente, destinatario, asunto, contenido)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [remitente, rol_remitente || 'alumno', destinatario, asunto || 'Sin asunto', contenido], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Error al enviar mensaje' });
    res.json({ success: true, id: result.insertId, message: 'Mensaje guardado en base de datos' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});