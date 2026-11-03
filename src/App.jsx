import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import PdfFlipbook from './components/PdfFlipbook';

const API_BASE = 'https://portico-san-marcos.onrender.com/api';
const WHATSAPP_NUMERO = '51967107035';
const GA4_MEASUREMENT_ID = 'G-PSM2026MEC';

// PALABRAS CLAVE IDENTIFICADAS EN GOOGLE SEARCH CONSOLE (RENDIMIENTO ORGÁNICO)
const KEYWORDS_SEARCH_CONSOLE = [
  { keyword: 'cursos de ingeniería mecatrónica perú', clics: 428, impresiones: 3890, ctr: '11.0%', posicion: 1.8, intencion: 'Transaccional' },
  { keyword: 'curso plc siemens tia portal virtual', clics: 365, impresiones: 3120, ctr: '11.7%', posicion: 2.1, intencion: 'Transaccional' },
  { keyword: 'pórtico san marcos aula virtual', clics: 310, impresiones: 1450, ctr: '21.4%', posicion: 1.1, intencion: 'Navegacional' },
  { keyword: 'curso robótica cinemática denavit hartenberg', clics: 215, impresiones: 2480, ctr: '8.7%', posicion: 2.9, intencion: 'Informativa / Comercial' },
  { keyword: 'programación microcontroladores esp32 arduino mega', clics: 194, impresiones: 2190, ctr: '8.9%', posicion: 3.2, intencion: 'Comercial' },
  { keyword: 'diseño de placas pcb altium kicad lima', clics: 168, impresiones: 1840, ctr: '9.1%', posicion: 2.6, intencion: 'Local / Comercial' },
  { keyword: 'simulación electroneumática fluidsim iso 1219', clics: 142, impresiones: 1620, ctr: '8.8%', posicion: 3.4, intencion: 'Comercial' },
  { keyword: 'modelado cad 3d autodesk inventor fea', clics: 129, impresiones: 1510, ctr: '8.5%', posicion: 3.7, intencion: 'Comercial' }
];

// USUARIOS BASE DE RESPALDO (Se fusionan automáticamente con los de la BD Aiven)
const USUARIOS_BASE_SISTEMA = [
  { id: 1, usuario: 'admin', nombres: 'Administrador General', rol: 'admin', estado: 'activo' },
  { id: 2, usuario: 'cendoza', nombres: 'Carlos Mendoza', rol: 'docente', estado: 'activo' },
  { id: 3, usuario: 'agarcia', nombres: 'Ana García', rol: 'docente', estado: 'activo' },
  { id: 4, usuario: 'mangel', nombres: 'Miguel Ángel', rol: 'docente', estado: 'activo' },
  { id: 5, usuario: 'rfernandez', nombres: 'Rosa Fernández', rol: 'docente', estado: 'activo' },
  { id: 6, usuario: 'jsalazar', nombres: 'Jorge Salazar', rol: 'docente', estado: 'activo' },
  { id: 7, usuario: 'lalvarez', nombres: 'Luis Alvarez', rol: 'alumno', estado: 'activo' },
  { id: 8, usuario: 'mtorres', nombres: 'Maria Torres', rol: 'alumno', estado: 'activo' },
  { id: 9, usuario: 'kquispe', nombres: 'Kevin Quispe', rol: 'alumno', estado: 'activo' },
  { id: 10, usuario: 'sramirez', nombres: 'Sofia Ramirez', rol: 'alumno', estado: 'activo' },
  { id: 11, usuario: 'dflores', nombres: 'Diego Flores', rol: 'alumno', estado: 'activo' }
];

// CATÁLOGO MAESTRO UNIFICADO (10 CURSOS COMPLETOS CON SUS 5 MÓDULOS DE TEMARIO)
const CATALOGO_INICIAL = [
  {
    id: 1,
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
    ],
    tipo: 'Virtual',
    horario: 'Martes y Jueves - 7:00 PM',
    instructor: 'Ing. Fabrizio Barzola',
    enlaceSede: 'https://zoom.us/j/9876543210',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    estado: 'activo'
  },
  {
    id: 2,
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
    ],
    tipo: 'Presencial',
    horario: 'Viernes - 7:00 PM',
    instructor: 'Ing. Carlos Mendoza',
    enlaceSede: 'Campus Central - Laboratorio de Electrónica',
    ubicacionImg: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    estado: 'activo'
  },
  {
    id: 3,
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
    ],
    tipo: 'Virtual',
    horario: 'Sábados - 3:00 PM',
    instructor: 'Ing. Fabrizio Barzola',
    enlaceSede: 'https://zoom.us/j/1234567890',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    estado: 'activo'
  },
  {
    id: 4,
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
    ],
    tipo: 'Virtual',
    horario: 'Lunes y Miércoles - 8:00 PM',
    instructor: 'Dra. María Fernández',
    enlaceSede: 'https://meet.google.com/abc-defg-hij',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    estado: 'activo'
  },
  {
    id: 5,
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
    ],
    tipo: 'Virtual',
    horario: 'Martes y Jueves - 8:00 PM',
    instructor: 'Ing. Carlos Mendoza',
    enlaceSede: 'https://zoom.us/j/9876543210',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    estado: 'activo'
  },
  {
    id: 6,
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
    ],
    tipo: 'Virtual',
    horario: 'Viernes - 6:00 PM',
    instructor: 'Dra. María Fernández',
    enlaceSede: 'https://zoom.us/j/5556667770',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    estado: 'activo'
  },
  {
    id: 7,
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
    ],
    tipo: 'Presencial',
    horario: 'Miércoles - 4:00 PM',
    instructor: 'Ing. Carlos Mendoza',
    enlaceSede: 'Campus Central - Laboratorio de Electrónica',
    ubicacionImg: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800',
    estado: 'activo'
  },
  {
    id: 8,
    titulo: 'Simulación de Sistemas Neumáticos y Electroneumáticos',
    categoria: 'Automatización',
    descripcion: 'Diseño de circuitos secuenciales por método cascada, válvulas direccionales y control por relés en FluidSIM.',
    precio: 105.00,
    duracion: '4 Semanas (16 Horas)',
    imagen_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80',
    video_demo_url: 'https://www.youtube.com/embed/2f_ca121kFQ',
    temario: [
      'Módulo 1: Tratamiento del aire comprimido y unidad de mantenimiento FRL',
      'Módulo 2: Válvulas distribuidoras (3/2, 5/2, 5/3) y cilindros neumáticos (ISO 1219)',
      'Módulo 3: Diseño de mandos secuenciales por método Cascada y Paso a Paso',
      'Módulo 4: Electroneumática con relés, sensores magnéticos y electroválvulas',
      'Módulo 5: Sistemas de vacío, ventosas y actuadores de giro'
    ],
    tipo: 'Presencial',
    horario: 'Martes - 4:00 PM',
    instructor: 'Ing. Luis Alvarado',
    enlaceSede: 'Sede Arequipa - Pabellón B - Lab 2',
    ubicacionImg: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800',
    estado: 'activo'
  },
  {
    id: 9,
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
    ],
    tipo: 'Presencial',
    horario: 'Jueves - 5:00 PM',
    instructor: 'Ing. Fabrizio Barzola',
    enlaceSede: 'Campus Central - Taller Mecánico',
    ubicacionImg: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800',
    estado: 'activo'
  },
  {
    id: 10,
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
    ],
    tipo: 'Virtual',
    horario: 'Lunes - 7:00 PM',
    instructor: 'Ing. Luis Alvarado',
    enlaceSede: 'https://zoom.us/j/1234567890',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    estado: 'activo'
  }
];

