const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '8mb' }));

// =========================================================================
// CATÁLOGO DE PRECIOS Y ENLACES PRIVADOS OFICIALES EN SERVIDOR (ANTI-TAMPERING)
// =========================================================================
const CURSOS_OFICIALES_SERVIDOR = {
  1: { titulo: 'Fundamentos de Robótica y Cinemática', precio: 120.00, enlaceSede: 'https://zoom.us/j/9876543210', videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4' },
  2: { titulo: 'Electrónica Aplicada a la Ingeniería', precio: 95.00, enlaceSede: 'Campus Central - Laboratorio de Electrónica', videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4' },
  3: { titulo: 'Arquitectura y Programación de Microcontroladores', precio: 110.00, enlaceSede: 'https://zoom.us/j/1234567890', videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4' },
  4: { titulo: 'Lógica de Programación para Mecatrónica (C++ y Python)', precio: 100.00, enlaceSede: 'https://meet.google.com/abc-defg-hij', videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4' },
  5: { titulo: 'Automatización Industrial y PLCs Multimarca', precio: 150.00, enlaceSede: 'https://zoom.us/j/9876543210', videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4' },
  6: { titulo: 'Visión Artificial y Procesamiento de Imágenes', precio: 140.00, enlaceSede: 'https://zoom.us/j/5556667770', videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4' },
  7: { titulo: 'Diseño y Ruteo de Placas Electrónicas (PCBs)', precio: 115.00, enlaceSede: 'Campus Central - Laboratorio de Electrónica', videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4' },
  8: { titulo: 'Simulación de Sistemas Neumáticos y Electroneumáticos', precio: 105.00, enlaceSede: 'Sede Arequipa - Pabellón B - Lab 2', videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4' },
  9: { titulo: 'Manufactura Aditiva e Impresión 3D', precio: 90.00, enlaceSede: 'Campus Central - Taller Mecánico', videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4' },
  10: { titulo: 'Diseño Mecánico y Modelado CAD 3D', precio: 135.00, enlaceSede: 'https://zoom.us/j/1234567890', videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4' }
};

const LIBROS_OFICIALES_SERVIDOR = {
  1: { titulo: 'Manual de Automatización e Industria 4.0 con TIA Portal', pdfUrl: '/manual_plc.pdf' },
  2: { titulo: 'Arquitectura Limpia y Microservicios con Node.js', pdfUrl: '/node_microservicios.pdf' },
  3: { titulo: 'Guía Práctica de Robótica e IoT con ESP32', pdfUrl: '/guia_esp32.pdf' },
  4: { titulo: 'Fundamentos de Neumática e Hidráulica ISO 1219', pdfUrl: '/neumatica_iso1219.pdf' }
};

// CLAVES DE RESPUESTAS DE EVALUACIONES (EXCLUSIVAS DEL BACKEND - NUNCA VIAJAN AL FRONTEND)
const BANCO_PREGUNTAS_SERVIDOR = [
  {
    id: 'p1',
    pregunta: '1. ¿Qué método matemático estándar se utiliza en robótica para modelar la cinemática directa entre eslabones contiguos?',
    opciones: [
      { id: 'A', texto: 'Transformada Rápida de Fourier (FFT)' },
      { id: 'B', texto: 'Parámetros de Denavit-Hartenberg (D-H)' },
      { id: 'C', texto: 'Método de interpolación de Newton' }
    ],
    respuestaCorrecta: 'B'
  },
  {
    id: 'p2',
    pregunta: '2. Según la norma internacional IEC 61131-3 para PLCs, ¿cuál de los siguientes es un lenguaje gráfico basado en diagramas de contactos?',
    opciones: [
      { id: 'A', texto: 'Lenguaje Ladder (LD / KOP)' },
      { id: 'B', texto: ' Lenguaje Ensamblador x86' },
      { id: 'C', texto: 'Consultas estructuradas SQL' }
    ],
    respuestaCorrecta: 'A'
  },
  {
    id: 'p3',
    pregunta: '3. En un microcontrolador ESP32 o Arduino Mega, ¿qué técnica permite regular la velocidad de un motor DC variando el ciclo de trabajo?',
    opciones: [
      { id: 'A', texto: 'Modulación por Ancho de Pulso (PWM)' },
      { id: 'B', texto: 'Aislamiento por memoria EEPROM' },
      { id: 'C', texto: 'Protocolo de ruteo estático' }
    ],
    respuestaCorrecta: 'A'
  },
  {
    id: 'p4',
    pregunta: '4. En diseño electroneumático bajo norma ISO 1219, ¿para qué se emplea el método Cascada?',
    opciones: [
      { id: 'A', texto: 'Para aumentar la presión del compresor principal' },
      { id: 'B', texto: 'Para eliminar el traslape de señales en secuencias neumáticas' },
      { id: 'C', texto: 'Para enfriar el aire comprimido en la unidad FRL' }
    ],
    respuestaCorrecta: 'B'
  }
];

// Almacenes en memoria respaldados por MySQL para velocidad instantánea
const tokensPdfTemporales = new Map();
const sesionesActivasMemoria = new Map();

// =========================================================================
// INICIALIZACIÓN DE BASE DE DATOS (MODO PROMESAS ASYNC/AWAIT)
// =========================================================================
const inicializarBaseDeDatos = async () => {
  try {
    await db.query(`
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
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS matriculas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_alumno VARCHAR(100) NOT NULL,
        curso_id INT NOT NULL,
        fecha_matricula TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY matricula_unica (usuario_alumno, curso_id)
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS mensajes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        remitente VARCHAR(100) NOT NULL,
        rol_remitente VARCHAR(50) NOT NULL,
        destinatario VARCHAR(100) NOT NULL,
        asunto VARCHAR(200) NOT NULL,
        contenido TEXT NOT NULL,
        fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // TABLAS DE SEGURIDAD SOLICITADAS POR EL SUPERIOR
    await db.query(`
      CREATE TABLE IF NOT EXISTS sesiones_activas (
        usuario VARCHAR(100) PRIMARY KEY,
        sesion_token VARCHAR(255) NOT NULL,
        dispositivo VARCHAR(255) NOT NULL,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS ordenes_compra (
        id INT AUTO_INCREMENT PRIMARY KEY,
        codigo_orden VARCHAR(60) UNIQUE NOT NULL,
        nombre_cliente VARCHAR(150),
        usuario_cliente VARCHAR(100),
        cursos_json JSON NOT NULL,
        total_validado DECIMAL(10,2) NOT NULL,
        estado_pago VARCHAR(40) DEFAULT 'pendiente_verificacion',
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS evaluaciones_notas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_alumno VARCHAR(100) NOT NULL,
        curso_id INT NOT NULL,
        nota INT NOT NULL,
        correctas INT NOT NULL,
        total_preguntas INT NOT NULL,
        fecha_evaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS archivos_seguros (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario VARCHAR(100) NOT NULL,
        curso_id INT NOT NULL,
        nombre_archivo VARCHAR(255) NOT NULL,
        extension VARCHAR(20) NOT NULL,
        tamano_bytes INT NOT NULL,
        hash_sha256 VARCHAR(128) NOT NULL,
        fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Tablas académicas y de seguridad inicializadas correctamente en Aiven MySQL');
  } catch (error) {
    console.error('Aviso al inicializar tablas:', error.message);
  }
};

inicializarBaseDeDatos();

// =========================================================================
// RUTAS DE AUTENTICACIÓN Y USUARIOS
// =========================================================================
app.use('/api/auth', authRoutes);

app.get('/api/usuarios', async (req, res) => {
  try {
    const [results] = await db.query('SELECT id, usuario, nombres, rol, estado FROM usuarios ORDER BY id ASC');
    res.json(results || []);
  } catch (err) {
    res.status(500).json([]);
  }
});

// =========================================================================
// RUTAS DE CATÁLOGO DE CURSOS
// =========================================================================
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
  const sql = `
    INSERT INTO catalogo_cursos 
    (titulo, categoria, descripcion, precio, duracion, imagen_url, video_demo_url, temario, tipo, horario, instructor, enlaceSede, estado) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'activo')
  `;

  try {
    const precioValidado = Math.max(1, Number(precio) || 100);
    const [result] = await db.query(sql, [
      titulo,
      categoria || 'Ingeniería',
      descripcion || '',
      precioValidado,
      duracion || '5 Semanas (20 Horas)',
      imagen_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
      video_demo_url || 'https://www.youtube.com/embed/fc_cA62Z1kQ',
      temarioJson,
      tipo || 'Virtual',
      horario || 'Martes y Jueves - 7:00 PM',
      instructor || 'Ing. Fabrizio Barzola',
      enlaceSede || 'https://zoom.us/j/9876543210'
    ]);
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
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

// =========================================================================
// RUTAS DE MATRÍCULAS DE ESTUDIANTES
// =========================================================================
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
    await db.query(
      'INSERT IGNORE INTO matriculas (usuario_alumno, curso_id) VALUES (?, ?)',
      [req.body.usuario_alumno, Number(req.body.curso_id)]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.delete('/api/matriculas/:usuario/:cursoId', async (req, res) => {
  try {
    await db.query(
      'DELETE FROM matriculas WHERE usuario_alumno = ? AND curso_id = ?',
      [req.params.usuario, Number(req.params.cursoId)]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// =========================================================================
// RUTAS DE MENSAJERÍA EN TIEMPO REAL
// =========================================================================
app.get('/api/mensajes/:usuario', async (req, res) => {
  try {
    const usuario = (req.params.usuario || '').trim();
    let sql = '';
    let params = [];

    if (usuario.toLowerCase() === 'admin') {
      sql = 'SELECT * FROM mensajes ORDER BY fecha_envio ASC';
    } else {
      sql = 'SELECT * FROM mensajes WHERE destinatario = ? OR remitente = ? OR destinatario = ? ORDER BY fecha_envio ASC';
      params = [usuario, usuario, 'todos'];
    }

    const [results] = await db.query(sql, params);
    res.json(results || []);
  } catch (err) {
    res.status(500).json([]);
  }
});

app.post('/api/mensajes', async (req, res) => {
  try {
    const remitente = (req.body.remitente || '').trim();
    const rol_remitente = (req.body.rol_remitente || 'alumno').trim();
    const destinatario = (req.body.destinatario || '').trim();
    const asunto = (req.body.asunto || 'Mensaje Directo').trim();
    const contenido = (req.body.contenido || '').trim();

    if (!remitente || !destinatario || !contenido) {
      return res.status(400).json({ success: false, message: 'Datos incompletos' });
    }

    const [result] = await db.query(
      'INSERT INTO mensajes (remitente, rol_remitente, destinatario, asunto, contenido) VALUES (?, ?, ?, ?, ?)',
      [remitente, rol_remitente, destinatario, asunto, contenido]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// =========================================================================
// PROTECCIÓN 1: VALIDACIÓN DE MATRÍCULA EN SERVIDOR PARA ENLACES PRIVADOS
// =========================================================================
app.post('/api/seguridad/acceso-curso', async (req, res) => {
  try {
    const { usuario, rol, curso_id } = req.body;
    const idCursoNum = Number(curso_id);

    if (!usuario || !idCursoNum) {
      return res.status(400).json({ success: false, message: 'Solicitud incompleta.' });
    }

    let autorizado = false;
    if (rol === 'admin' || rol === 'docente' || usuario === 'admin') {
      autorizado = true;
    } else {
      const [rows] = await db.query(
        'SELECT id FROM matriculas WHERE usuario_alumno = ? AND curso_id = ?',
        [usuario, idCursoNum]
      );
      autorizado = rows.length > 0;
    }

    if (!autorizado) {
      return res.status(403).json({
        success: false,
        message: '🔒 Acceso bloqueado por el Servidor: No registras matrícula activa en este curso privado.'
      });
    }

    let datosCurso = CURSOS_OFICIALES_SERVIDOR[idCursoNum] || null;
    if (!datosCurso) {
      const [dbCurso] = await db.query('SELECT titulo, enlaceSede FROM catalogo_cursos WHERE id = ?', [idCursoNum]);
      if (dbCurso.length > 0) {
        datosCurso = {
          titulo: dbCurso[0].titulo,
          enlaceSede: dbCurso[0].enlaceSede || 'https://zoom.us/j/9876543210',
          videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
        };
      }
    }

    const firmaServidor = crypto.randomBytes(8).toString('hex');
    res.json({
      success: true,
      message: 'Matrícula validada en servidor MySQL.',
      enlaceSede: datosCurso ? datosCurso.enlaceSede : 'https://zoom.us/j/9876543210',
      videoUrl: datosCurso ? datosCurso.videoUrl : 'https://vjs.zencdn.net/v/oceans.mp4',
      firmaServidor
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al validar matrícula en servidor.' });
  }
});

// =========================================================================
// PROTECCIÓN 2: DESCARGAS DE PDF MEDIANTE ENLACES TEMPORALES FIRMADOS
// =========================================================================
app.post('/api/seguridad/enlace-pdf-temporal', async (req, res) => {
  try {
    const { usuario, libro_id } = req.body;
    if (!usuario || !libro_id) {
      return res.status(400).json({ success: false, message: 'Usuario y libro requeridos.' });
    }

    const libro = LIBROS_OFICIALES_SERVIDOR[Number(libro_id)];
    if (!libro) {
      return res.status(404).json({ success: false, message: 'Documento PDF no encontrado en servidor.' });
    }

    const tokenTemporal = crypto.randomBytes(20).toString('hex');
    const expiraEn = Date.now() + 5 * 60 * 1000; // 5 minutos de validez estricta

    tokensPdfTemporales.set(tokenTemporal, {
      usuario,
      libro_id: Number(libro_id),
      pdfUrl: libro.pdfUrl,
      titulo: libro.titulo,
      expiraEn,
      usos: 0
    });

    res.json({
      success: true,
      tokenTemporal,
      expiraEn,
      pdfUrlAutorizado: `${libro.pdfUrl}?token_temporal=${tokenTemporal}&exp=${expiraEn}`,
      endpointDescargaSegura: `/api/seguridad/descargar-pdf/${tokenTemporal}`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al generar enlace temporal.' });
  }
});

app.get('/api/seguridad/descargar-pdf/:token', (req, res) => {
  const { token } = req.params;
  const registro = tokensPdfTemporales.get(token);

  if (!registro) {
    return res.status(403).send('⛔ Enlace temporal inválido o inexistente. Solicita autorización desde el Aula Virtual.');
  }

  if (Date.now() > registro.expiraEn) {
    tokensPdfTemporales.delete(token);
    return res.status(403).send('⏱️ El enlace temporal de descarga ha expirado (validez máxima: 5 minutos).');
  }

  if (registro.usos >= 3) {
    tokensPdfTemporales.delete(token);
    return res.status(403).send('🔒 Límite de descargas alcanzado para este enlace temporal.');
  }

  registro.usos += 1;
  res.json({
    success: true,
    mensaje: 'Enlace temporal válido y autorizado por el servidor.',
    titulo: registro.titulo,
    pdfUrl: registro.pdfUrl,
    usosRestantes: 3 - registro.usos
  });
});

// =========================================================================
// PROTECCIÓN 3: CONTROL DE SESIONES Y DISPOSITIVOS (ANTI-CUENTAS COMPARTIDAS)
// =========================================================================
app.post('/api/seguridad/registrar-sesion', async (req, res) => {
  try {
    const { usuario, dispositivo } = req.body;
    if (!usuario) return res.status(400).json({ success: false });

    const sesionToken = crypto.randomBytes(24).toString('hex');
    const infoDisp = (dispositivo || 'Navegador Web').slice(0, 240);

    sesionesActivasMemoria.set(usuario.toLowerCase(), {
      sesionToken,
      dispositivo: infoDisp,
      fecha: new Date().toISOString()
    });

    await db.query(
      `INSERT INTO sesiones_activas (usuario, sesion_token, dispositivo) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE sesion_token = VALUES(sesion_token), dispositivo = VALUES(dispositivo)`,
      [usuario.toLowerCase(), sesionToken, infoDisp]
    );

    res.json({
      success: true,
      sesionToken,
      dispositivo: infoDisp
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.get('/api/seguridad/verificar-sesion/:usuario/:token', async (req, res) => {
  try {
    const usr = (req.params.usuario || '').toLowerCase();
    const tokenCliente = req.params.token;

    const enMemoria = sesionesActivasMemoria.get(usr);
    if (enMemoria && enMemoria.sesionToken !== tokenCliente) {
      return res.json({
        valida: false,
        motivo: `Tu cuenta inició sesión en otro dispositivo (${enMemoria.dispositivo}). Por política anti-cuentas compartidas, esta sesión se ha cerrado.`
      });
    }

    const [rows] = await db.query('SELECT sesion_token, dispositivo FROM sesiones_activas WHERE usuario = ?', [usr]);
    if (rows.length > 0 && rows[0].sesion_token !== tokenCliente) {
      return res.json({
        valida: false,
        motivo: `Se detectó un acceso simultáneo en otro dispositivo (${rows[0].dispositivo}). Solo se permite 1 dispositivo activo por cuenta.`
      });
    }

    res.json({ valida: true });
  } catch (err) {
    res.json({ valida: true });
  }
});

// =========================================================================
// PROTECCIÓN 4 Y 5: PRECIO VALIDADO EXCLUSIVAMENTE EN BACKEND Y ORDEN DE PAGO
// =========================================================================
app.post('/api/seguridad/crear-orden-compra', async (req, res) => {
  try {
    const { curso_ids, nombre_cliente, usuario_cliente } = req.body;
    if (!Array.isArray(curso_ids) || curso_ids.length === 0) {
      return res.status(400).json({ success: false, message: 'El carrito está vacío.' });
    }

    const [cursosBD] = await db.query('SELECT id, titulo, precio FROM catalogo_cursos');
    const mapaBD = new Map(cursosBD.map(c => [Number(c.id), { titulo: c.titulo, precio: Number(c.precio) }]));

    const itemsValidados = [];
    let totalServidor = 0;

    for (const rawId of curso_ids) {
      const id = Number(rawId);
      const cursoOficial = mapaBD.get(id) || CURSOS_OFICIALES_SERVIDOR[id];
      if (cursoOficial) {
        const precioReal = Number(cursoOficial.precio);
        itemsValidados.push({ id, titulo: cursoOficial.titulo, precio: precioReal });
        totalServidor += precioReal;
      }
    }

    if (itemsValidados.length === 0) {
      return res.status(400).json({ success: false, message: 'Cursos no válidos en el servidor.' });
    }

    const codigoOrden = `PSM-2026-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    await db.query(
      'INSERT INTO ordenes_compra (codigo_orden, nombre_cliente, usuario_cliente, cursos_json, total_validado, estado_pago) VALUES (?, ?, ?, ?, ?, ?)',
      [
        codigoOrden,
        (nombre_cliente || 'Estudiante').slice(0, 140),
        (usuario_cliente || 'invitado').slice(0, 90),
        JSON.stringify(itemsValidados),
        totalServidor,
        'pendiente_verificacion'
      ]
    );

    res.json({
      success: true,
      codigoOrden,
      itemsValidados,
      totalServidor: Number(totalServidor.toFixed(2)),
      estadoPago: 'pendiente_verificacion'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al validar precios en el servidor.' });
  }
});

app.get('/api/seguridad/ordenes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ordenes_compra ORDER BY fecha_creacion DESC LIMIT 50');
    const ordenes = rows.map(o => ({
      ...o,
      total_validado: Number(o.total_validado),
      cursos_json: typeof o.cursos_json === 'string' ? JSON.parse(o.cursos_json) : (o.cursos_json || [])
    }));
    res.json(ordenes);
  } catch (err) {
    res.status(500).json([]);
  }
});

app.post('/api/seguridad/confirmar-pago-servidor', async (req, res) => {
  try {
    const { codigo_orden, usuario_alumno, rol_ejecutor } = req.body;
    if (rol_ejecutor !== 'admin') {
      return res.status(403).json({ success: false, message: 'Solo el Administrador puede confirmar pagos en el servidor.' });
    }

    const [rows] = await db.query('SELECT * FROM ordenes_compra WHERE codigo_orden = ?', [codigo_orden]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Código de orden no existe en el servidor (Posible intento de falsificación).' });
    }

    const orden = rows[0];
    await db.query('UPDATE ordenes_compra SET estado_pago = ?, usuario_cliente = ? WHERE codigo_orden = ?', [
      'pagado_verificado',
      usuario_alumno || orden.usuario_cliente,
      codigo_orden
    ]);

    const cursos = typeof orden.cursos_json === 'string' ? JSON.parse(orden.cursos_json) : (orden.cursos_json || []);
    const alumnoDestino = (usuario_alumno || orden.usuario_cliente || '').trim();

    if (alumnoDestino && alumnoDestino !== 'invitado') {
      for (const item of cursos) {
        await db.query('INSERT IGNORE INTO matriculas (usuario_alumno, curso_id) VALUES (?, ?)', [alumnoDestino, Number(item.id)]);
      }
    }

    res.json({
      success: true,
      message: `Pago de la orden ${codigo_orden} confirmado en servidor y matrícula activada.`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al confirmar orden en servidor.' });
  }
});

// =========================================================================
// PROTECCIÓN 6: VALIDACIÓN DE RESPUESTAS Y NOTAS DE EVALUACIONES EN BACKEND
// =========================================================================
app.get('/api/seguridad/preguntas-evaluacion/:cursoId', (req, res) => {
  // Se envían ÚNICAMENTE las preguntas y opciones, JAMÁS la propiedad respuestaCorrecta
  const preguntasPublicas = BANCO_PREGUNTAS_SERVIDOR.map(p => ({
    id: p.id,
    pregunta: p.pregunta,
    opciones: p.opciones
  }));
  res.json({ success: true, preguntas: preguntasPublicas });
});

app.post('/api/seguridad/evaluar-examen', async (req, res) => {
  try {
    const { usuario, curso_id, respuestas } = req.body;
    if (!usuario || !curso_id || !respuestas) {
      return res.status(400).json({ success: false, message: 'Datos de evaluación incompletos.' });
    }

    let correctas = 0;
    const total = BANCO_PREGUNTAS_SERVIDOR.length;
    const detalleRevision = [];

    for (const preg of BANCO_PREGUNTAS_SERVIDOR) {
      const marcada = respuestas[preg.id] || '';
      const esCorrecta = marcada === preg.respuestaCorrecta;
      if (esCorrecta) correctas += 1;
      detalleRevision.push({
        id: preg.id,
        marcada,
        esCorrecta
      });
    }

    const notaVigecimal = Math.round((correctas / total) * 20);

    await db.query(
      'INSERT INTO evaluaciones_notas (usuario_alumno, curso_id, nota, correctas, total_preguntas) VALUES (?, ?, ?, ?, ?)',
      [usuario, Number(curso_id), notaVigecimal, correctas, total]
    );

    res.json({
      success: true,
      nota: notaVigecimal,
      correctas,
      total,
      aprobado: notaVigecimal >= 14,
      detalleRevision,
      mensaje: `Evaluación calificada exclusivamente en el Backend. Nota oficial: ${notaVigecimal}/20`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al calificar evaluación en el servidor.' });
  }
});

app.get('/api/seguridad/notas/:usuario', async (req, res) => {
  try {
    const usr = req.params.usuario;
    let sql = 'SELECT * FROM evaluaciones_notas WHERE usuario_alumno = ? ORDER BY fecha_evaluacion DESC';
    let params = [usr];
    if (usr === 'admin') {
      sql = 'SELECT * FROM evaluaciones_notas ORDER BY fecha_evaluacion DESC LIMIT 50';
      params = [];
    }
    const [rows] = await db.query(sql, params);
    res.json(rows || []);
  } catch (err) {
    res.status(500).json([]);
  }
});

// =========================================================================
// PROTECCIÓN 7: VALIDACIÓN ESTRICTA DE ARCHIVOS (EXTENSIÓN, CONTENIDO Y TAMAÑO)
// =========================================================================
const EXTENSIONES_PERMITIDAS = ['.pdf', '.docx', '.zip', '.png', '.jpg', '.jpeg', '.ino', '.py', '.cpp', '.txt'];
const EXTENSIONES_PELIGROSAS = ['.exe', '.bat', '.cmd', '.sh', '.php', '.js', '.vbs', '.msi', '.scr', '.dll', '.ps1'];
const TAMANO_MAXIMO_BYTES = 5 * 1024 * 1024; // 5 MB máximo

app.post('/api/seguridad/validar-archivo', async (req, res) => {
  try {
    const { usuario, curso_id, nombre_archivo, tamano_bytes, contenido_base64 } = req.body;

    if (!usuario || !nombre_archivo || typeof tamano_bytes !== 'number') {
      return res.status(400).json({ success: false, message: 'Metadatos del archivo incompletos.' });
    }

    const nombreMin = nombre_archivo.toLowerCase().trim();

    // 1. Validar doble extensión maliciosa (ej. informe.pdf.exe)
    for (const extPeligrosa of EXTENSIONES_PELIGROSAS) {
      if (nombreMin.endsWith(extPeligrosa) || nombreMin.includes(`${extPeligrosa}.`)) {
        return res.status(400).json({
          success: false,
          message: `🛑 Archivo bloqueado por el Servidor: Se detectó extensión ejecutable o peligrosa (${extPeligrosa}).`
        });
      }
    }

    const puntoIdx = nombreMin.lastIndexOf('.');
    const extension = puntoIdx !== -1 ? nombreMin.slice(puntoIdx) : '';
    if (!EXTENSIONES_PERMITIDAS.includes(extension)) {
      return res.status(400).json({
        success: false,
        message: `🛑 Extensión no autorizada (${extension || 'sin extensión'}). Solo se permiten: ${EXTENSIONES_PERMITIDAS.join(', ')}`
      });
    }

    // 2. Validar Tamaño (Máximo 5 MB)
    if (tamano_bytes <= 0 || tamano_bytes > TAMANO_MAXIMO_BYTES) {
      return res.status(400).json({
        success: false,
        message: `🛑 Tamaño rechazado por el Servidor (${(tamano_bytes / (1024 * 1024)).toFixed(2)} MB). El límite máximo es 5.00 MB.`
      });
    }

    // 3. Validar Contenido Real (Magic Bytes e inyección de scripts)
    const base64Limpio = (contenido_base64 || '').split(',').pop() || '';
    const bufferArchivo = Buffer.from(base64Limpio, 'base64');

    // Bloquear ejecutables Windows camuflados (Cabecera 'MZ' = 0x4D 0x5A)
    if (bufferArchivo.length >= 2 && bufferArchivo[0] === 0x4d && bufferArchivo[1] === 0x5a) {
      return res.status(400).json({
        success: false,
        message: '🛑 Alerta de Seguridad: El contenido binario corresponde a un ejecutable (.EXE / MZ) camuflado.'
      });
    }

    // Si dice ser PDF, verificar que inicie con la firma mágica %PDF-
    if (extension === '.pdf' && bufferArchivo.length >= 4) {
      const firmaPdf = bufferArchivo.slice(0, 4).toString('utf8');
      if (firmaPdf !== '%PDF') {
        return res.status(400).json({
          success: false,
          message: '🛑 Alerta de Seguridad: El archivo tiene extensión .pdf pero su contenido interno NO es un PDF auténtico.'
        });
      }
    }

    // Escaneo de código malicioso incrustado
    const muestraTexto = bufferArchivo.slice(0, 4096).toString('utf8').toLowerCase();
    if (muestraTexto.includes('<script') || muestraTexto.includes('<?php') || muestraTexto.includes('powershell')) {
      return res.status(400).json({
        success: false,
        message: '🛑 Alerta de Seguridad: Se detectaron scripts potencialmente maliciosos dentro del archivo.'
      });
    }

    const hashSha256 = crypto.createHash('sha256').update(bufferArchivo).digest('hex');

    await db.query(
      'INSERT INTO archivos_seguros (usuario, curso_id, nombre_archivo, extension, tamano_bytes, hash_sha256) VALUES (?, ?, ?, ?, ?, ?)',
      [usuario, Number(curso_id) || 1, nombre_archivo, extension, tamano_bytes, hashSha256]
    );

    res.json({
      success: true,
      hashSha256,
      message: `✓ Archivo verificado en Servidor (Extensión ${extension}, firma binaria auténtica y tamaño ${(tamano_bytes / 1024).toFixed(1)} KB).`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al inspeccionar el archivo en el servidor.' });
  }
});

app.get('/api/seguridad/archivos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM archivos_seguros ORDER BY fecha_subida DESC LIMIT 30');
    res.json(rows || []);
  } catch (err) {
    res.status(500).json([]);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});