const mysql = require('mysql2/promise');
require('dotenv').config();

const cursosMecatronica = [
  {
    titulo: 'Fundamentos de Robótica y Cinemática',
    categoria: 'Robótica',
    descripcion: 'Domina el modelado espacial, matrices de transformación y parámetros Denavit-Hartenberg para brazos robóticos.',
    precio: 120.00,
    duracion: '5 Semanas (20 Horas)',
    imagen_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
    video_demo_url: 'https://www.youtube.com/embed/fc_cA62Z1kQ',
    temario: [
      'Módulo 1: Morfología del robot (grados de libertad, articulaciones y actuadores)',
      'Módulo 2: Álgebra matricial y transformaciones espaciales 3D',
      'Módulo 3: Cinemática Directa y parámetros Denavit-Hartenberg (D-H)',
      'Módulo 4: Cinemática Inversa algebraica y geométrica',
      'Módulo 5: Planificación de trayectorias articulares y cartesianas'
    ]
  },
  {
    titulo: 'Electrónica Aplicada a la Ingeniería',
    categoria: 'Electrónica',
    descripcion: 'Análisis de circuitos DC/AC, semiconductores, amplificadores operacionales y etapas de potencia para motores.',
    precio: 95.00,
    duracion: '4 Semanas (16 Horas)',
    imagen_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    video_demo_url: 'https://www.youtube.com/embed/r9GC50r2Ge8',
    temario: [
      'Módulo 1: Leyes de Ohm, Kirchhoff y análisis de mallas/nodos DC',
      'Módulo 2: Componentes pasivos e impedancia en corriente alterna',
      'Módulo 3: Diodos, transistores BJT y MOSFET en conmutación',
      'Módulo 4: Amplificadores Operacionales (Op-Amps) y filtrado de sensores',
      'Módulo 5: Electrónica de potencia, reguladores y drivers Puente H'
    ]
  },
  {
    titulo: 'Arquitectura y Programación de Microcontroladores',
    categoria: 'Sistemas Embebidos',
    descripcion: 'Programación de registros, conversores ADC, señales PWM y protocolos industriales con Arduino Mega y ESP32.',
    precio: 110.00,
    duracion: '5 Semanas (20 Horas)',
    imagen_url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&q=80',
    video_demo_url: 'https://www.youtube.com/embed/fJWR7dBuc18',
    temario: [
      'Módulo 1: Arquitectura interna (CPU, memoria Flash/RAM y registros)',
      'Módulo 2: Entradas y salidas digitales (GPIO) y control de actuadores',
      'Módulo 3: Conversión Analógica-Digital (ADC) y control de velocidad PWM',
      'Módulo 4: Interrupciones externas y Timers por hardware en tiempo real',
      'Módulo 5: Protocolos de comunicación UART, I2C y SPI'
    ]
  },
  {
    titulo: 'Lógica de Programación para Mecatrónica (C++ y Python)',
    categoria: 'Programación',
    descripcion: 'Desarrollo de algoritmos de control de hardware en C++ orientado a objetos y procesamiento matemático en Python.',
    precio: 100.00,
    duracion: '5 Semanas (20 Horas)',
    imagen_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
    video_demo_url: 'https://www.youtube.com/embed/ZzaPdXTrSb8',
    temario: [
      'Módulo 1: Algoritmos, diagramas de flujo y estructuras de control',
      'Módulo 2: C++ Parte 1: Tipos de datos, funciones y manejo de punteros',
      'Módulo 3: C++ Parte 2: Programación Orientada a Objetos para librerías de sensores',
      'Módulo 4: Python Parte 1: Sintaxis, colecciones y automatización de scripts',
      'Módulo 5: Python Parte 2: Matrices con NumPy y cálculo de trayectorias'
    ]
  },
  {
    titulo: 'Automatización Industrial y PLCs Multimarca',
    categoria: 'Automatización',
    descripcion: 'Programación industrial en entornos Siemens TIA Portal, Allen-Bradley y Delta bajo la norma IEC 61131-3.',
    precio: 150.00,
    duracion: '6 Semanas (24 Horas)',
    imagen_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80',
    video_demo_url: 'https://www.youtube.com/embed/PbAGl_mv5XI',
    temario: [
      'Módulo 1: Hardware de PLCs: Siemens (S7-1200/1500), Allen-Bradley y Delta',
      'Módulo 2: Lenguaje Ladder (KOP), temporizadores y contadores en TIA Portal y Studio 5000',
      'Módulo 3: Diagrama de Bloques de Funciones (FBD) y escalamiento analógico',
      'Módulo 4: Texto Estructurado (ST/SCL) para algoritmos matemáticos',
      'Módulo 5: Secuencias industriales paso a paso con Grafcet (SFC)'
    ]
  },
  {
    titulo: 'Visión Artificial y Procesamiento de Imágenes',
    categoria: 'Inteligencia Artificial',
    descripcion: 'Clasificación de piezas industriales, detección de bordes y seguimiento de objetos en tiempo real con Python y OpenCV.',
    precio: 140.00,
    duracion: '5 Semanas (20 Horas)',
    imagen_url: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=600&q=80',
    video_demo_url: 'https://www.youtube.com/embed/oXlwWbU8l2o',
    temario: [
      'Módulo 1: Espacios de color (RGB, HSV) y matrices de píxeles',
      'Módulo 2: Filtrado de ruido y detección de bordes Canny con OpenCV',
      'Módulo 3: Segmentación y reconocimiento de geometrías en fajas transportadoras',
      'Módulo 4: Object Tracking y extracción de coordenadas para robots',
      'Módulo 5: Redes neuronales básicas para control de calidad visual'
    ]
  },
  {
    titulo: 'Diseño y Ruteo de Placas Electrónicas (PCBs)',
    categoria: 'Electrónica',
    descripcion: 'Creación de esquemáticos profesionales, ruteo multicapa, aislamiento óptico y archivos Gerber listos para manufactura.',
    precio: 115.00,
    duracion: '4 Semanas (16 Horas)',
    imagen_url: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&q=80',
    video_demo_url: 'https://www.youtube.com/embed/35YuILUlfGs',
    temario: [
      'Módulo 1: Simbología esquemática y encapsulados SMD vs THT',
      'Módulo 2: Captura de esquemáticos electrónicos en software EDA (KiCad/Altium)',
      'Módulo 3: Reglas de ruteo PCB, cálculo de ancho de pistas y planos GND',
      'Módulo 4: Diseño de etapas de potencia y aislamiento con optoacopladores',
      'Módulo 5: Exportación de archivos Gerber, BOM y preparación DFM'
    ]
  },
  {
    titulo: 'Simulación de Sistemas Neumáticos y Electroneumáticos',
    categoria: 'Automatización',
    descripcion: 'Diseño de circuitos secuenciales por método cascada, válvulas direccionales y control por relés en FluidSIM.',
    precio: 105.00,
    duracion: '4 Semanas (16 Horas)',
    imagen_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&q=80',
    video_demo_url: 'https://www.youtube.com/embed/2f_ca121kFQ',
    temario: [
      'Módulo 1: Tratamiento del aire comprimido y unidad de mantenimiento FRL',
      'Módulo 2: Válvulas distribuidoras (3/2, 5/2, 5/3) y cilindros neumáticos (ISO 1219)',
      'Módulo 3: Diseño de mandos secuenciales por método Cascada y Paso a Paso',
      'Módulo 4: Electroneumática con relés, sensores magnéticos y electroválvulas',
      'Módulo 5: Sistemas de vacío, ventosas y actuadores de giro'
    ]
  },
  {
    titulo: 'Manufactura Aditiva e Impresión 3D',
    categoria: 'Manufactura',
    descripcion: 'Configuración avanzada de laminadores, selección de polímeros técnicos (PLA, PETG, ABS, TPU) y diseño de tolerancias.',
    precio: 90.00,
    duracion: '4 Semanas (16 Horas)',
    imagen_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&q=80',
    video_demo_url: 'https://www.youtube.com/embed/Vx0Z6LplaMU',
    temario: [
      'Módulo 1: Tecnologías FDM, SLA y cinemática de impresoras 3D',
      'Módulo 2: Propiedades mecánicas y térmicas de filamentos (PLA, ABS, PETG, TPU)',
      'Módulo 3: Parámetros de laminado en Cura/PrusaSlicer (Infill, perímetros y soportes)',
      'Módulo 4: Diseño paramétrico de tolerancias y ajustes para piezas móviles',
      'Módulo 5: Diagnóstico de fallas (Warping, Stringing) y calibración mecánica'
    ]
  },
  {
    titulo: 'Diseño Mecánico y Modelado CAD 3D',
    categoria: 'Diseño Mecánico',
    descripcion: 'Modelado paramétrico en Autodesk Inventor, cajas reductoras de engranajes, cálculo AGMA y análisis de esfuerzos FEA.',
    precio: 135.00,
    duracion: '5 Semanas (20 Horas)',
    imagen_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80',
    video_demo_url: 'https://www.youtube.com/embed/ddU98eb21wY',
    temario: [
      'Módulo 1: Lectura de planos industriales, cortes y tolerancias geométricas (GD&T)',
      'Módulo 2: Modelado paramétrico 3D (extrusión, revolución, barrido y nervios)',
      'Módulo 3: Ensamblaje de caja reductora de engranajes rectos de 3 ejes',
      'Módulo 4: Simulación de esfuerzos (FEA) y validación de engranajes bajo norma AGMA',
      'Módulo 5: Planos de fabricación detallados, lista de materiales (BOM) y exportación STEP'
    ]
  }
];