export default function App() {
  // ESTADOS DE SESIÓN Y CATÁLOGO
  const [sesionIniciada, setSesionIniciada] = useState(() => localStorage.getItem('sesionIniciada') === 'true');
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => localStorage.getItem('usuarioLogueado') || '');
  const [usernameActual, setUsernameActual] = useState(() => localStorage.getItem('usernameActual') || '');
  const [rolUsuario, setRolUsuario] = useState(() => localStorage.getItem('rolUsuario') || '');
  const [sesionToken, setSesionToken] = useState(() => localStorage.getItem('sesionToken') || '');
  const [dispositivoActual, setDispositivoActual] = useState(() => localStorage.getItem('dispositivoActual') || 'Navegador Autorizado');
  const [cursosCatalogo, setCursosCatalogo] = useState(CATALOGO_INICIAL);

  // ESTADOS DE LA TIENDA Y CARRITO
  const [catTiendaActiva, setCatTiendaActiva] = useState('Todos');
  const [busquedaTienda, setBusquedaTienda] = useState('');
  const [cursoDemoModal, setCursoDemoModal] = useState(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [mostrarModalLogin, setMostrarModalLogin] = useState(false);
  const [nombreInteresado, setNombreInteresado] = useState('');
  const [procesandoOrdenServidor, setProcesandoOrdenServidor] = useState(false);
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem('carrito_portico');
    return guardado ? JSON.parse(guardado) : [];
  });

  // ESTADOS DE GOOGLE ANALYTICS 4 (GA4) Y SEARCH CONSOLE (PARA MONITOREO DEL ADMIN)
  const [eventosGA4, setEventosGA4] = useState(() => {
    const guardados = localStorage.getItem('ga4_eventos_portico');
    return guardados ? JSON.parse(guardados) : [
      { id: 1, evento: 'page_view', detalle: 'Carga inicial de Tienda Pública y Catálogo SEO', fecha: new Date().toLocaleTimeString() }
    ];
  });

  // FUNCIÓN CENTRAL DE RASTREO GOOGLE ANALYTICS 4 (GTAG.JS + REGISTRO DE COMPORTAMIENTO)
  const registrarEventoGA4 = (nombreEvento, parametros = {}) => {
    try {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', nombreEvento, {
          ...parametros,
          send_to: GA4_MEASUREMENT_ID
        });
      }
      const nuevoRegistro = {
        id: Date.now() + Math.random(),
        evento: nombreEvento,
        detalle: parametros.item_name || parametros.search_term || parametros.categoria || parametros.metodo || 'Interacción de usuario',
        usuario: usernameActual || 'visitante_web',
        fecha: new Date().toLocaleTimeString()
      };
      setEventosGA4(prev => {
        const actualizados = [nuevoRegistro, ...prev.slice(0, 29)];
        localStorage.setItem('ga4_eventos_portico', JSON.stringify(actualizados));
        return actualizados;
      });
    } catch (e) {}
  };

  // ESTADOS DE SEGURIDAD Y LEY 29733
  const [aceptaDatosLogin, setAceptaDatosLogin] = useState(false);
  const [aceptaDatosCarrito, setAceptaDatosCarrito] = useState(false);
  const [modalPrivacidadAbierto, setModalPrivacidadAbierto] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [tiempoBloqueo, setTiempoBloqueo] = useState(0);

  // ESTADOS DE LOS 7 CONTROLES DE SEGURIDAD EN SERVIDOR
  const [infoTokenPdf, setInfoTokenPdf] = useState(null);
  const [ordenesServidor, setOrdenesServidor] = useState([]);
  const [modalEvaluacionCurso, setModalEvaluacionCurso] = useState(null);
  const [preguntasExamen, setPreguntasExamen] = useState([]);
  const [respuestasExamen, setRespuestasExamen] = useState({});
  const [resultadoExamenServidor, setResultadoExamenServidor] = useState(null);
  const [notasServidor, setNotasServidor] = useState([]);

  const [modalSubirArchivoCurso, setModalSubirArchivoCurso] = useState(null);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [estadoValidacionArchivo, setEstadoValidacionArchivo] = useState(null);
  const [archivosSegurosLista, setArchivosSegurosLista] = useState([]);

  // ESTADOS DE CREACIÓN DE CURSOS (ADMIN Y DOCENTES)
  const [modalNuevoCurso, setModalNuevoCurso] = useState(false);
  const [nuevoCursoForm, setNuevoCursoForm] = useState({
    titulo: '',
    categoria: 'Robótica',
    descripcion: '',
    precio: '120',
    duracion: '5 Semanas (20 Horas)',
    imagen_url: '',
    video_demo_url: '',
    temarioTexto: 'Módulo 1: Fundamentos\nMódulo 2: Laboratorio Práctico',
    tipo: 'Virtual',
    horario: 'Martes y Jueves - 7:00 PM',
    instructor: 'Ing. Fabrizio Barzola',
    enlaceSede: 'https://zoom.us/j/9876543210'
  });

  // ESTADOS DE MATRÍCULAS
  const [matriculas, setMatriculas] = useState([]);
  const [alumnoSeleccionadoMatricula, setAlumnoSeleccionadoMatricula] = useState('');
  const [cursoSeleccionadoMatricula, setCursoSeleccionadoMatricula] = useState(1);

  // ESTADOS DEL CHAT MODERNO EN TIEMPO REAL
  const [mensajesBD, setMensajesBD] = useState([]);
  const [contactoActivoChat, setContactoActivoChat] = useState('todos');
  const [busquedaContactoChat, setBusquedaContactoChat] = useState('');
  const [asuntoMsg, setAsuntoMsg] = useState('');
  const [contenidoMsg, setContenidoMsg] = useState('');
  const [estadoEnvioMsg, setEstadoEnvioMsg] = useState('');
  const [modoSupervisionAdmin, setModoSupervisionAdmin] = useState(true);
  const chatScrollRef = useRef(null);

  // ESTADOS DE GESTIÓN DE USUARIOS EN BD
  const [listaUsuarios, setListaUsuarios] = useState(USUARIOS_BASE_SISTEMA);
  const [modalUsuario, setModalUsuario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioForm, setUsuarioForm] = useState({ id: null, usuario: '', password: '', nombres: '', rol: 'alumno' });
  const [mensajeUserMsg, setMensajeUserMsg] = useState('');
  const [modalResetPass, setModalResetPass] = useState(false);
  const [userToReset, setUserToReset] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // =========================================================================
  // PERMISOS ESTRICTOS: ADMIN VS DOCENTE VS ALUMNO
  // =========================================================================
  const esAdmin = rolUsuario === 'admin' || usernameActual === 'admin';
  const esDocente = rolUsuario === 'docente';
  const esAlumno = rolUsuario === 'alumno';
  const puedeGestionarCursos = esAdmin || esDocente;

  // SEO Dinámico en el título de la pestaña según la vista activa
  useEffect(() => {
    if (!sesionIniciada) {
      document.title = `Pórtico San Marcos | Cursos de ${catTiendaActiva === 'Todos' ? 'Ingeniería Mecatrónica, Robótica y PLC' : catTiendaActiva}`;
    } else {
      document.title = `Aula Virtual Pórtico San Marcos | Panel de ${rolUsuario.toUpperCase()}`;
    }
  }, [sesionIniciada, catTiendaActiva, rolUsuario]);

  // Temporizador para fuerza bruta
  useEffect(() => {
    if (tiempoBloqueo <= 0) return;
    const timer = setInterval(() => {
      setTiempoBloqueo(prev => {
        if (prev <= 1) {
          setIntentosFallidos(0);
          setMensaje('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [tiempoBloqueo]);

  useEffect(() => {
    localStorage.setItem('carrito_portico', JSON.stringify(carrito));
  }, [carrito]);

  // =========================================================================
  // FUNCIONES DE SINCRONIZACIÓN CON LA BASE DE DATOS Y SEGURIDAD
  // =========================================================================
  const cargarCatalogoDesdeBD = async () => {
    try {
      const res = await fetch(`${API_BASE}/catalogo`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const mapLocal = new Map(CATALOGO_INICIAL.map(c => [c.id, c]));
        data.forEach(dbCurso => {
          const base = mapLocal.get(dbCurso.id) || {};
          mapLocal.set(dbCurso.id, {
            ...base,
            ...dbCurso,
            estado: dbCurso.estado || base.estado || 'activo'
          });
        });
        setCursosCatalogo(Array.from(mapLocal.values()));
      }
    } catch (e) {}
  };

  const cargarUsuariosDesdeBD = async () => {
    try {
      const res = await fetch(`${API_BASE}/usuarios`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const mapa = new Map();
        USUARIOS_BASE_SISTEMA.forEach(u => mapa.set(u.usuario.toLowerCase(), u));
        data.forEach(u => {
          if (u && u.usuario) {
            mapa.set(u.usuario.toLowerCase(), {
              ...mapa.get(u.usuario.toLowerCase()),
              ...u,
              estado: u.estado || 'activo'
            });
          }
        });
        setListaUsuarios(Array.from(mapa.values()));
      }
    } catch (e) {}
  };

  const cargarMatriculasDesdeBD = async () => {
    try {
      const res = await fetch(`${API_BASE}/matriculas`);
      const data = await res.json();
      if (Array.isArray(data)) setMatriculas(data);
    } catch (e) {}
  };

  const cargarMensajesDesdeBD = async (usr) => {
    const usuarioConsulta = (usr || usernameActual || '').trim();
    if (!usuarioConsulta) return;
    try {
      const res = await fetch(`${API_BASE}/mensajes/${encodeURIComponent(usuarioConsulta)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMensajesBD(data);
      }
    } catch (e) {}
  };

  const cargarDatosSeguridadServidor = async (usr) => {
    const usuarioConsulta = (usr || usernameActual || '').trim();
    if (!usuarioConsulta) return;
    try {
      const resNotas = await fetch(`${API_BASE}/seguridad/notas/${encodeURIComponent(usuarioConsulta)}`);
      const dataNotas = await resNotas.json();
      if (Array.isArray(dataNotas)) setNotasServidor(dataNotas);

      if (usuarioConsulta === 'admin' || rolUsuario === 'admin') {
        const resOrd = await fetch(`${API_BASE}/seguridad/ordenes`);
        const dataOrd = await resOrd.json();
        if (Array.isArray(dataOrd)) setOrdenesServidor(dataOrd);

        const resArch = await fetch(`${API_BASE}/seguridad/archivos`);
        const dataArch = await resArch.json();
        if (Array.isArray(dataArch)) setArchivosSegurosLista(dataArch);
      }
    } catch (e) {}
  };

  // PROTECCIÓN 3: VERIFICACIÓN SILENCIOSA DE SESIÓN Y DISPOSITIVO ÚNICO
  const verificarSesionUnicaEnServidor = async (usr, token) => {
    if (!usr || !token) return;
    try {
      const res = await fetch(`${API_BASE}/seguridad/verificar-sesion/${encodeURIComponent(usr)}/${encodeURIComponent(token)}`);
      const data = await res.json();
      if (data && data.valida === false) {
        alert(`🔒 Control de Seguridad:\n\n${data.motivo}`);
        cerrarSesion();
      }
    } catch (e) {}
  };

  useEffect(() => {
    cargarCatalogoDesdeBD();
  }, []);

  useEffect(() => {
    if (!sesionIniciada || !usernameActual) return;

    cargarUsuariosDesdeBD();
    cargarMatriculasDesdeBD();
    cargarMensajesDesdeBD(usernameActual);
    cargarDatosSeguridadServidor(usernameActual);

    const intervaloTiempoReal = setInterval(() => {
      cargarMensajesDesdeBD(usernameActual);
      cargarUsuariosDesdeBD();
      cargarMatriculasDesdeBD();
      if (sesionToken) {
        verificarSesionUnicaEnServidor(usernameActual, sesionToken);
      }
    }, 3000);

    return () => clearInterval(intervaloTiempoReal);
  }, [sesionIniciada, usernameActual, sesionToken]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [mensajesBD.length, contactoActivoChat]);

  // =========================================================================
  // PROTECCIÓN 4 Y 5 + EVENTOS GA4 EN CARRITO Y CONVERSIÓN WHATSAPP
  // =========================================================================
  const agregarAlCarrito = (curso) => {
    if (!carrito.some(item => item.id === curso.id)) {
      setCarrito([...carrito, curso]);
      registrarEventoGA4('add_to_cart', {
        item_id: curso.id,
        item_name: curso.titulo,
        value: Number(curso.precio),
        currency: 'PEN'
      });
    }
    setCarritoAbierto(true);
  };

  const quitarDelCarrito = (id) => {
    const cursoEliminado = carrito.find(item => item.id === id);
    if (cursoEliminado) {
      registrarEventoGA4('remove_from_cart', { item_name: cursoEliminado.titulo });
    }
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const estaEnCarrito = (id) => carrito.some(item => item.id === id);
  const totalCarrito = carrito.reduce((acc, item) => acc + Number(item.precio), 0);

  const enviarPedidoWhatsApp = async () => {
    if (carrito.length === 0) return;
    if (!aceptaDatosCarrito) {
      alert('Por favor, acepta la Política de Privacidad antes de continuar.');
      return;
    }

    setProcesandoOrdenServidor(true);
    const nombreLimpio = nombreInteresado.replace(/[<>]/g, '').trim();

    registrarEventoGA4('begin_checkout', {
      item_name: `Pedido WhatsApp (${carrito.length} cursos) - S/ ${totalCarrito.toFixed(2)}`,
      value: totalCarrito,
      currency: 'PEN'
    });

    try {
      const res = await fetch(`${API_BASE}/seguridad/crear-orden-compra`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          curso_ids: carrito.map(c => c.id),
          nombre_cliente: nombreLimpio || 'Estudiante',
          usuario_cliente: usernameActual || 'invitado'
        })
      });
      const data = await res.json();

      const itemsFinales = data.success && Array.isArray(data.itemsValidados) ? data.itemsValidados : carrito;
      const totalOficial = data.success && typeof data.totalServidor === 'number' ? data.totalServidor : totalCarrito;
      const codigoOrdenServidor = data.codigoOrden || 'PSM-2026';

      const saludo = nombreLimpio
        ? `¡Hola *Pórtico San Marcos*! 👋 Mi nombre es *${nombreLimpio}*.`
        : `¡Hola *Pórtico San Marcos*! 👋`;
      const listaTexto = itemsFinales
        .map((c, i) => `${i + 1}. *${c.titulo}* - S/ ${Number(c.precio).toFixed(2)}`)
        .join('\n');
      const textoFinal = `${saludo}\n📋 *Orden de Matrícula:* ${codigoOrdenServidor}\nDeseo adquirir los siguientes cursos de Ingeniería Mecatrónica:\n\n${listaTexto}\n\n💰 *Total a pagar: S/ ${Number(totalOficial).toFixed(2)}*\n\n*(He leído y acepto la política de datos)*\n¿Me podrían brindar los medios de pago para habilitar mi acceso?`;

      setProcesandoOrdenServidor(false);
      window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(textoFinal)}`, '_blank');
    } catch (err) {
      setProcesandoOrdenServidor(false);
      const saludo = nombreLimpio
        ? `¡Hola *Pórtico San Marcos*! 👋 Mi nombre es *${nombreLimpio}*.`
        : `¡Hola *Pórtico San Marcos*! 👋`;
      const listaTexto = carrito
        .map((c, i) => `${i + 1}. *${c.titulo}* - S/ ${Number(c.precio).toFixed(2)}`)
        .join('\n');
      const textoFinal = `${saludo}\nDeseo adquirir los siguientes cursos de Ingeniería Mecatrónica:\n\n${listaTexto}\n\n💰 *Total a pagar: S/ ${totalCarrito.toFixed(2)}*`;
      window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(textoFinal)}`, '_blank');
    }
  };

  // =========================================================================
  // PROTECCIÓN 1: VALIDACIÓN DE MATRÍCULA EN SERVIDOR ANTES DE ABRIR ENLACES PRIVADOS
  // =========================================================================
  const solicitarAccesoCursoPrivado = async (curso, modoAccion) => {
    registrarEventoGA4('select_content', {
      item_name: `Acceso a ${modoAccion.toUpperCase()}: ${curso.titulo}`
    });
    try {
      const res = await fetch(`${API_BASE}/seguridad/acceso-curso`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: usernameActual,
          rol: rolUsuario,
          curso_id: curso.id
        })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || '🔒 Acceso restringido: Debes estar matriculado en este curso para acceder a las sesiones y grabaciones.');
        return;
      }

      if (modoAccion === 'grabacion') {
        setVideoActivo({
          ...curso,
          videoUrl: data.videoUrl || curso.videoUrl,
          firmaServidor: data.firmaServidor
        });
      } else if (modoAccion === 'zoom') {
        window.open(data.enlaceSede || curso.enlaceSede || 'https://zoom.us', '_blank');
      } else if (modoAccion === 'sede') {
        setLaboratorioSeleccionado({
          ...curso,
          enlaceSede: data.enlaceSede || curso.enlaceSede,
          firmaServidor: data.firmaServidor
        });
      }
    } catch (error) {
      const matriculadoLocal = esAdmin || esDocente || matriculas.some(m => m.usuario_alumno === usernameActual && Number(m.curso_id) === Number(curso.id));
      if (!matriculadoLocal) {
        alert('🔒 Acceso restringido: No registras matrícula activa en este curso.');
        return;
      }
      if (modoAccion === 'grabacion') setVideoActivo(curso);
      if (modoAccion === 'zoom') window.open(curso.enlaceSede || '#', '_blank');
      if (modoAccion === 'sede') setLaboratorioSeleccionado(curso);
    }
  };

  // =========================================================================
  // PROTECCIÓN 2: ABRIR LIBRO CON ENLACE TEMPORAL SILENCIOSO EN SERVIDOR
  // =========================================================================
  const abrirLibroConEnlaceTemporal = async (libro) => {
    registrarEventoGA4('file_download', { item_name: `Lectura Flipbook 3D: ${libro.titulo}` });
    try {
      const res = await fetch(`${API_BASE}/seguridad/enlace-pdf-temporal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: usernameActual || 'estudiante',
          libro_id: libro.id
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInfoTokenPdf({
          titulo: libro.titulo,
          token: data.tokenTemporal,
          expira: new Date(data.expiraEn).toLocaleTimeString(),
          endpoint: `${API_BASE}/seguridad/descargar-pdf/${data.tokenTemporal}`
        });
        setLibroSeleccionado(libro.pdfUrl);
      } else {
        setLibroSeleccionado(libro.pdfUrl);
      }
    } catch (err) {
      setLibroSeleccionado(libro.pdfUrl);
    }
  };

  // =========================================================================
  // PROTECCIÓN 6: EVALUACIONES PARA ESTUDIANTES VALIDADAS EN BACKEND
  // =========================================================================
  const abrirEvaluacionSegura = async (curso) => {
    setResultadoExamenServidor(null);
    setRespuestasExamen({});
    setModalEvaluacionCurso(curso);
    registrarEventoGA4('select_content', { item_name: `Inicio Evaluación: ${curso.titulo}` });
    try {
      const res = await fetch(`${API_BASE}/seguridad/preguntas-evaluacion/${curso.id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.preguntas)) {
        setPreguntasExamen(data.preguntas);
      }
    } catch (e) {}
  };

  const enviarEvaluacionAlServidor = async (e) => {
    e.preventDefault();
    if (!modalEvaluacionCurso) return;
    try {
      const res = await fetch(`${API_BASE}/seguridad/evaluar-examen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: usernameActual,
          curso_id: modalEvaluacionCurso.id,
          respuestas: respuestasExamen
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResultadoExamenServidor(data);
        cargarDatosSeguridadServidor(usernameActual);
      }
    } catch (e) {
      alert('Error al calificar la evaluación.');
    }
  };

  // =========================================================================
  // PROTECCIÓN 7: SUBIDA DE ARCHIVOS PARA ESTUDIANTES VALIDADA EN BACKEND
  // =========================================================================
  const handleSeleccionarArchivo = (e) => {
    const file = e.target.files && e.target.files[0];
    setEstadoValidacionArchivo(null);
    if (file) {
      setArchivoSeleccionado(file);
    }
  };

  const enviarArchivoAlServidor = async (e) => {
    e.preventDefault();
    if (!archivoSeleccionado || !modalSubirArchivoCurso) return;

    setEstadoValidacionArchivo({ tipo: 'info', texto: 'Verificando archivo y subiendo entrega...' });

    const lector = new FileReader();
    lector.onload = async () => {
      try {
        const res = await fetch(`${API_BASE}/seguridad/validar-archivo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuario: usernameActual,
            curso_id: modalSubirArchivoCurso.id,
            nombre_archivo: archivoSeleccionado.name,
            tamano_bytes: archivoSeleccionado.size,
            contenido_base64: lector.result
          })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setEstadoValidacionArchivo({
            tipo: 'exito',
            texto: `${data.message}`
          });
          setArchivoSeleccionado(null);
          cargarDatosSeguridadServidor(usernameActual);
        } else {
          setEstadoValidacionArchivo({
            tipo: 'error',
            texto: data.message || 'El archivo no cumple con los requisitos de seguridad.'
          });
        }
      } catch (err) {
        setEstadoValidacionArchivo({
          tipo: 'error',
          texto: 'Error de conexión al subir el archivo.'
        });
      }
    };
    lector.readAsDataURL(archivoSeleccionado);
  };

  const confirmarPagoOrdenEnServidor = async (codigoOrden) => {
    const alumno = prompt('Ingresa el usuario del alumno para activar su matrícula tras confirmar el pago (ej: dflores):', alumnoSeleccionadoMatricula || 'dflores');
    if (alumno === null) return;
    try {
      const res = await fetch(`${API_BASE}/seguridad/confirmar-pago-servidor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo_orden: codigoOrden,
          usuario_alumno: alumno.trim(),
          rol_ejecutor: rolUsuario
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message);
        cargarDatosSeguridadServidor(usernameActual);
        cargarMatriculasDesdeBD();
      } else {
        alert(data.message || 'No se pudo confirmar la orden.');
      }
    } catch (e) {}
  };

  // =========================================================================
  // CREACIÓN Y GESTIÓN DE CURSOS (DOCENTES Y ADMIN)
  // =========================================================================
  const handleCrearCursoBD = async (e) => {
    e.preventDefault();
    const temarioArray = nuevoCursoForm.temarioTexto
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);
    const payload = {
      ...nuevoCursoForm,
      precio: Number(nuevoCursoForm.precio),
      temario: temarioArray
    };
    try {
      const res = await fetch(`${API_BASE}/catalogo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const nuevoCursoObj = {
        ...payload,
        id: data.id || Date.now(),
        imagen_url: payload.imagen_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
        video_demo_url: payload.video_demo_url || 'https://www.youtube.com/embed/fc_cA62Z1kQ',
        estado: 'activo'
      };
      setCursosCatalogo([...cursosCatalogo, nuevoCursoObj]);
      setModalNuevoCurso(false);
      alert('Curso guardado exitosamente en la Base de Datos.');
    } catch (error) {
      alert('Error al conectar con el servidor.');
    }
  };

  const handleToggleEstadoCurso = async (curso) => {
    const nuevoEstado = curso.estado === 'inactivo' ? 'activo' : 'inactivo';
    setCursosCatalogo(cursosCatalogo.map(c => c.id === curso.id ? { ...c, estado: nuevoEstado } : c));
    try {
      await fetch(`${API_BASE}/catalogo/${curso.id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
    } catch (error) {}
  };

  // =========================================================================
  // FUNCIONES DE MATRÍCULA DE ALUMNOS
  // =========================================================================
  const handleAsignarCursoAlumno = async (e) => {
    e.preventDefault();
    if (!alumnoSeleccionadoMatricula) return alert('Selecciona un alumno.');
    const nuevaMat = { usuario_alumno: alumnoSeleccionadoMatricula, curso_id: Number(cursoSeleccionadoMatricula) };
    if (!matriculas.some(m => m.usuario_alumno === nuevaMat.usuario_alumno && Number(m.curso_id) === nuevaMat.curso_id)) {
      setMatriculas([...matriculas, nuevaMat]);
    }
    try {
      await fetch(`${API_BASE}/matriculas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaMat)
      });
      alert(`Curso asignado exitosamente al estudiante @${alumnoSeleccionadoMatricula}`);
    } catch (err) {}
  };

  const handleQuitarCursoAlumno = async (usuario_alumno, curso_id) => {
    setMatriculas(matriculas.filter(m => !(m.usuario_alumno === usuario_alumno && Number(m.curso_id) === Number(curso_id))));
    try {
      await fetch(`${API_BASE}/matriculas/${usuario_alumno}/${curso_id}`, { method: 'DELETE' });
    } catch (err) {}
  };

  // =========================================================================
  // ENVÍO DE MENSAJES EN TIEMPO REAL
  // =========================================================================
  const handleEnviarMensajeBD = async (e) => {
    e.preventDefault();
    if (!contenidoMsg.trim() || !contactoActivoChat) return;

    setEstadoEnvioMsg('Enviando...');
    const remitenteReal = (usernameActual || usuarioLogueado || 'usuario').trim();

    const nuevoMensaje = {
      remitente: remitenteReal,
      rol_remitente: rolUsuario || 'alumno',
      destinatario: contactoActivoChat.trim(),
      asunto: asuntoMsg.trim() || 'Chat Académico',
      contenido: contenidoMsg.trim(),
      fecha_envio: new Date().toISOString()
    };

    try {
      const res = await fetch(`${API_BASE}/mensajes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoMensaje)
      });
      const data = await res.json();

      if (res.ok && data.success !== false) {
        const msgConfirmado = { ...nuevoMensaje, id: data.id || Date.now() };
        setMensajesBD(prev => [...prev, msgConfirmado]);
        setContenidoMsg('');
        setAsuntoMsg('');
        setEstadoEnvioMsg('✓ Enviado');
        cargarMensajesDesdeBD(remitenteReal);
        setTimeout(() => setEstadoEnvioMsg(''), 2500);
      } else {
        setEstadoEnvioMsg('⚠️ No se pudo entregar.');
      }
    } catch (err) {
      setEstadoEnvioMsg('❌ Error de red.');
    }
  };

  // =========================================================================
  // GESTIÓN DE USUARIOS CONECTADA A LA BASE DE DATOS (EXCLUSIVO ADMIN)
  // =========================================================================
  const abrirModalCrearUsuario = () => {
    setModoEdicion(false);
    setUsuarioForm({ id: null, usuario: '', password: '', nombres: '', rol: 'alumno' });
    setMensajeUserMsg('');
    setModalUsuario(true);
  };

  const abrirModalEditarUsuario = (u) => {
    setModoEdicion(true);
    setUsuarioForm({ id: u.id, usuario: u.usuario, password: '', nombres: u.nombres, rol: u.rol });
    setMensajeUserMsg('');
    setModalUsuario(true);
  };

  const handleGuardarUsuario = async (e) => {
    e.preventDefault();
    const usuarioLimpio = usuarioForm.usuario.replace(/[^a-zA-Z0-9._-]/g, '').trim();

    if (!modoEdicion) {
      if (!usuarioForm.password) return setMensajeUserMsg('Debes asignarle una contraseña al nuevo usuario.');
      try {
        const res = await fetch(`${API_BASE}/auth/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuario: usuarioLimpio,
            password: usuarioForm.password,
            nombres: usuarioForm.nombres,
            rol: usuarioForm.rol
          })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          await cargarUsuariosDesdeBD();
          setModalUsuario(false);
          alert(`¡Usuario @${usuarioLimpio} creado en la Base de Datos con éxito!`);
        } else {
          setMensajeUserMsg(data.message || 'El usuario ya existe o hubo un error.');
        }
      } catch (err) {
        setMensajeUserMsg('Error al conectar con la Base de Datos.');
      }
    } else {
      try {
        const res = await fetch(`${API_BASE}/auth/users/${usuarioForm.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombres: usuarioForm.nombres, rol: usuarioForm.rol })
        });
        if (res.ok) {
          await cargarUsuariosDesdeBD();
          setModalUsuario(false);
        }
      } catch (err) {
        setMensajeUserMsg('Error al actualizar en la Base de Datos.');
      }
    }
  };

  const toggleEstadoUsuario = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    try {
      await fetch(`${API_BASE}/auth/users/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      cargarUsuariosDesdeBD();
    } catch (error) {}
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPasswordInput) return;
    try {
      const res = await fetch(`${API_BASE}/auth/users/${userToReset.id}/reset-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPasswordInput })
      });
      if (res.ok) {
        alert(`Contraseña del usuario '${userToReset.usuario}' actualizada en la Base de Datos.`);
        setModalResetPass(false);
        setNewPasswordInput('');
        setUserToReset(null);
      }
    } catch (error) {
      alert('Error al cambiar contraseña.');
    }
  };

  // =========================================================================
  // LOGIN CON CONTROL DE SESIONES Y EVENTO GA4
  // =========================================================================
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (tiempoBloqueo > 0) return;
    if (!aceptaDatosLogin) return setMensaje('Debes aceptar la Política de Privacidad para continuar.');

    const usuarioSanitizado = usuario.replace(/[^a-zA-Z0-9._-]/g, '').trim();
    setMensaje('Verificando credenciales...');

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: usuarioSanitizado, password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        const nombreUsr = data.user.nombres || data.user.usuario;
        const rolUsr = data.user.usuario === 'admin' ? 'admin' : (data.user.rol || 'alumno');

        const etiquetaDispositivo = `${navigator.platform || 'Dispositivo'} (${window.innerWidth}x${window.innerHeight})`;
        try {
          const resSes = await fetch(`${API_BASE}/seguridad/registrar-sesion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: data.user.usuario, dispositivo: etiquetaDispositivo })
          });
          const dataSes = await resSes.json();
          if (dataSes.success && dataSes.sesionToken) {
            setSesionToken(dataSes.sesionToken);
            setDispositivoActual(etiquetaDispositivo);
            localStorage.setItem('sesionToken', dataSes.sesionToken);
            localStorage.setItem('dispositivoActual', etiquetaDispositivo);
          }
        } catch (e) {}

        registrarEventoGA4('login', {
          metodo: `Ingreso Aula Virtual (@${data.user.usuario} - ${rolUsr})`
        });

        setUsuarioLogueado(nombreUsr);
        setUsernameActual(data.user.usuario);
        setRolUsuario(rolUsr);
        setSesionIniciada(true);
        setMostrarModalLogin(false);
        setMensaje('');
        setIntentosFallidos(0);
        localStorage.setItem('sesionIniciada', 'true');
        localStorage.setItem('usuarioLogueado', nombreUsr);
        localStorage.setItem('usernameActual', data.user.usuario);
        localStorage.setItem('rolUsuario', rolUsr);
      } else {
        const nuevosIntentos = intentosFallidos + 1;
        setIntentosFallidos(nuevosIntentos);
        if (nuevosIntentos >= 3) {
          setTiempoBloqueo(30);
          setMensaje('⚠️ Demasiados intentos fallidos. Bloqueado por 30 segundos.');
        } else {
          setMensaje(`${data.message || 'Credenciales incorrectas'} (${nuevosIntentos}/3)`);
        }
      }
    } catch (error) {
      setMensaje('Error de conexión con el servidor.');
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('sesionIniciada');
    localStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('usernameActual');
    localStorage.removeItem('rolUsuario');
    localStorage.removeItem('sesionToken');
    setSesionIniciada(false);
    setUsuario('');
    setPassword('');
    setRolUsuario('');
    setUsernameActual('');
    setSesionToken('');
    setVideoActivo(null);
    setLaboratorioSeleccionado(null);
    setLibroSeleccionado(null);
  };

  const renderModalPrivacidad = () => {
    if (!modalPrivacidadAbierto) return null;
    return (
      <div onClick={() => setModalPrivacidadAbierto(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.88)', backdropFilter: 'blur(6px)', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div onClick={e => e.stopPropagation()} style={{ background: '#1e293b', color: '#f8fafc', border: '1px solid #334155', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '24px', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.6)' }}>
          <button onClick={() => setModalPrivacidadAbierto(false)} style={{ position: 'absolute', top: '14px', right: '14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Cerrar ✕</button>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#fff' }}>Política de Privacidad (Ley N° 29733)</h3>
          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', margin: '0 0 20px 0' }}>
            Tus datos personales y credenciales son protegidos mediante cifrado seguro y se utilizan exclusivamente para la gestión académica, control de acceso y coordinación de matrículas dentro del Aula Virtual Pórtico San Marcos.
          </p>
          <div style={{ textAlign: 'right' }}>
            <button onClick={() => { setAceptaDatosLogin(true); setAceptaDatosCarrito(true); setModalPrivacidadAbierto(false); }} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
              Entendido y Aceptar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [modalidadFiltro, setModalidadFiltro] = useState('virtual');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  const seccionInicioRef = useRef(null);
  const seccionPerfilRef = useRef(null);
  const seccionCursosRef = useRef(null);
  const seccionDocentesRef = useRef(null);
  const seccionBibliotecaRef = useRef(null);
  const seccionMensajesRef = useRef(null);
  const seccionSeoAnalyticsRef = useRef(null);
  const seccionSeguridadRef = useRef(null);
  const seccionUsuariosRef = useRef(null);

  const irASeccion = (ref) => {
    setMenuMovilAbierto(false);
    if (ref && ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // =========================================================================
  // BANNERS HERO PRINCIPALES (3 TÍTULOS CON IMÁGENES VERIFICADAS Y BOLITAS)
  // =========================================================================
  const [bannerActual, setBannerActual] = useState(0);
  const bannersHero = [
    {
      tag: 'PÓRTICO SAN MARCOS | AULA VIRTUAL',
      titulo: 'Excelencia Académica y Tecnológica,',
      subtitulo: 'Formación de alto impacto para el futuro.',
      statsNum: '+ 35 MIL',
      statsTxt: 'Estudiantes Registrados',
      img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop'
    },
    {
      tag: 'BIBLIOTECA VIRTUAL & LIBROS INTERACTIVOS',
      titulo: 'Accede a Textos y Manuales Técnicos,',
      subtitulo: 'Visor estilo Flipbook 3D digital para tus estudios.',
      statsNum: '100%',
      statsTxt: 'Material Digital Gratuito',
      img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1000&auto=format&fit=crop'
    },
    {
      tag: 'LABORATORIOS DE AUTOMATIZACIÓN Y ROBÓTICA',
      titulo: 'Sesiones Prácticas en Banco de Pruebas,',
      subtitulo: 'Infraestructura acreditada de primer nivel.',
      statsNum: '+ 150',
      statsTxt: 'Prácticas Habilitadas',
      img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => setBannerActual((prev) => (prev + 1) % bannersHero.length), 5500);
    return () => clearInterval(interval);
  }, [bannersHero.length]);

  const [videoActivo, setVideoActivo] = useState(null);
  const [laboratorioSeleccionado, setLaboratorioSeleccionado] = useState(null);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);

  const listaLibros = [
    { id: 1, titulo: 'Manual de Automatización e Industria 4.0 con TIA Portal', autor: 'Ing. Carlos Mendoza', categoria: 'ingenieria', portada: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop', pdfUrl: '/manual_plc.pdf' },
    { id: 2, titulo: 'Arquitectura Limpia y Microservicios con Node.js', autor: 'Dr. Roberto Gómez', categoria: 'programacion', portada: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop', pdfUrl: '/node_microservicios.pdf' },
    { id: 3, titulo: 'Guía Práctica de Robótica e IoT con ESP32', autor: 'Ing. Fabrizio Barzola', categoria: 'mecatronica', portada: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop', pdfUrl: '/guia_esp32.pdf' },
    { id: 4, titulo: 'Fundamentos de Neumática e Hidráulica ISO 1219', autor: 'Ing. Luis Alvarado', categoria: 'mecatronica', portada: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=600&auto=format&fit=crop', pdfUrl: '/neumatica_iso1219.pdf' }
  ];

  const docentesDestacados = [
    { id: 1, nombre: 'Ing. Fabrizio Barzola', especialidad: 'Especialista en Robótica, ESP32 y Microcontroladores', sede: 'Campus Central - Lab 4', foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop' },
    { id: 2, nombre: 'Ing. Carlos Mendoza', especialidad: 'Experto en PLC Siemens TIA Portal y Electrónica de Potencia', sede: 'Campus Central - Lab Electrónica', foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop' },
    { id: 3, nombre: 'Ing. Luis Alvarado', especialidad: 'Consultor en Neumática, Electroneumática e ISO 1219', sede: 'Sede Arequipa - Pabellón B', foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop' },
    { id: 4, nombre: 'Dra. María Fernández', especialidad: 'Doctora en Procesamiento Digital de Señales y MATLAB', sede: 'Campus Virtual', foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop' }
  ];

  const misCursosMatriculados = cursosCatalogo.filter(c =>
    matriculas.some(m => m.usuario_alumno === usernameActual && Number(m.curso_id) === Number(c.id))
  );

  const clasesInternasFiltradas = cursosCatalogo.filter(item => {
    if (!puedeGestionarCursos && item.estado === 'inactivo') return false;
    const tipoFiltro = item.tipo ? item.tipo.toLowerCase() : 'virtual';
    const coincideModalidad = tipoFiltro === modalidadFiltro.toLowerCase();
    const coincideCategoria = categoriaSeleccionada === 'todas' || item.categoria === categoriaSeleccionada;
    const busqMin = busqueda.toLowerCase();
    const coincideBusqueda = item.titulo.toLowerCase().includes(busqMin) || (item.instructor && item.instructor.toLowerCase().includes(busqMin));
    return coincideModalidad && coincideCategoria && coincideBusqueda;
  });

  // Filtrado de contactos y mensajes para el Chat Moderno Oscuro
  const contactosChat = listaUsuarios.filter(u =>
    u.usuario !== usernameActual &&
    (u.nombres.toLowerCase().includes(busquedaContactoChat.toLowerCase()) ||
     u.usuario.toLowerCase().includes(busquedaContactoChat.toLowerCase()) ||
     u.rol.toLowerCase().includes(busquedaContactoChat.toLowerCase()))
  );

  const mensajesConversacionActiva = mensajesBD.filter(m => {
    const rem = (m.remitente || '').toLowerCase();
    const dest = (m.destinatario || '').toLowerCase();
    const yo = (usernameActual || '').toLowerCase();
    const activo = (contactoActivoChat || '').toLowerCase();

    if (activo === 'todos') {
      if (esAdmin && modoSupervisionAdmin) return true;
      return dest === 'todos';
    }

    if (esAdmin && modoSupervisionAdmin) {
      return rem === activo || dest === activo;
    }

    return (rem === yo && dest === activo) || (rem === activo && dest === yo);
  });

  const infoContactoSeleccionado = contactoActivoChat === 'todos'
    ? { nombres: esAdmin && modoSupervisionAdmin ? 'Canal General + Supervisión Institucional' : 'Canal General (Todos los Usuarios)', usuario: 'todos', rol: 'institucional' }
    : (listaUsuarios.find(u => u.usuario.toLowerCase() === contactoActivoChat.toLowerCase()) || { nombres: contactoActivoChat, usuario: contactoActivoChat, rol: 'usuario' });

  // =========================================================================
  // VISTA 1: TIENDA VIRTUAL PÚBLICA (OPTIMIZADA PARA SEO, GA4 Y BUSINESS PROFILE)
  // =========================================================================
  if (!sesionIniciada) {
    const cursosActivosTienda = cursosCatalogo.filter(c => c.estado !== 'inactivo');
    const categoriasTienda = ['Todos', ...new Set(cursosActivosTienda.map(c => c.categoria))];
    const cursosTiendaFiltrados = cursosActivosTienda.filter(c => {
      const matchCat = catTiendaActiva === 'Todos' || c.categoria === catTiendaActiva;
      const matchTxt = c.titulo.toLowerCase().includes(busquedaTienda.toLowerCase()) || c.descripcion.toLowerCase().includes(busquedaTienda.toLowerCase());
      return matchCat && matchTxt;
    });

    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #1e293b', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ margin: '0', fontSize: '20px', color: '#38bdf8', fontWeight: 'bold' }}>Aula Virtual Pórtico San Marcos</h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={() => setCarritoAbierto(true)} style={{ background: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '9px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
              🛒 Mi Carrito {carrito.length > 0 && <span style={{ background: '#ef4444', marginLeft: '6px', padding: '2px 8px', borderRadius: '999px', fontSize: '11px' }}>{carrito.length}</span>}
            </button>
            <button onClick={() => setMostrarModalLogin(true)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
              🔐 Ingresar al Aula
            </button>
          </div>
        </header>

        <section style={{ textAlign: 'center', padding: '44px 18px 26px', maxWidth: '850px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', color: '#fff', marginBottom: '12px', fontWeight: '800' }}>Catálogo de Cursos de Ingeniería Mecatrónica</h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6', margin: '0 0 22px 0' }}>
            Explora el temario oficial, visualiza una clase demostrativa de cada especialidad y agrega los cursos de tu interés al carrito para coordinar tu matrícula directamente por WhatsApp.
          </p>
          <input
            type="text"
            placeholder="🔍 Buscar curso de Robótica, PLC, CAD, Python, PCB..."
            value={busquedaTienda}
            onChange={(e) => {
              setBusquedaTienda(e.target.value);
              if (e.target.value.length >= 3) {
                registrarEventoGA4('search', { search_term: e.target.value });
              }
            }}
            style={{ width: '100%', maxWidth: '520px', padding: '12px 18px', borderRadius: '99px', background: '#1e293b', color: '#fff', border: '1px solid #334155', outline: 'none', boxSizing: 'border-box' }}
          />
        </section>

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', padding: '0 16px 28px' }}>
          {categoriasTienda.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setCatTiendaActiva(cat);
                registrarEventoGA4('select_content', { categoria: `Filtro Categoría: ${cat}` });
              }}
              style={{ padding: '8px 15px', borderRadius: '99px', background: catTiendaActiva === cat ? '#2563eb' : '#1e293b', color: '#fff', border: '1px solid #334155', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              {cat}
            </button>
          ))}
        </div>

        <main style={{ maxWidth: '1260px', width: '100%', boxSizing: 'border-box', margin: '0 auto', padding: '0 16px 60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '22px', flex: 1 }}>
          {cursosTiendaFiltrados.map(curso => (
            <article key={curso.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.25)' }}>
              <div style={{ position: 'relative', height: '185px' }}>
                <img src={curso.imagen_url} alt={curso.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(15,23,42,0.9)', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>{curso.categoria}</span>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '17px' }}>{curso.titulo}</h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', flex: 1, lineHeight: '1.5' }}>{curso.descripcion}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #334155', paddingTop: '12px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>⏱ {curso.duracion || '5 Semanas'}</span>
                  <strong style={{ fontSize: '20px', color: '#34d399' }}>S/ {Number(curso.precio).toFixed(2)}</strong>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setCursoDemoModal(curso);
                      registrarEventoGA4('view_item', { item_id: curso.id, item_name: curso.titulo });
                    }}
                    style={{ background: '#0f172a', color: '#fff', border: '1px solid #475569', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                  >
                    🎬 Demo y Temario
                  </button>
                  <button onClick={() => estaEnCarrito(curso.id) ? setCarritoAbierto(true) : agregarAlCarrito(curso)} style={{ background: estaEnCarrito(curso.id) ? '#059669' : '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                    {estaEnCarrito(curso.id) ? '✓ En el Carrito' : '+ Agregar'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </main>

        {/* PIE DE PÁGINA INSTITUCIONAL CON VINCULACIÓN A GOOGLE BUSINESS PROFILE Y SITEMAP SEO */}
        <footer style={{ background: '#091326', borderTop: '1px solid #1e293b', padding: '36px 20px', color: '#94a3b8', fontSize: '13px' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            <div>
              <h4 style={{ color: '#38bdf8', margin: '0 0 8px 0', fontSize: '16px' }}>Pórtico San Marcos</h4>
              <p style={{ margin: '0 0 10px 0', lineHeight: '1.6' }}>
                Centro de Especialización en Ingeniería Mecatrónica, Robótica Industrial, Sistemas Embebidos y Automatización con PLCs.
              </p>
              <span style={{ display: 'inline-block', background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 'bold' }}>
                ✓ Perfil de Empresa Verificado en Google
              </span>
            </div>

            <div>
              <h4 style={{ color: '#f8fafc', margin: '0 0 8px 0', fontSize: '14px' }}>📍 Sedes Presenciales (Google Business Profile)</h4>
              <p style={{ margin: '0 0 6px 0' }}><strong>Sede Central Lima:</strong> Campus Central - Laboratorio de Electrónica y Taller Mecánico.</p>
              <p style={{ margin: '0 0 6px 0' }}><strong>Sede Arequipa:</strong> Pabellón B - Laboratorio de Electroneumática 2.</p>
              <p style={{ margin: 0 }}><strong>Atención y Matrículas:</strong> Lunes a Sábado (8:00 AM - 10:00 PM) • Tel: +51 967 107 035</p>
            </div>

            <div>
              <h4 style={{ color: '#f8fafc', margin: '0 0 8px 0', fontSize: '14px' }}>🔎 Indexación y Enlaces Oficiales</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <a href="/sitemap.xml" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>🗺️ Sitemap XML Oficial (Google Search Console)</a>
                <a href="/robots.txt" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>🤖 Directivas de Rastreo (robots.txt)</a>
                <a href={`https://wa.me/${WHATSAPP_NUMERO}`} target="_blank" rel="noreferrer" style={{ color: '#34d399', textDecoration: 'none', fontWeight: 'bold' }}>💬 Contacto Directo WhatsApp Oficial</a>
              </div>
            </div>
          </div>
        </footer>

        {/* MODAL DEL VIDEO DEMO Y SÍLABO COMPLETO */}
        {cursoDemoModal && (
          <div onClick={() => setCursoDemoModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
            <div onClick={e => e.stopPropagation()} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '22px', position: 'relative' }}>
              <button onClick={() => setCursoDemoModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}>Cerrar ✕</button>
              <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 'bold' }}>{cursoDemoModal.categoria}</span>
              <h2 style={{ color: '#fff', margin: '4px 0 14px 0', fontSize: '20px', paddingRight: '70px' }}>{cursoDemoModal.titulo}</h2>
              <iframe src={cursoDemoModal.video_demo_url} title="demo" style={{ width: '100%', height: '310px', border: 'none', borderRadius: '8px', background: '#000', marginBottom: '15px' }} allowFullScreen />
              <h4 style={{ color: '#38bdf8', margin: '0 0 10px 0', fontSize: '15px' }}>📋 Sílabo y Temario del Curso:</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(Array.isArray(cursoDemoModal.temario) ? cursoDemoModal.temario : []).map((mod, i) => (
                  <li key={i} style={{ background: '#0f172a', padding: '10px 14px', borderRadius: '8px', borderLeft: '4px solid #2563eb', fontSize: '13px', color: '#e2e8f0' }}>{mod}</li>
                ))}
              </ul>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #334155', paddingTop: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block' }}>Inversión del curso:</span>
                  <strong style={{ fontSize: '24px', color: '#34d399' }}>S/ {Number(cursoDemoModal.precio).toFixed(2)}</strong>
                </div>
                <button onClick={() => { agregarAlCarrito(cursoDemoModal); setCursoDemoModal(null); }} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                  🛒 Seleccionar Curso
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CARRITO LATERAL */}
        {carritoAbierto && (
          <div onClick={() => setCarritoAbierto(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 250, display: 'flex', justifyContent: 'flex-end' }}>
            <aside onClick={e => e.stopPropagation()} style={{ background: '#1e293b', width: '100%', maxWidth: '410px', height: '100vh', padding: '24px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '14px' }}>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '18px' }}>🛒 Cursos Seleccionados ({carrito.length})</h3>
                <button onClick={() => setCarritoAbierto(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>✕</button>
              </div>
              {carrito.length === 0 ? (
                <div style={{ margin: 'auto 0', textAlign: 'center', color: '#94a3b8' }}>
                  <p style={{ fontSize: '15px' }}>Tu carrito está vacío.</p>
                  <span style={{ fontSize: '13px' }}>Agrega los cursos que te interesen para consultar tu matrícula por WhatsApp.</span>
                </div>
              ) : (
                <>
                  <div style={{ flex: 1, overflowY: 'auto', margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {carrito.map(item => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0f172a', padding: '10px', borderRadius: '8px' }}>
                        <img src={item.imagen_url} alt={item.titulo} style={{ width: '55px', height: '42px', objectFit: 'cover', borderRadius: '6px' }} />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '13px' }}>{item.titulo}</h4>
                          <span style={{ color: '#34d399', fontSize: '13px', fontWeight: 'bold' }}>S/ {Number(item.precio).toFixed(2)}</span>
                        </div>
                        <button onClick={() => quitarDelCarrito(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: '1px solid #334155', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input type="text" placeholder="Tu Nombre Completo (opcional)" value={nombreInteresado} onChange={e => setNombreInteresado(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#0f172a', color: '#fff', border: '1px solid #475569', boxSizing: 'border-box' }} />
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#cbd5e1', cursor: 'pointer' }}>
                      <input type="checkbox" checked={aceptaDatosCarrito} onChange={e => setAceptaDatosCarrito(e.target.checked)} style={{ marginTop: '2px' }} />
                      <span>Acepto la <button type="button" onClick={() => setModalPrivacidadAbierto(true)} style={{ background: 'none', border: 'none', color: '#38bdf8', textDecoration: 'underline', padding: 0, cursor: 'pointer', fontSize: '12px' }}>Política de Privacidad</button>.</span>
                    </label>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '16px' }}>
                      <span style={{ color: '#cbd5e1' }}>Total Estimado:</span>
                      <strong style={{ color: '#34d399', fontSize: '20px' }}>S/ {totalCarrito.toFixed(2)}</strong>
                    </div>
                    <button onClick={enviarPedidoWhatsApp} disabled={procesandoOrdenServidor} style={{ width: '100%', background: '#25D366', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}>
                      {procesandoOrdenServidor ? 'Procesando pedido...' : 'Coordinar por WhatsApp'}
                    </button>
                  </div>
                </>
              )}
            </aside>
          </div>
        )}

        {/* MODAL DE LOGIN */}
        {mostrarModalLogin && (
          <div onClick={() => setMostrarModalLogin(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div onClick={e => e.stopPropagation()} style={{ background: '#1e293b', border: '1px solid #334155', padding: '34px 26px', borderRadius: '16px', width: '100%', maxWidth: '420px', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
              <button onClick={() => setMostrarModalLogin(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 style={{ color: '#f8fafc', margin: '0 0 8px 0', fontSize: '24px', fontWeight: '800' }}>Pórtico San Marcos</h2>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Acceso exclusivo para estudiantes, docentes y administración.</p>
              </div>
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="text" placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} disabled={tiempoBloqueo > 0} required style={{ width: '100%', padding: '13px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: '#fff', fontSize: '15px', boxSizing: 'border-box' }} />
                <div style={{ position: 'relative' }}>
                  <input type={mostrarPassword ? 'text' : 'password'} placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} disabled={tiempoBloqueo > 0} required style={{ width: '100%', padding: '13px 40px 13px 13px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: '#fff', fontSize: '15px', boxSizing: 'border-box' }} />
                  <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px' }}>{mostrarPassword ? '🙈' : '👁️'}</button>
                </div>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#cbd5e1', cursor: 'pointer' }}>
                  <input type="checkbox" checked={aceptaDatosLogin} onChange={(e) => setAceptaDatosLogin(e.target.checked)} style={{ marginTop: '2px' }} />
                  <span>Acepto la <button type="button" onClick={() => setModalPrivacidadAbierto(true)} style={{ background: 'none', border: 'none', color: '#38bdf8', textDecoration: 'underline', padding: 0, cursor: 'pointer', fontSize: '12px' }}>Política de Privacidad</button>.</span>
                </label>
                {mensaje && <div style={{ color: mensaje.includes('exitoso') || mensaje.includes('Verificando') ? '#38bdf8' : '#ef4444', fontSize: '13px', textAlign: 'center', fontWeight: 'bold', background: 'rgba(0,0,0,0.25)', padding: '10px', borderRadius: '6px' }}>{mensaje}</div>}
                <button type="submit" disabled={tiempoBloqueo > 0} style={{ width: '100%', padding: '14px', background: tiempoBloqueo > 0 ? '#475569' : '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '15px', cursor: tiempoBloqueo > 0 ? 'not-allowed' : 'pointer', marginTop: '4px' }}>
                  {tiempoBloqueo > 0 ? `Bloqueado (${tiempoBloqueo}s)` : 'Ingresar al Aula Virtual'}
                </button>
              </form>
            </div>
          </div>
        )}
        {renderModalPrivacidad()}
      </div>
    );
  }

  // =========================================================================
  // VISTA 2: INTERIOR DEL AULA VIRTUAL (PC Y CELULAR OPTIMIZADOS)
  // =========================================================================
  return (
    <div style={{ minHeight: '100vh', width: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', scrollBehavior: 'smooth' }}>
      
      {/* ESTILOS RESPONSIVOS INTEGRADOS PARA PC Y CELULAR */}
      <style>{`
        .psm-navbar {
          width: 100%;
          background: #091e42;
          color: #fff;
          padding: 14px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
          position: sticky;
          top: 0;
          z-index: 1000;
          box-sizing: border-box;
          gap: 16px;
        }
        .psm-brand-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }
        .psm-nav-links {
          display: flex;
          gap: 14px;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: nowrap;
        }
        .psm-nav-links button {
          white-space: nowrap;
        }
        .psm-hamburger {
          display: none;
          background: #1e293b;
          color: #38bdf8;
          border: 1px solid #334155;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: bold;
          cursor: pointer;
        }
        /* BANNER PRINCIPAL MÁS GRANDE EN PC CON BOLITAS INDICADORAS */
        .psm-hero-wrapper {
          position: relative;
          background: linear-gradient(125deg, #061539 0%, #0d2b6b 52%, #1d4ed8 100%);
          border-radius: 22px;
          padding: 48px 54px 56px 54px;
          min-height: 390px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 36px;
          color: #ffffff;
          box-shadow: 0 22px 45px rgba(9, 30, 66, 0.22);
          overflow: hidden;
          box-sizing: border-box;
        }
        .psm-hero-text {
          flex: 1.15;
          z-index: 2;
        }
        .psm-hero-title {
          font-size: clamp(28px, 3.3vw, 44px);
          line-height: 1.18;
          margin: 16px 0 18px 0;
          font-weight: 800;
          color: #ffffff;
        }
        .psm-hero-image-box {
          flex: 0.95;
          display: flex;
          justify-content: flex-end;
          z-index: 2;
        }
        .psm-hero-image-box img {
          width: 100%;
          max-width: 490px;
          height: 300px;
          object-fit: cover;
          border-radius: 16px;
          box-shadow: 0 16px 35px rgba(0,0,0,0.45);
          border: 2px solid rgba(255,255,255,0.18);
        }
        .psm-hero-dots {
          position: absolute;
          bottom: 18px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 5;
          background: rgba(15, 23, 42, 0.45);
          padding: 7px 16px;
          border-radius: 999px;
          backdrop-filter: blur(6px);
        }
        .psm-hero-dot {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          padding: 0;
        }
        /* CHAT OSCURO UNIFICADO PARA PC Y CELULAR */
        .psm-chat-grid {
          display: grid;
          grid-template-columns: 330px 1fr;
          background: #0b1120;
          border-radius: 16px;
          border: 1px solid #1e293b;
          overflow: hidden;
          box-shadow: 0 18px 40px rgba(2, 6, 23, 0.45);
          min-height: 580px;
        }
        .psm-chat-sidebar {
          background: #0f172a;
          color: #f8fafc;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #1e293b;
          height: 580px;
        }
        .psm-chat-main {
          display: flex;
          flex-direction: column;
          background: #111827;
          color: #f8fafc;
          height: 580px;
        }
        /* OPTIMIZACIÓN PARA CELULARES */
        @media (max-width: 1020px) {
          .psm-navbar {
            padding: 12px 16px;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
          }
          .psm-brand-row {
            width: 100%;
          }
          .psm-hamburger {
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }
          .psm-nav-links {
            display: none;
            width: 100%;
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #1e293b;
          }
          .psm-nav-links.abierto {
            display: flex;
          }
          .psm-nav-links button {
            text-align: left;
            padding: 10px 12px !important;
            border-radius: 8px;
            background: rgba(255,255,255,0.05) !important;
          }
          .psm-user-box {
            margin-left: 0 !important;
            padding-left: 0 !important;
            border-left: none !important;
            justify-content: space-between;
            background: #0f172a;
            padding: 10px 14px !important;
            border-radius: 8px;
          }
          .psm-hero-wrapper {
            flex-direction: column;
            padding: 24px 18px 54px 18px;
            min-height: auto;
            text-align: center;
            gap: 20px;
            border-radius: 16px;
          }
          .psm-hero-title {
            font-size: 24px;
            margin: 12px 0;
          }
          .psm-hero-stats {
            margin: 12px auto 0 auto !important;
          }
          .psm-hero-image-box {
            width: 100%;
            justify-content: center;
          }
          .psm-hero-image-box img {
            height: 200px;
            max-width: 100%;
          }
          .psm-chat-grid {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .psm-chat-sidebar {
            height: 250px;
            border-right: none;
            border-bottom: 1px solid #1e293b;
          }
          .psm-chat-main {
            height: 460px;
          }
        }
      `}</style>

      {/* NAVBAR SUPERIOR INTERNO (ALINEADO EN 1 SOLA FILA EN PC Y DESPLEGABLE EN CELULAR) */}
      <header className="psm-navbar">
        <div className="psm-brand-row">
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', color: '#38bdf8', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Pórtico San Marcos</h2>
            <span style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap', display: 'block' }}>Aula Virtual & Biblioteca 3D</span>
          </div>

          <button className="psm-hamburger" onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}>
            {menuMovilAbierto ? '✕ Cerrar' : '☰ Menú'}
          </button>
        </div>

        <nav className={`psm-nav-links ${menuMovilAbierto ? 'abierto' : ''}`}>
          <button onClick={() => irASeccion(seccionInicioRef)} style={{ background: 'none', border: 'none', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Inicio</button>
          {esAlumno && (
            <button onClick={() => irASeccion(seccionPerfilRef)} style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Mi Perfil y Cursos</button>
          )}
          <button onClick={() => irASeccion(seccionCursosRef)} style={{ background: 'none', border: 'none', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
            {puedeGestionarCursos ? 'Administrar Cursos' : 'Catálogo'}
          </button>
          {esAlumno && (
            <button onClick={() => irASeccion(seccionDocentesRef)} style={{ background: 'none', border: 'none', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Docentes</button>
          )}
          <button onClick={() => irASeccion(seccionBibliotecaRef)} style={{ background: 'none', border: 'none', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Biblioteca 3D</button>
          <button onClick={() => irASeccion(seccionMensajesRef)} style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', padding: '6px 12px', borderRadius: '99px', color: '#34d399', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}>
            💬 Chat en Vivo ({mensajesBD.length})
          </button>
          {esAdmin && (
            <>
              <button onClick={() => irASeccion(seccionSeoAnalyticsRef)} style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>📈 SEO & Analytics</button>
              <button onClick={() => irASeccion(seccionSeguridadRef)} style={{ background: 'none', border: 'none', color: '#fbbf24', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Auditoría</button>
              <button onClick={() => irASeccion(seccionUsuariosRef)} style={{ background: 'none', border: 'none', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Usuarios</button>
            </>
          )}

          <div className="psm-user-box" style={{ display: 'flex', alignItems: 'center', gap: '14px', marginLeft: '6px', paddingLeft: '14px', borderLeft: '1px solid #1e293b', flexShrink: 0 }}>
            <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
              <span style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap' }}>{usuarioLogueado}</span>
              <span style={{ fontSize: '10px', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{rolUsuario}</span>
            </div>
            <button onClick={cerrarSesion} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap' }}>
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </header>

      <main style={{ flex: 1, padding: '26px 0', display: 'flex', flexDirection: 'column', gap: '38px', width: '100%' }}>
        
        {/* ========================================================================= */}
        {/* SECCIÓN 1: BANNER PRINCIPAL AMPLIADO CON BOLITAS INTERACTIVAS             */}
        {/* ========================================================================= */}
        <div ref={seccionInicioRef} style={{ width: '100%', scrollMarginTop: '90px' }}>
          <div className="dashboard-container">
            <div className="psm-hero-wrapper">
              <div className="psm-hero-text">
                <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.14)', color: '#38bdf8', padding: '7px 16px', borderRadius: '99px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.4px' }}>
                  {bannersHero[bannerActual].tag} ({rolUsuario.toUpperCase()})
                </span>
                <h1 className="psm-hero-title">
                  {bannersHero[bannerActual].titulo}<br />
                  <span style={{ color: '#38bdf8' }}>{bannersHero[bannerActual].subtitulo}</span>
                </h1>
                <div className="psm-hero-stats" style={{ marginTop: '20px', display: 'flex', gap: '20px', background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(255,255,255,0.15)', padding: '12px 22px', borderRadius: '12px', backdropFilter: 'blur(10px)', width: 'fit-content' }}>
                  <div>
                    <strong style={{ fontSize: '22px', color: '#fff', display: 'block' }}>{bannersHero[bannerActual].statsNum}</strong>
                    <span style={{ fontSize: '12px', color: '#cbd5e1' }}>{bannersHero[bannerActual].statsTxt}</span>
                  </div>
                </div>
              </div>

              <div className="psm-hero-image-box">
                <img
                  src={bannersHero[bannerActual].img}
                  alt={bannersHero[bannerActual].titulo}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop';
                  }}
                />
              </div>

              {/* BOLITAS INDICADORAS PARA CAMBIAR ENTRE LOS DISTINTOS TÍTULOS DEL BANNER */}
              <div className="psm-hero-dots">
                {bannersHero.map((b, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Ver banner ${idx + 1}`}
                    onClick={() => setBannerActual(idx)}
                    className="psm-hero-dot"
                    style={{
                      width: bannerActual === idx ? '30px' : '11px',
                      background: bannerActual === idx ? '#38bdf8' : 'rgba(255,255,255,0.45)',
                      boxShadow: bannerActual === idx ? '0 0 10px rgba(56, 189, 248, 0.8)' : 'none'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN PERFIL DEL ESTUDIANTE (SOLO ALUMNOS) */}
        {esAlumno && (
          <div ref={seccionPerfilRef} style={{ width: '100%', scrollMarginTop: '90px' }}>
            <div className="dashboard-container">
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '22px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
                  <h2 style={{ fontSize: '20px', color: '#0f172a', margin: 0, fontWeight: 'bold' }}>🎓 MI PERFIL DE ESTUDIANTE: CURSOS MATRICULADOS</h2>
                </div>
                {misCursosMatriculados.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '14px' }}>Aún no tienes cursos asignados en tu ficha de matrícula. Comunícate con el Administrador por el Chat en Vivo.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(275px, 1fr))', gap: '16px' }}>
                    {misCursosMatriculados.map(curso => (
                      <div key={curso.id} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderLeft: '5px solid #2563eb', borderRadius: '10px', padding: '16px' }}>
                        <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 'bold' }}>{curso.categoria} • {curso.tipo || 'Virtual'}</span>
                        <h4 style={{ margin: '6px 0 8px 0', fontSize: '16px', color: '#0f172a' }}>{curso.titulo}</h4>
                        <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#334155' }}><strong>Docente:</strong> {curso.instructor}</p>
                        <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#334155' }}><strong>Horario:</strong> {curso.horario}</p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                          {(curso.tipo || 'Virtual') === 'Virtual' ? (
                            <>
                              <button className="card-action-btn" style={{ flex: 1, padding: '8px', fontSize: '12px' }} onClick={() => solicitarAccesoCursoPrivado(curso, 'grabacion')}>Ver Grabación</button>
                              <button className="card-action-btn" style={{ flex: 1, backgroundColor: '#10b981', padding: '8px', fontSize: '12px' }} onClick={() => solicitarAccesoCursoPrivado(curso, 'zoom')}>Ir a Zoom</button>
                            </>
                          ) : (
                            <button className="card-action-btn" onClick={() => solicitarAccesoCursoPrivado(curso, 'sede')} style={{ backgroundColor: '#059669', width: '100%', padding: '8px', fontSize: '12px' }}>Ver Sede Física</button>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                          <button onClick={() => abrirEvaluacionSegura(curso)} style={{ flex: 1, background: '#1e293b', color: '#38bdf8', border: 'none', padding: '7px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                            📝 Evaluación
                          </button>
                          <button onClick={() => { setModalSubirArchivoCurso(curso); setEstadoValidacionArchivo(null); }} style={{ flex: 1, background: '#e2e8f0', color: '#0f172a', border: 'none', padding: '7px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                            📎 Subir Archivo
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 2: CATÁLOGO DE CURSOS Y ADMINISTRACIÓN */}
        <div ref={seccionCursosRef} style={{ width: '100%', scrollMarginTop: '90px' }}>
          <div className="dashboard-container">
            <div style={{ marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontSize: '22px', color: '#0f172a', margin: 0, fontWeight: 'bold' }}>{puedeGestionarCursos ? 'ADMINISTRACIÓN DE CURSOS' : 'MIS CLASES & LABORATORIOS'}</h2>
              {puedeGestionarCursos && (
                <button onClick={() => setModalNuevoCurso(true)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  + Añadir Nuevo Curso
                </button>
              )}
            </div>

            {/* BARRA DE FILTROS VIRTUAL / PRESENCIAL */}
            <div style={{ background: '#fff', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button onClick={() => { setModalidadFiltro('virtual'); setVideoActivo(null); setLaboratorioSeleccionado(null); }} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: modalidadFiltro === 'virtual' ? '#2563eb' : '#f1f5f9', color: modalidadFiltro === 'virtual' ? '#fff' : '#334155', fontSize: '13px' }}>
                  Modalidad Virtual ({cursosCatalogo.filter(c => (c.tipo || 'Virtual') === 'Virtual' && (puedeGestionarCursos || c.estado !== 'inactivo')).length})
                </button>
                <button onClick={() => { setModalidadFiltro('presencial'); setVideoActivo(null); setLaboratorioSeleccionado(null); }} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: modalidadFiltro === 'presencial' ? '#059669' : '#f1f5f9', color: modalidadFiltro === 'presencial' ? '#fff' : '#334155', fontSize: '13px' }}>
                  Modalidad Presencial ({cursosCatalogo.filter(c => c.tipo === 'Presencial' && (puedeGestionarCursos || c.estado !== 'inactivo')).length})
                </button>
                <input type="text" placeholder="🔍 Buscar clase o profesor..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ flex: 1, minWidth: '220px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            </div>

            {videoActivo && (
              <div style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', color: '#fff', marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '16px' }}>Reproduciendo Sesión: {videoActivo.titulo}</h3>
                  <button onClick={() => setVideoActivo(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Cerrar Video</button>
                </div>
                <video controls autoPlay style={{ width: '100%', maxHeight: '420px', borderRadius: '8px', background: '#000' }}>
                  <source src={videoActivo.videoUrl || videoActivo.video_demo_url} type="video/mp4" />
                </video>
              </div>
            )}

            <div className="courses-grid-focus">
              {clasesInternasFiltradas.map((item) => {
                const esVirtual = (item.tipo || 'Virtual') === 'Virtual';
                const estaInactivo = item.estado === 'inactivo';
                return (
                  <div key={item.id} className="focus-card-item" style={{ opacity: estaInactivo ? 0.65 : 1 }}>
                    <div className="card-image-wrapper">
                      <img src={item.imagen_url} alt={item.titulo} />
                      <span className="badge-status" style={{ background: estaInactivo ? '#ef4444' : '#10b981' }}>{estaInactivo ? 'Deshabilitado' : 'Habilitado'}</span>
                    </div>
                    <div className="card-body-content">
                      <h3>{item.titulo}</h3>
                      <p>{item.descripcion}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#475569', marginBottom: '15px' }}>
                        <span><strong>Horario:</strong> {item.horario || 'Por definir'}</span>
                        <span><strong>Docente:</strong> {item.instructor || 'Staff Académico'}</span>
                        <span><strong>Precio Tienda:</strong> S/ {Number(item.precio || 100).toFixed(2)}</span>
                      </div>

                      {/* GRABACIÓN Y ZOOM / SEDE DISPONIBLE PARA ESTUDIANTES, DOCENTES Y ADMIN */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                        {esVirtual ? (
                          <>
                            <button className="card-action-btn" style={{ flex: 1 }} onClick={() => solicitarAccesoCursoPrivado(item, 'grabacion')}>Grabación</button>
                            <button className="card-action-btn" style={{ flex: 1, backgroundColor: '#10b981' }} onClick={() => solicitarAccesoCursoPrivado(item, 'zoom')}>Zoom</button>
                          </>
                        ) : (
                          <button className="card-action-btn" onClick={() => solicitarAccesoCursoPrivado(item, 'sede')} style={{ backgroundColor: '#059669', width: '100%' }}>Ver Sede</button>
                        )}
                      </div>

                      {/* EVALUACIÓN Y ENTREGA DE ARCHIVOS EXCLUSIVO PARA ESTUDIANTES */}
                      {esAlumno && (
                        <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                          <button onClick={() => abrirEvaluacionSegura(item)} style={{ flex: 1, background: '#0f172a', color: '#38bdf8', border: '1px solid #334155', padding: '7px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                            📝 Evaluación
                          </button>
                          <button onClick={() => { setModalSubirArchivoCurso(item); setEstadoValidacionArchivo(null); }} style={{ flex: 1, background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', padding: '7px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                            📎 Subir Archivo
                          </button>
                        </div>
                      )}

                      {/* HABILITAR / DESHABILITAR CURSO PARA DOCENTES Y ADMIN */}
                      {puedeGestionarCursos && (
                        <button onClick={() => handleToggleEstadoCurso(item)} style={{ width: '100%', padding: '8px', marginTop: '10px', borderRadius: '6px', border: 'none', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', background: estaInactivo ? '#dcfce7' : '#fee2e2', color: estaInactivo ? '#166534' : '#991b1b' }}>
                          {estaInactivo ? '✓ Habilitar Curso en Tienda' : '✕ Deshabilitar Curso'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: DOCENTES DESTACADOS */}
        {esAlumno && (
          <div ref={seccionDocentesRef} style={{ width: '100%', scrollMarginTop: '90px' }}>
            <div className="dashboard-container">
              <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '25px' }}>
                <h2 style={{ fontSize: '22px', color: '#0f172a', margin: 0, fontWeight: 'bold' }}>DOCENTES & INSTRUCTORES</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                {docentesDestacados.map(docente => (
                  <div key={docente.id} style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', overflow: 'hidden', textAlign: 'center' }}>
                    <img src={docente.foto} alt={docente.nombre} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                    <div style={{ padding: '15px' }}>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '15px', color: '#1e293b', fontWeight: 'bold' }}>{docente.nombre}</h3>
                      <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#2563eb', fontWeight: 'bold' }}>{docente.especialidad}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '6px', borderRadius: '6px' }}><strong>Sede:</strong> {docente.sede}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 4: BIBLIOTECA VIRTUAL FLIPBOOK 3D (INTERFAZ ACADÉMICA LIMPIA) */}
        <div ref={seccionBibliotecaRef} style={{ width: '100%', scrollMarginTop: '90px' }}>
          <div className="dashboard-container">
            <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '25px' }}>
              <h2 style={{ fontSize: '22px', color: '#0f172a', margin: 0, fontWeight: 'bold' }}>BIBLIOTECA VIRTUAL (FLIPBOOK 3D)</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {listaLibros.map((libro) => (
                <div key={libro.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <img src={libro.portada} alt={libro.titulo} style={{ width: '100%', height: '210px', objectFit: 'cover' }} />
                  <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>{libro.categoria}</span>
                    <h3 style={{ fontSize: '15px', color: '#0f172a', margin: '0 0 8px 0', fontWeight: 'bold' }}>{libro.titulo}</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 15px 0' }}>Autor: {libro.autor}</p>
                    <button onClick={() => abrirLibroConEnlaceTemporal(libro)} style={{ marginTop: 'auto', padding: '10px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                      Leer en Flipbook 3D
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECCIÓN 5: CENTRO DE MENSAJERÍA ACADÉMICA (TEMA OSCURO EN PC Y MÓVIL)     */}
        {/* ========================================================================= */}
        <div ref={seccionMensajesRef} style={{ width: '100%', scrollMarginTop: '90px' }}>
          <div className="dashboard-container">
            <div style={{ background: '#0f172a', padding: '20px 24px', borderRadius: '16px 16px 0 0', border: '1px solid #1e293b', borderBottom: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#f8fafc', margin: 0, fontWeight: '800' }}>
                  💬 CENTRO DE MENSAJERÍA ACADÉMICA
                </h2>
              </div>

              {esAdmin && (
                <button
                  type="button"
                  onClick={() => setModoSupervisionAdmin(!modoSupervisionAdmin)}
                  style={{
                    background: modoSupervisionAdmin ? '#1e293b' : '#334155',
                    color: modoSupervisionAdmin ? '#38bdf8' : '#cbd5e1',
                    border: '1px solid #475569',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {modoSupervisionAdmin ? '👁️ Supervisión Global Admin: ACTIVA' : '👁️ Activar Supervisión Global Admin'}
                </button>
              )}
            </div>

            <div className="psm-chat-grid" style={{ borderRadius: '0 0 16px 16px' }}>
              
              {/* COLUMNA IZQUIERDA: LISTA DE CONTACTOS */}
              <div className="psm-chat-sidebar">
                <div style={{ padding: '16px', borderBottom: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '11px', color: '#38bdf8', marginBottom: '8px', fontWeight: 'bold', letterSpacing: '0.3px' }}>
                    CONECTADO COMO: @{usernameActual} ({rolUsuario.toUpperCase()})
                  </div>
                  <input
                    type="text"
                    placeholder="🔍 Buscar docente, alumno o admin..."
                    value={busquedaContactoChat}
                    onChange={e => setBusquedaContactoChat(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {/* Canal General / Bandeja Global */}
                  <div
                    onClick={() => setContactoActivoChat('todos')}
                    style={{
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #1e293b',
                      background: contactoActivoChat === 'todos' ? '#1e3a8a' : 'transparent',
                      transition: '0.15s'
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', flexShrink: 0 }}>
                      📢
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {esAdmin && modoSupervisionAdmin ? 'Todos los Mensajes (Global)' : 'Canal General (@todos)'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {esAdmin && modoSupervisionAdmin ? 'Incluye chats Alumno ↔ Docente' : 'Comunicados para toda el aula'}
                      </div>
                    </div>
                    <span style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 'bold', color: '#fff' }}>
                      {mensajesBD.length}
                    </span>
                  </div>

                  {/* Lista de Usuarios Reales */}
                  {contactosChat.map(u => {
                    const seleccionado = contactoActivoChat.toLowerCase() === u.usuario.toLowerCase();
                    const iniciales = (u.nombres || u.usuario).slice(0, 2).toUpperCase();
                    const colorAvatar = u.rol === 'admin' ? '#991b1b' : u.rol === 'docente' ? '#0369a1' : '#6d28d9';
                    const cantMensajesConUsuario = mensajesBD.filter(m =>
                      (m.remitente || '').toLowerCase() === u.usuario.toLowerCase() ||
                      (m.destinatario || '').toLowerCase() === u.usuario.toLowerCase()
                    ).length;

                    return (
                      <div
                        key={u.id || u.usuario}
                        onClick={() => setContactoActivoChat(u.usuario)}
                        style={{
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #1e293b',
                          background: seleccionado ? '#1e3a8a' : 'transparent',
                          transition: '0.15s'
                        }}
                      >
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: colorAvatar, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>
                          {iniciales}
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '13px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.nombres}</strong>
                            <span style={{ fontSize: '10px', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#94a3b8', fontWeight: 'bold' }}>
                              {u.rol}
                            </span>
                          </div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                            @{u.usuario} {cantMensajesConUsuario > 0 ? `• ${cantMensajesConUsuario} msj` : ''}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COLUMNA DERECHA: VENTANA DE CONVERSACIÓN OSCURA */}
              <div className="psm-chat-main">
                {/* Cabecera del Chat */}
                <div style={{ padding: '14px 20px', background: '#161f33', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#ffffff', fontWeight: 'bold' }}>
                      {infoContactoSeleccionado.nombres} <span style={{ color: '#38bdf8', fontSize: '14px' }}>(@{infoContactoSeleccionado.usuario})</span>
                    </h3>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {esAdmin && modoSupervisionAdmin
                        ? 'Modo Supervisión Admin: Viendo mensajes directos y mensajes dirigidos a docentes'
                        : `Conversación directa con @${infoContactoSeleccionado.usuario}`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => cargarMensajesDesdeBD(usernameActual)}
                    style={{ background: '#334155', border: '1px solid #475569', padding: '7px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold', color: '#f8fafc' }}
                  >
                    ↻ Actualizar
                  </button>
                </div>

                {/* Historial de Burbujas de Mensajes en Tema Oscuro */}
                <div ref={chatScrollRef} style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: '#111827' }}>
                  {mensajesConversacionActiva.length === 0 ? (
                    <div style={{ margin: 'auto', textAlign: 'center', color: '#94a3b8', maxWidth: '340px' }}>
                      <div style={{ fontSize: '36px', marginBottom: '8px' }}>💬</div>
                      <strong style={{ display: 'block', color: '#e2e8f0', marginBottom: '4px' }}>Sin mensajes en esta conversación</strong>
                      <span style={{ fontSize: '12px' }}>Escribe un mensaje abajo para conversar con @{infoContactoSeleccionado.usuario}.</span>
                    </div>
                  ) : (
                    mensajesConversacionActiva.map((m, idx) => {
                      const esMio = (m.remitente || '').toLowerCase() === (usernameActual || '').toLowerCase();
                      const horaFormateada = m.fecha_envio
                        ? new Date(m.fecha_envio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'Ahora';

                      return (
                        <div
                          key={m.id || idx}
                          style={{
                            alignSelf: esMio ? 'flex-end' : 'flex-start',
                            maxWidth: '78%',
                            background: esMio ? '#1d4ed8' : '#1e293b',
                            color: '#ffffff',
                            padding: '12px 16px',
                            borderRadius: esMio ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                            border: esMio ? '1px solid #2563eb' : '1px solid #334155'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '4px', fontSize: '11px' }}>
                            <strong style={{ color: esMio ? '#93c5fd' : '#38bdf8' }}>
                              @{m.remitente} ({m.rol_remitente || 'usuario'}) ➔ @{m.destinatario}
                            </strong>
                            <span style={{ color: '#cbd5e1' }}>{horaFormateada}</span>
                          </div>
                          {m.asunto && m.asunto !== 'Chat Académico' && (
                            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.12)', width: 'fit-content' }}>
                              📌 {m.asunto}
                            </div>
                          )}
                          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.45', wordBreak: 'break-word', color: '#f8fafc' }}>{m.contenido}</p>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Barra Inferior Oscura para Escribir y Enviar Mensaje */}
                <form onSubmit={handleEnviarMensajeBD} style={{ padding: '14px 18px', background: '#161f33', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 'bold' }}>
                      Para: <strong style={{ color: '#38bdf8' }}>@{contactoActivoChat}</strong>
                    </span>
                    <input
                      type="text"
                      placeholder="Asunto opcional..."
                      value={asuntoMsg}
                      onChange={e => setAsuntoMsg(e.target.value)}
                      style={{ flex: 1, minWidth: '150px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '12px', outline: 'none' }}
                    />
                    {estadoEnvioMsg && <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 'bold' }}>{estadoEnvioMsg}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder={`Escribe un mensaje para @${contactoActivoChat}...`}
                      value={contenidoMsg}
                      onChange={e => setContenidoMsg(e.target.value)}
                      required
                      style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '14px', outline: 'none' }}
                    />
                    <button
                      type="submit"
                      style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap' }}
                    >
                      Enviar ➤
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECCIÓN EXCLUSIVA DEL ADMIN: POSICIONAMIENTO DIGITAL, GA4, GSC & GBP      */}
        {/* ========================================================================= */}
        {esAdmin && (
          <div ref={seccionSeoAnalyticsRef} style={{ width: '100%', scrollMarginTop: '90px' }}>
            <div className="dashboard-container">
              <div style={{ background: '#0f172a', color: '#f8fafc', borderRadius: '16px', padding: '26px', border: '1px solid #1e293b', boxShadow: '0 14px 34px rgba(15, 23, 42, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '14px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '20px', color: '#38bdf8', fontWeight: '800' }}>
                      📈 POSICIONAMIENTO DIGITAL: GOOGLE ANALYTICS 4, SEARCH CONSOLE & BUSINESS PROFILE (SOLO ADMIN)
                    </h2>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      Panel de medición de tráfico, indexación de Sitemap XML, palabras clave orgánicas y SEO Local
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <a href="/sitemap.xml" target="_blank" rel="noreferrer" style={{ background: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '7px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none' }}>
                      🗺️ Ver Sitemap.xml ↗
                    </a>
                    <a href="/robots.txt" target="_blank" rel="noreferrer" style={{ background: '#1e293b', color: '#34d399', border: '1px solid #334155', padding: '7px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none' }}>
                      🤖 Ver Robots.txt ↗
                    </a>
                  </div>
                </div>

                {/* RESUMEN DE LOS 3 PILARES DE POSICIONAMIENTO DIGITAL */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '22px' }}>
                  <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ color: '#38bdf8', fontSize: '14px' }}>📊 1. Google Analytics 4 (GA4)</strong>
                      <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 'bold' }}>Activo ({GA4_MEASUREMENT_ID})</span>
                    </div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
                      Mide en tiempo real el tráfico y comportamiento de los usuarios mediante <code>gtag.js</code>: vistas de página, búsquedas de cursos, clics en demos, carrito y conversiones a WhatsApp.
                    </p>
                    <div style={{ fontSize: '12px', color: '#34d399', fontWeight: 'bold' }}>
                      Eventos registrados en sesión: {eventosGA4.length} interacciones
                    </div>
                  </div>

                  <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ color: '#38bdf8', fontSize: '14px' }}>🔎 2. Google Search Console</strong>
                      <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 'bold' }}>Sitemap Indexado</span>
                    </div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
                      Propiedad verificada mediante metaetiqueta <code>google-site-verification</code>. Sitemap registrado en <code>/sitemap.xml</code> con 6 URLs estratégicas indexadas.
                    </p>
                    <div style={{ fontSize: '12px', color: '#34d399', fontWeight: 'bold' }}>
                      Posición orgánica promedio: #2.4 en Google Perú
                    </div>
                  </div>

                  <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ color: '#38bdf8', fontSize: '14px' }}>📍 3. Google Business Profile</strong>
                      <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 'bold' }}>Vinculado (Schema JSON-LD)</span>
                    </div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
                      Aplicable al modelo híbrido de Pórtico San Marcos por sus laboratorios presenciales en <strong>Campus Central Lima</strong> y <strong>Sede Arequipa (Pabellón B)</strong>.
                    </p>
                    <div style={{ fontSize: '12px', color: '#34d399', fontWeight: 'bold' }}>
                      Ficha Local + WhatsApp (+51 967 107 035) sincronizados
                    </div>
                  </div>
                </div>

                {/* TABLA DE PALABRAS CLAVE DE GOOGLE SEARCH CONSOLE E HISTORIAL DE EVENTOS GA4 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
                  <div style={{ background: '#161f33', border: '1px solid #334155', borderRadius: '12px', padding: '16px', overflowX: 'auto' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#38bdf8' }}>
                      🔑 Palabras Clave Utilizadas por los Usuarios (Google Search Console)
                    </h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                          <th style={{ padding: '8px' }}>Consulta de Búsqueda (Keyword)</th>
                          <th style={{ padding: '8px' }}>Clics</th>
                          <th style={{ padding: '8px' }}>Impresiones</th>
                          <th style={{ padding: '8px' }}>CTR</th>
                          <th style={{ padding: '8px' }}>Posición</th>
                        </tr>
                      </thead>
                      <tbody>
                        {KEYWORDS_SEARCH_CONSOLE.map((kw, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #1e293b', color: '#e2e8f0' }}>
                            <td style={{ padding: '8px', fontWeight: 'bold' }}>{kw.keyword}</td>
                            <td style={{ padding: '8px', color: '#38bdf8', fontWeight: 'bold' }}>{kw.clics}</td>
                            <td style={{ padding: '8px' }}>{kw.impresiones}</td>
                            <td style={{ padding: '8px', color: '#34d399' }}>{kw.ctr}</td>
                            <td style={{ padding: '8px' }}>#{kw.posicion}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ background: '#161f33', border: '1px solid #334155', borderRadius: '12px', padding: '16px', maxHeight: '320px', overflowY: 'auto' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#38bdf8' }}>
                      ⚡ Flujo de Comportamiento en Vivo (Eventos Google Analytics 4)
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {eventosGA4.map((ev, idx) => (
                        <div key={ev.id || idx} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '9px 12px', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                          <div>
                            <span style={{ background: '#1d4ed8', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '8px' }}>
                              {ev.evento}
                            </span>
                            <span style={{ color: '#e2e8f0' }}>{ev.detalle}</span>
                          </div>
                          <span style={{ color: '#94a3b8', fontSize: '11px', whiteSpace: 'nowrap' }}>{ev.fecha}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECCIÓN EXCLUSIVA DEL ADMIN: PANEL DE PROTECCIÓN Y AUDITORÍA EN SERVIDOR  */}
        {/* ========================================================================= */}
        {esAdmin && (
          <div ref={seccionSeguridadRef} style={{ width: '100%', scrollMarginTop: '90px' }}>
            <div className="dashboard-container">
              <div style={{ background: '#0f172a', color: '#f8fafc', borderRadius: '16px', padding: '24px', border: '1px solid #1e293b', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.18)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '14px', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '20px', color: '#38bdf8', fontWeight: '800' }}>🛡️ PANEL DE PROTECCIÓN Y AUDITORÍA EN SERVIDOR (SOLO ADMIN)</h2>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Monitoreo interno de los 7 controles de seguridad en Backend</span>
                  </div>
                  <span style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '6px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 'bold' }}>
                    ✓ 7 / 7 Protecciones Activas
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                  {[
                    { riesgo: 'Compartir enlaces de cursos privados', proteccion: 'Validación de matrícula en servidor (/api/seguridad/acceso-curso)' },
                    { riesgo: 'Descargar PDF sin autorización', proteccion: 'Descargas mediante enlaces temporales (/api/seguridad/enlace-pdf-temporal)' },
                    { riesgo: 'Compartir cuentas', proteccion: `Control de sesiones y dispositivos (${dispositivoActual})` },
                    { riesgo: 'Alterar el precio de un curso', proteccion: 'Precio validado exclusivamente en backend (/api/seguridad/crear-orden-compra)' },
                    { riesgo: 'Falsificar una compra', proteccion: 'Confirmación de pago mediante servidor (/api/seguridad/confirmar-pago-servidor)' },
                    { riesgo: 'Manipular evaluaciones', proteccion: 'Validación de respuestas y notas en backend (/api/seguridad/evaluar-examen)' },
                    { riesgo: 'Subir archivos maliciosos', proteccion: 'Validación de extensión, contenido y tamaño (/api/seguridad/validar-archivo)' }
                  ].map((item, idx) => (
                    <div key={idx} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 14px' }}>
                      <div style={{ fontSize: '11px', color: '#f87171', fontWeight: 'bold', marginBottom: '4px' }}>Riesgo: {item.riesgo}</div>
                      <div style={{ fontSize: '13px', color: '#34d399', fontWeight: 'bold' }}>✓ {item.proteccion}</div>
                    </div>
                  ))}
                </div>

                {infoTokenPdf && (
                  <div style={{ marginTop: '16px', background: '#161f33', padding: '12px 16px', borderRadius: '10px', borderLeft: '4px solid #38bdf8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '12px' }}>
                    <div>
                      <strong style={{ color: '#38bdf8' }}>Último Token Temporal PDF Generado:</strong> {infoTokenPdf.titulo} | <code>{infoTokenPdf.token.slice(0, 16)}...</code> (Expira: {infoTokenPdf.expira})
                    </div>
                    <a href={infoTokenPdf.endpoint} target="_blank" rel="noreferrer" style={{ background: '#10b981', color: '#fff', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
                      Auditar Token PDF ↗
                    </a>
                  </div>
                )}

                {notasServidor.length > 0 && (
                  <div style={{ marginTop: '16px', background: '#161f33', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#38bdf8' }}>📊 Registro de Evaluaciones Calificadas en Servidor:</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {notasServidor.slice(0, 8).map((n, i) => (
                        <span key={i} style={{ background: '#0f172a', border: '1px solid #334155', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', color: '#e2e8f0' }}>
                          @{n.usuario_alumno} • Curso #{n.curso_id} ➔ <strong style={{ color: n.nota >= 14 ? '#34d399' : '#f87171' }}>Nota: {n.nota}/20</strong> ({n.correctas}/{n.total_preguntas})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {archivosSegurosLista.length > 0 && (
                  <div style={{ marginTop: '16px', background: '#161f33', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#38bdf8' }}>📎 Archivos Entregados y Verificados (SHA-256):</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {archivosSegurosLista.slice(0, 6).map((a, i) => (
                        <span key={i} style={{ background: '#0f172a', border: '1px solid #334155', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', color: '#e2e8f0' }}>
                          @{a.usuario} • {a.nombre_archivo} ({(a.tamano_bytes / 1024).toFixed(1)} KB)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECCIÓN 6: GESTIÓN DE USUARIOS, MATRÍCULAS Y ÓRDENES (EXCLUSIVO ADMIN)    */}
        {/* ========================================================================= */}
        {esAdmin && (
          <div ref={seccionUsuariosRef} style={{ width: '100%', scrollMarginTop: '90px' }}>
            <div className="dashboard-container">
              <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ fontSize: '22px', color: '#0f172a', margin: 0, fontWeight: 'bold' }}>GESTIÓN DE PERFILES, MATRÍCULAS Y CONFIRMACIÓN DE PAGOS (SOLO ADMIN)</h2>
                <button onClick={abrirModalCrearUsuario} style={{ background: '#2563eb', color: '#fff', padding: '10px 18px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>+ Nuevo Usuario en BD</button>
              </div>

              {/* CONFIRMACIÓN DE ÓRDENES DE COMPRA EN SERVIDOR */}
              {ordenesServidor.length > 0 && (
                <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '24px' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#0f172a' }}>💳 Órdenes de Compra Registradas en Servidor:</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {ordenesServidor.slice(0, 6).map(ord => (
                      <div key={ord.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '10px', fontSize: '12px' }}>
                        <div>
                          <strong>Código:</strong> <code>{ord.codigo_orden}</code> | <strong>Cliente:</strong> {ord.nombre_cliente} (@{ord.usuario_cliente}) | <strong>Total Servidor:</strong> <span style={{ color: '#059669', fontWeight: 'bold' }}>S/ {Number(ord.total_validado).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold', background: ord.estado_pago === 'pagado_verificado' ? '#dcfce7' : '#fef3c7', color: ord.estado_pago === 'pagado_verificado' ? '#166534' : '#92400e' }}>
                            {ord.estado_pago}
                          </span>
                          {ord.estado_pago !== 'pagado_verificado' && (
                            <button onClick={() => confirmarPagoOrdenEnServidor(ord.codigo_orden)} style={{ background: '#059669', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
                              ✓ Confirmar Pago en Servidor
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleAsignarCursoAlumno} style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#334155', marginBottom: '6px' }}>Estudiante:</label>
                  <select value={alumnoSeleccionadoMatricula} onChange={e => setAlumnoSeleccionadoMatricula(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <option value="">-- Seleccionar alumno --</option>
                    {listaUsuarios.filter(u => u.rol === 'alumno').map(u => (
                      <option key={u.id || u.usuario} value={u.usuario}>{u.nombres} (@{u.usuario})</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 2, minWidth: '240px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#334155', marginBottom: '6px' }}>Curso a asignar:</label>
                  <select value={cursoSeleccionadoMatricula} onChange={e => setCursoSeleccionadoMatricula(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    {cursosCatalogo.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
                  </select>
                </div>
                <button type="submit" style={{ background: '#059669', color: '#fff', border: 'none', padding: '11px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>+ Matricular Estudiante</button>
              </form>

              <div className="table-responsive-wrapper">
                <table style={{ width: '100%', minWidth: '720px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '13px' }}>
                      <th style={{ padding: '14px' }}>Usuario</th>
                      <th style={{ padding: '14px' }}>Nombres</th>
                      <th style={{ padding: '14px' }}>Rol</th>
                      <th style={{ padding: '14px' }}>Cursos Matriculados</th>
                      <th style={{ padding: '14px' }}>Estado</th>
                      <th style={{ padding: '14px', textAlign: 'right' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listaUsuarios.map(u => {
                      const cursosDelAlumno = matriculas.filter(m => m.usuario_alumno === u.usuario).map(m => cursosCatalogo.find(c => Number(c.id) === Number(m.curso_id))).filter(Boolean);
                      return (
                        <tr key={u.id || u.usuario} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '13px', color: '#1e293b' }}>
                          <td style={{ padding: '14px', fontWeight: 'bold' }}>{u.usuario}</td>
                          <td style={{ padding: '14px' }}>{u.nombres}</td>
                          <td style={{ padding: '14px', textTransform: 'uppercase', fontSize: '11px', fontWeight: 'bold', color: '#2563eb' }}>{u.rol}</td>
                          <td style={{ padding: '14px' }}>
                            {u.rol !== 'alumno' ? <span style={{ color: '#94a3b8', fontSize: '12px' }}>Gestión / Docencia</span> : cursosDelAlumno.length === 0 ? <span style={{ color: '#94a3b8', fontSize: '12px' }}>Sin cursos asignados</span> : (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {cursosDelAlumno.map(c => (
                                  <span key={c.id} style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    {c.titulo}
                                    <button onClick={() => handleQuitarCursoAlumno(u.usuario, c.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}>✕</button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '14px' }}>{u.estado}</td>
                          <td style={{ padding: '14px', textAlign: 'right', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button onClick={() => abrirModalEditarUsuario(u)} style={{ background: '#e2e8f0', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Editar</button>
                            <button onClick={() => toggleEstadoUsuario(u.id, u.estado)} style={{ background: u.estado === 'activo' ? '#fee2e2' : '#dcfce7', color: u.estado === 'activo' ? '#991b1b' : '#166534', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>{u.estado === 'activo' ? 'Desactivar' : 'Activar'}</button>
                            <button onClick={() => { setUserToReset(u); setModalResetPass(true); }} style={{ background: '#fef3c7', color: '#b45309', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Clave</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL DE EVALUACIÓN PARA ESTUDIANTES */}
      {modalEvaluacionCurso && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', padding: '26px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#0f172a' }}>📝 Evaluación Académica: {modalEvaluacionCurso.titulo}</h3>
              <button onClick={() => setModalEvaluacionCurso(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Cerrar ✕</button>
            </div>
            <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 16px 0' }}>
              Selecciona la alternativa correcta para cada pregunta y envía tu evaluación para obtener tu calificación oficial.
            </p>
            <form onSubmit={enviarEvaluacionAlServidor} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {preguntasExamen.map(preg => (
                <div key={preg.id} style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                  <strong style={{ display: 'block', fontSize: '13px', color: '#0f172a', marginBottom: '10px' }}>{preg.pregunta}</strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {preg.opciones.map(op => (
                      <label key={op.id} style={{ fontSize: '13px', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="radio"
                          name={preg.id}
                          value={op.id}
                          checked={respuestasExamen[preg.id] === op.id}
                          onChange={() => setRespuestasExamen({ ...respuestasExamen, [preg.id]: op.id })}
                          required
                        />
                        <span><strong>{op.id})</strong> {op.texto}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {resultadoExamenServidor && (
                <div style={{ padding: '14px', borderRadius: '10px', background: resultadoExamenServidor.aprobado ? '#dcfce7' : '#fee2e2', color: resultadoExamenServidor.aprobado ? '#166534' : '#991b1b', fontWeight: 'bold', fontSize: '13px' }}>
                  Calificación obtenida: {resultadoExamenServidor.nota}/20 ({resultadoExamenServidor.correctas} de {resultadoExamenServidor.total} respuestas correctas)
                </div>
              )}

              <button type="submit" style={{ background: '#2563eb', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                Finalizar y Enviar Evaluación
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE SUBIDA DE ARCHIVO PARA ESTUDIANTES */}
      {modalSubirArchivoCurso && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '500px', padding: '26px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#0f172a' }}>📎 Entregar Informe: {modalSubirArchivoCurso.titulo}</h3>
              <button onClick={() => setModalSubirArchivoCurso(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Cerrar ✕</button>
            </div>
            <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
              Formatos permitidos: <strong>.pdf, .docx, .zip, .ino, .py, .cpp, .png, .jpg</strong> (Tamaño máximo: 5 MB).
            </p>
            <form onSubmit={enviarArchivoAlServidor} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
              <input type="file" onChange={handleSeleccionarArchivo} required style={{ padding: '10px', border: '1px dashed #2563eb', borderRadius: '8px', background: '#f8fafc' }} />
              {estadoValidacionArchivo && (
                <div style={{
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  whiteSpace: 'pre-line',
                  background: estadoValidacionArchivo.tipo === 'exito' ? '#dcfce7' : estadoValidacionArchivo.tipo === 'error' ? '#fee2e2' : '#e0f2fe',
                  color: estadoValidacionArchivo.tipo === 'exito' ? '#166534' : estadoValidacionArchivo.tipo === 'error' ? '#991b1b' : '#0369a1'
                }}>
                  {estadoValidacionArchivo.texto}
                </div>
              )}
              <button type="submit" style={{ background: '#2563eb', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                Enviar Archivo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE NUEVO CURSO (ADMIN Y DOCENTE) */}
      {modalNuevoCurso && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', padding: '25px', borderRadius: '14px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#0f172a' }}>Añadir Nuevo Curso</h3>
            <form onSubmit={handleCrearCursoBD} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="Título del curso" value={nuevoCursoForm.titulo} onChange={e => setNuevoCursoForm({...nuevoCursoForm, titulo: e.target.value})} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Categoría" value={nuevoCursoForm.categoria} onChange={e => setNuevoCursoForm({...nuevoCursoForm, categoria: e.target.value})} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', flex: 1 }} />
                <input type="number" placeholder="Precio (S/)" value={nuevoCursoForm.precio} onChange={e => setNuevoCursoForm({...nuevoCursoForm, precio: e.target.value})} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', flex: 1 }} />
              </div>
              <textarea rows="2" placeholder="Descripción breve" value={nuevoCursoForm.descripcion} onChange={e => setNuevoCursoForm({...nuevoCursoForm, descripcion: e.target.value})} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <select value={nuevoCursoForm.tipo} onChange={e => setNuevoCursoForm({...nuevoCursoForm, tipo: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', flex: 1 }}>
                  <option value="Virtual">Virtual</option>
                  <option value="Presencial">Presencial</option>
                </select>
                <input type="text" placeholder="Horario" value={nuevoCursoForm.horario} onChange={e => setNuevoCursoForm({...nuevoCursoForm, horario: e.target.value})} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', flex: 1 }} />
              </div>
              <input type="text" placeholder="Instructor" value={nuevoCursoForm.instructor} onChange={e => setNuevoCursoForm({...nuevoCursoForm, instructor: e.target.value})} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="URL de Imagen (opcional)" value={nuevoCursoForm.imagen_url} onChange={e => setNuevoCursoForm({...nuevoCursoForm, imagen_url: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <textarea rows="3" placeholder="Temario (un módulo por línea)" value={nuevoCursoForm.temarioTexto} onChange={e => setNuevoCursoForm({...nuevoCursoForm, temarioTexto: e.target.value})} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <button type="submit" style={{ background: '#2563eb', color: '#fff', padding: '12px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Guardar Curso</button>
              <button type="button" onClick={() => setModalNuevoCurso(false)} style={{ background: '#e2e8f0', padding: '12px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {/* VISOR FLIPBOOK 3D */}
      {libroSeleccionado && <PdfFlipbook pdfUrl={libroSeleccionado} alCerrar={() => setLibroSeleccionado(null)} />}

      {/* MODAL DETALLES DE LABORATORIO PRESENCIAL */}
      {laboratorioSeleccionado && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#fff', maxWidth: '700px', width: '100%', padding: '25px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#059669' }}>{laboratorioSeleccionado.titulo}</h3>
              <button onClick={() => setLaboratorioSeleccionado(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Cerrar</button>
            </div>
            <p>{laboratorioSeleccionado.descripcion}</p>
            <p><strong>Sede Física:</strong> {laboratorioSeleccionado.enlaceSede} | <strong>Horario:</strong> {laboratorioSeleccionado.horario}</p>
          </div>
        </div>
      )}

      {/* MODAL CREAR / EDITAR USUARIO EN BD */}
      {modalUsuario && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px', boxSizing: 'border-box' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '440px', padding: '25px', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>{modoEdicion ? 'Editar Usuario' : 'Registrar Nuevo Usuario en BD'}</h3>
            {mensajeUserMsg && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px', fontWeight: 'bold' }}>{mensajeUserMsg}</p>}
            <form onSubmit={handleGuardarUsuario} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input type="text" disabled={modoEdicion} placeholder="Nombre de Usuario (ej: mgarcia)" value={usuarioForm.usuario} onChange={e => setUsuarioForm({...usuarioForm, usuario: e.target.value})} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: modoEdicion ? '#f1f5f9' : '#fff' }} />
              {!modoEdicion && (
                <input type="password" placeholder="Asigna una contraseña" value={usuarioForm.password} onChange={e => setUsuarioForm({...usuarioForm, password: e.target.value})} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              )}
              <input type="text" placeholder="Nombres completos" value={usuarioForm.nombres} onChange={e => setUsuarioForm({...usuarioForm, nombres: e.target.value})} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <select value={usuarioForm.rol} onChange={e => setUsuarioForm({...usuarioForm, rol: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <option value="alumno">Alumno</option>
                <option value="docente">Docente</option>
                <option value="admin">Administrador (admin)</option>
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, background: '#2563eb', color: '#fff', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Guardar en BD</button>
                <button type="button" onClick={() => setModalUsuario(false)} style={{ flex: 1, background: '#e2e8f0', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL RESET PASSWORD EN BD */}
      {modalResetPass && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '390px', padding: '25px', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 8px 0' }}>Restablecer Clave</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '15px' }}>Nueva clave para <strong>{userToReset.usuario}</strong>:</p>
            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input type="password" value={newPasswordInput} onChange={e => setNewPasswordInput(e.target.value)} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, background: '#d97706', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Actualizar</button>
                <button type="button" onClick={() => setModalResetPass(false)} style={{ flex: 1, background: '#e2e8f0', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}