async function migrarCatalogoAiven() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Conectando a Aiven Cloud...');
    const conn = await pool.getConnection();
    console.log('¡Conexión establecida con éxito!\n');

    await conn.query(`
      CREATE TABLE IF NOT EXISTS catalogo_cursos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(150) NOT NULL UNIQUE,
        categoria VARCHAR(80) NOT NULL,
        descripcion TEXT NOT NULL,
        precio DECIMAL(10, 2) NOT NULL,
        duracion VARCHAR(60) DEFAULT '5 Semanas',
        imagen_url VARCHAR(500) NOT NULL,
        video_demo_url VARCHAR(500) NOT NULL,
        temario JSON NOT NULL,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Tabla "catalogo_cursos" verificada.');

    for (const c of cursosMecatronica) {
      await conn.query(
        `INSERT IGNORE INTO catalogo_cursos 
        (titulo, categoria, descripcion, precio, duracion, imagen_url, video_demo_url, temario) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [c.titulo, c.categoria, c.descripcion, c.precio, c.duracion, c.imagen_url, c.video_demo_url, JSON.stringify(c.temario)]
      );
      console.log(`✔ Curso registrado: ${c.titulo}`);
    }

    conn.release();
    console.log('\n¡Los 10 cursos fueron cargados en Aiven correctamente!');
    process.exit(0);
  } catch (error) {
    console.error('Error al migrar el catálogo:', error);
    process.exit(1);
  }
}

migrarCatalogoAiven();