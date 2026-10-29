import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import PdfFlipbook from './components/PdfFlipbook';

const WHATSAPP_NUMERO = '51967107035';

// CATÁLOGO MAESTRO UNIFICADO (Tienda y Aula)
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
      'Módulo 1: Morfología del robot (grados de libertad, articulaciones)',
      'Módulo 2: Álgebra matricial y transformaciones espaciales 3D',
      'Módulo 3: Cinemática Directa y parámetros Denavit-Hartenberg',
      'Módulo 4: Cinemática Inversa algebraica y geométrica',
      'Módulo 5: Planificación de trayectorias articulares'
    ],
    tipo: 'Virtual',
    horario: 'Martes y Jueves - 7:00 PM',
    instructor: 'Ing. Fabrizio Barzola',
    enlaceSede: 'https://zoom.us/j/9876543210',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
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
      'Módulo 4: Amplificadores Operacionales (Op-Amps) y filtrado',
      'Módulo 5: Electrónica de potencia y drivers Puente H'
    ],
    tipo: 'Presencial',
    horario: 'Viernes - 7:00 PM',
    instructor: 'Ing. Carlos Mendoza',
    enlaceSede: 'Campus Central - Laboratorio de Electrónica',
    ubicacionImg: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800'
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
      'Módulo 1: Arquitectura interna (CPU, memoria Flash/RAM)',
      'Módulo 2: Entradas y salidas digitales (GPIO) y actuadores',
      'Módulo 3: Conversión Analógica-Digital (ADC) y señales PWM',
      'Módulo 4: Interrupciones externas y Timers por hardware',
      'Módulo 5: Protocolos de comunicación UART, I2C y SPI'
    ],
    tipo: 'Virtual',
    horario: 'Sábados - 3:00 PM',
    instructor: 'Ing. Fabrizio Barzola',
    enlaceSede: 'https://zoom.us/j/1234567890',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
  },
  {
    id: 4,
    titulo: 'Lógica de Programación para Mecatrónica',
    categoria: 'Programación',
    descripcion: 'Desarrollo de algoritmos de control de hardware en C++ orientado a objetos y procesamiento matemático en Python.',
    precio: 100.00,
    duracion: '5 Semanas (20 Horas)',
    imagen_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
    video_demo_url: 'https://www.youtube.com/embed/ZzaPdXTrSb8',
    temario: [
      'Módulo 1: Algoritmos y estructuras de control',
      'Módulo 2: C++ Parte 1: Tipos de datos, funciones y punteros',
      'Módulo 3: C++ Parte 2: Programación Orientada a Objetos',
      'Módulo 4: Python Parte 1: Sintaxis y automatización',
      'Módulo 5: Python Parte 2: Matrices con NumPy'
    ],
    tipo: 'Virtual',
    horario: 'Lunes y Miércoles - 8:00 PM',
    instructor: 'Dra. María Fernández',
    enlaceSede: 'https://meet.google.com/abc-defg-hij',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
  },
  {
    id: 5,
    titulo: 'Automatización Industrial y PLCs Multimarca',
    categoria: 'Automatización',
    descripcion: 'Programación industrial en entornos Siemens TIA Portal, Allen-Bradley y Delta bajo norma IEC 61131-3.',
    precio: 150.00,
    duracion: '6 Semanas (24 Horas)',
    imagen_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80',
    video_demo_url: 'https://www.youtube.com/embed/PbAGl_mv5XI',
    temario: [
      'Módulo 1: Hardware de PLCs (Siemens, Allen-Bradley, Delta)',
      'Módulo 2: Lenguaje Ladder (KOP), temporizadores y contadores',
      'Módulo 3: Diagrama de Bloques de Funciones (FBD)',
      'Módulo 4: Texto Estructurado (ST/SCL)',
      'Módulo 5: Secuencias industriales paso a paso con Grafcet (SFC)'
    ],
    tipo: 'Virtual',
    horario: 'Martes y Jueves - 8:00 PM',
    instructor: 'Ing. Carlos Mendoza',
    enlaceSede: 'https://zoom.us/j/9876543210',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
  },
  {
    id: 6,
    titulo: 'Visión Artificial y Procesamiento de Imágenes',
    categoria: 'Inteligencia Artificial',
    descripcion: 'Clasificación de piezas industriales, detección de bordes y seguimiento de objetos en tiempo real con Python.',
    precio: 140.00,
    duracion: '5 Semanas (20 Horas)',
    imagen_url: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=600&q=80',
    video_demo_url: 'https://www.youtube.com/embed/oXlwWbU8l2o',
    temario: [
      'Módulo 1: Espacios de color y matrices de píxeles',
      'Módulo 2: Filtrado de ruido y detección de bordes Canny',
      'Módulo 3: Segmentación y reconocimiento de geometrías',
      'Módulo 4: Object Tracking y extracción de coordenadas',
      'Módulo 5: Redes neuronales básicas para calidad visual'
    ],
    tipo: 'Virtual',
    horario: 'Viernes - 6:00 PM',
    instructor: 'Dra. María Fernández',
    enlaceSede: 'https://zoom.us/j/5556667770',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
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
      'Módulo 2: Captura de esquemáticos electrónicos en software EDA',
      'Módulo 3: Reglas de ruteo PCB y planos de tierra (GND)',
      'Módulo 4: Diseño de etapas de potencia y optoacopladores',
      'Módulo 5: Exportación de archivos Gerber y preparación DFM'
    ],
    tipo: 'Presencial',
    horario: 'Miércoles - 4:00 PM',
    instructor: 'Ing. Carlos Mendoza',
    enlaceSede: 'Campus Central - Laboratorio de Electrónica',
    ubicacionImg: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800'
  },
  {
    id: 8,
    titulo: 'Simulación de Sistemas Neumáticos',
    categoria: 'Automatización',
    descripcion: 'Diseño de circuitos secuenciales por método cascada, válvulas direccionales y control por relés en FluidSIM.',
    precio: 105.00,
    duracion: '4 Semanas (16 Horas)',
    imagen_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&q=80',
    video_demo_url: 'https://www.youtube.com/embed/2f_ca121kFQ',
    temario: [
      'Módulo 1: Tratamiento del aire comprimido y FRL',
      'Módulo 2: Válvulas distribuidoras y cilindros (ISO 1219)',
      'Módulo 3: Diseño de mandos secuenciales (Cascada / Paso a Paso)',
      'Módulo 4: Electroneumática con relés y electroválvulas',
      'Módulo 5: Sistemas de vacío, ventosas y actuadores de giro'
    ],
    tipo: 'Presencial',
    horario: 'Martes - 4:00 PM',
    instructor: 'Ing. Luis Alvarado',
    enlaceSede: 'Sede Arequipa - Pabellón B - Lab 2',
    ubicacionImg: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800'
  },
  {
    id: 9,
    titulo: 'Manufactura Aditiva e Impresión 3D',
    categoria: 'Manufactura',
    descripcion: 'Configuración avanzada de laminadores, selección de polímeros técnicos (PLA, PETG, ABS, TPU) y tolerancias.',
    precio: 90.00,
    duracion: '4 Semanas (16 Horas)',
    imagen_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&q=80',
    video_demo_url: 'https://www.youtube.com/embed/Vx0Z6LplaMU',
    temario: [
      'Módulo 1: Tecnologías FDM, SLA y cinemática de impresoras 3D',
      'Módulo 2: Propiedades mecánicas de filamentos',
      'Módulo 3: Parámetros de laminado (Infill, perímetros, soportes)',
      'Módulo 4: Diseño paramétrico de tolerancias para piezas móviles',
      'Módulo 5: Diagnóstico de fallas (Warping) y calibración mecánica'
    ],
    tipo: 'Presencial',
    horario: 'Jueves - 5:00 PM',
    instructor: 'Ing. Fabrizio Barzola',
    enlaceSede: 'Campus Central - Taller Mecánico',
    ubicacionImg: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800'
  },
  {
    id: 10,
    titulo: 'Diseño Mecánico y Modelado CAD 3D',
    categoria: 'Diseño Mecánico',
    descripcion: 'Modelado paramétrico en Autodesk Inventor, cajas reductoras de engranajes, cálculo AGMA y esfuerzos FEA.',
    precio: 135.00,
    duracion: '5 Semanas (20 Horas)',
    imagen_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80',
    video_demo_url: 'https://www.youtube.com/embed/ddU98eb21wY',
    temario: [
      'Módulo 1: Lectura de planos y tolerancias geométricas (GD&T)',
      'Módulo 2: Modelado paramétrico 3D (extrusión, revolución)',
      'Módulo 3: Ensamblaje de caja reductora de engranajes rectos',
      'Módulo 4: Simulación de esfuerzos (FEA) y norma AGMA',
      'Módulo 5: Planos de fabricación y lista de materiales (BOM)'
    ],
    tipo: 'Virtual',
    horario: 'Lunes - 7:00 PM',
    instructor: 'Ing. Luis Alvarado',
    enlaceSede: 'https://zoom.us/j/1234567890',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
  }
];

export default function App() {
  // ESTADOS GENERALES DE SESIÓN Y CATÁLOGO
  const [sesionIniciada, setSesionIniciada] = useState(() => localStorage.getItem('sesionIniciada') === 'true');
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => localStorage.getItem('usuarioLogueado') || '');
  const [rolUsuario, setRolUsuario] = useState(() => localStorage.getItem('rolUsuario') || '');
  const [cursosCatalogo, setCursosCatalogo] = useState(CATALOGO_INICIAL);
  
  // ESTADOS DE LA TIENDA Y CARRITO
  const [catTiendaActiva, setCatTiendaActiva] = useState('Todos');
  const [busquedaTienda, setBusquedaTienda] = useState('');
  const [cursoDemoModal, setCursoDemoModal] = useState(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [mostrarModalLogin, setMostrarModalLogin] = useState(false);
  const [nombreInteresado, setNombreInteresado] = useState('');
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem('carrito_portico');
    return guardado ? JSON.parse(guardado) : [];
  });

  // SINCRONIZACIÓN Y PERSISTENCIA
  useEffect(() => {
    localStorage.setItem('carrito_portico', JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    fetch('https://portico-san-marcos.onrender.com/api/catalogo')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const cursosUnificados = data.map(dbCurso => {
            const cursoLocal = CATALOGO_INICIAL.find(c => c.id === dbCurso.id) || {};
            return { ...cursoLocal, ...dbCurso };
          });
          setCursosCatalogo(cursosUnificados);
        }
      })
      .catch(() => console.log('Usando catálogo local (backend en suspensión).'));
  }, []);

  // LÓGICA DEL CARRITO
  const agregarAlCarrito = (curso) => {
    if (!carrito.some(item => item.id === curso.id)) setCarrito([...carrito, curso]);
    setCarritoAbierto(true);
  };
  const quitarDelCarrito = (id) => setCarrito(carrito.filter(item => item.id !== id));
  const estaEnCarrito = (id) => carrito.some(item => item.id === id);
  const totalCarrito = carrito.reduce((acc, item) => acc + Number(item.precio), 0);

  // BOTÓN DE WHATSAPP
  const enviarPedidoWhatsApp = () => {
    if (carrito.length === 0) return;
    const saludo = nombreInteresado.trim() ? `¡Hola *Pórtico San Marcos*! 👋 Mi nombre es *${nombreInteresado.trim()}*.` : `¡Hola *Pórtico San Marcos*! 👋`;
    const listaTexto = carrito.map((c, i) => `${i + 1}. *${c.titulo}* - S/ ${Number(c.precio).toFixed(2)}`).join('\n');
    const textoFinal = `${saludo}\nDeseo adquirir los siguientes cursos de Mecatrónica:\n\n${listaTexto}\n\n💰 *Total a pagar: S/ ${totalCarrito.toFixed(2)}*\n\n¿Me podrían brindar los medios de pago para habilitar mi acceso?`;
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(textoFinal)}`, '_blank');
  };

  // BOTÓN DE MERCADO PAGO CORREGIDO
  const procesarPagoOnline = async () => {
    if (carrito.length === 0) return;
    try {
      const response = await fetch('https://portico-san-marcos.onrender.com/api/pagos/crear-preferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carrito: carrito, nombreUsuario: nombreInteresado })
      });
      
      if (!response.ok) throw new Error("Error en la respuesta del servidor");
      
      const data = await response.json();
      
      if (data && data.urlPago) {
        window.location.href = data.urlPago; 
      } else {
        throw new Error("No se recibió la URL de pago");
      }
    } catch (error) {
      console.error("Error al procesar pago:", error);
      alert("Hubo un error de conexión con la pasarela de pagos. Por favor, intenta de nuevo o coordina vía WhatsApp.");
    }
  };

  // ESTADOS DEL AULA VIRTUAL
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [modalidadFiltro, setModalidadFiltro] = useState('virtual'); 
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  
  const seccionInicioRef = useRef(null);
  const seccionCursosRef = useRef(null);
  const seccionDocentesRef = useRef(null);
  const seccionBibliotecaRef = useRef(null);
  const seccionUsuariosRef = useRef(null);

  const irASeccion = (ref) => {
    setMenuMovilAbierto(false);
    if (ref && ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  const [bannerActual, setBannerActual] = useState(0);
  const bannersHero = [
    { tag: 'PÓRTICO SAN MARCOS', titulo: 'Excelencia Tecnológica,', subtitulo: 'Formación para el futuro.', statsNum: '+ 35 MIL', statsTxt: 'Estudiantes Registrados', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800' },
    { tag: 'BIBLIOTECA VIRTUAL', titulo: 'Accede a Textos y Manuales,', subtitulo: 'Visor estilo Flipbook digital.', statsNum: '100%', statsTxt: 'Material Gratuito', img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800' }
  ];

  useEffect(() => {
    const interval = setInterval(() => setBannerActual((prev) => (prev + 1) % bannersHero.length), 5000);
    return () => clearInterval(interval);
  }, [bannersHero.length]);

  const [videoActivo, setVideoActivo] = useState(null);
  const [laboratorioSeleccionado, setLaboratorioSeleccionado] = useState(null);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);

  // BIBLIOTECA RESTAURADA COMPLETA (4 LIBROS)
  const listaLibros = [
    { id: 1, titulo: 'Manual de Automatización e Industria 4.0 (TIA Portal)', autor: 'Ing. Carlos Mendoza', categoria: 'ingenieria', portada: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600', pdfUrl: '/manual_plc.pdf' },
    { id: 2, titulo: 'Arquitectura Limpia y Microservicios Node.js', autor: 'Dr. Roberto Gómez', categoria: 'programacion', portada: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600', pdfUrl: '/node_microservicios.pdf' },
    { id: 3, titulo: 'Guía Práctica de Robótica e IoT (ESP32)', autor: 'Ing. Fabrizio Barzola', categoria: 'mecatronica', portada: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600', pdfUrl: '/guia_esp32.pdf' },
    { id: 4, titulo: 'Fundamentos de Neumática ISO 1219', autor: 'Ing. Luis Alvarado', categoria: 'mecatronica', portada: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=600', pdfUrl: '/neumatica_iso1219.pdf' }
  ];

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const docentesDestacados = [
    { id: 1, nombre: 'Ing. Fabrizio Barzola', especialidad: 'Especialista en Robótica', sede: 'Lab 4', foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600' },
    { id: 2, nombre: 'Ing. Carlos Mendoza', especialidad: 'PLC Siemens', sede: 'Lab Electrónica', foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600' },
    { id: 3, nombre: 'Ing. Luis Alvarado', especialidad: 'Neumática ISO 1219', sede: 'Sede Arequipa', foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600' }
  ];

  const [listaUsuarios, setListaUsuarios] = useState([
    { id: 1, usuario: 'jperez', nombres: 'Juan Pérez', rol: 'alumno', estado: 'activo' },
    { id: 4, usuario: 'fbarzola', nombres: 'Fabrizio Barzola', rol: 'docente', estado: 'activo' }
  ]);
  const [modalUsuario, setModalUsuario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioForm, setUsuarioForm] = useState({ id: null, usuario: '', password: '', nombres: '', rol: 'alumno' });
  const [mensajeUserMsg, setMensajeUserMsg] = useState('');
  const [modalResetPass, setModalResetPass] = useState(false);
  const [userToReset, setUserToReset] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // LOGIN CONECTADO A BACKEND
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMensaje('Verificando credenciales de acceso...');
    try {
      const response = await fetch('https://portico-san-marcos.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUsuarioLogueado(data.user.nombres || data.user.usuario);
        setRolUsuario(data.user.rol || 'alumno');
        setSesionIniciada(true);
        setMostrarModalLogin(false);
        setMensaje('');
        localStorage.setItem('sesionIniciada', 'true');
        localStorage.setItem('usuarioLogueado', data.user.nombres || data.user.usuario);
        localStorage.setItem('rolUsuario', data.user.rol || 'alumno');
      } else setMensaje(data.message || 'Credenciales incorrectas');
    } catch (error) {
      setMensaje('Error de conexión con el servidor.');
    }
  };

  const cerrarSesion = () => {
    localStorage.clear();
    setSesionIniciada(false);
    setUsuario('');
    setPassword('');
    setRolUsuario('');
  };

  // FUNCIONES DE GESTIÓN DE USUARIOS
  const abrirModalCrearUsuario = () => {
    setModoEdicion(false); setUsuarioForm({ id: null, usuario: '', password: '', nombres: '', rol: 'alumno' });
    setMensajeUserMsg(''); setModalUsuario(true);
  };
  const abrirModalEditarUsuario = (u) => {
    setModoEdicion(true); setUsuarioForm({ id: u.id, usuario: u.usuario, password: '', nombres: u.nombres, rol: u.rol });
    setMensajeUserMsg(''); setModalUsuario(true);
  };
  const handleGuardarUsuario = (e) => {
    e.preventDefault(); setMensajeUserMsg('');
    if (!modoEdicion) {
      if (listaUsuarios.some(u => u.usuario.toLowerCase() === usuarioForm.usuario.toLowerCase())) {
        setMensajeUserMsg('El usuario ya existe.'); return;
      }
      setListaUsuarios([...listaUsuarios, { id: Date.now(), usuario: usuarioForm.usuario, nombres: usuarioForm.nombres, rol: usuarioForm.rol, estado: 'activo' }]);
      setModalUsuario(false);
    } else {
      setListaUsuarios(listaUsuarios.map(u => u.id === usuarioForm.id ? { ...u, nombres: usuarioForm.nombres, rol: usuarioForm.rol } : u));
      setModalUsuario(false);
    }
  };
  const toggleEstadoUsuario = (id) => {
    setListaUsuarios(listaUsuarios.map(u => u.id === id ? { ...u, estado: u.estado === 'activo' ? 'inactivo' : 'activo' } : u));
  };
  const handleResetPassword = (e) => {
    e.preventDefault(); if (!newPasswordInput) return;
    alert(`Contraseña restablecida con éxito.`);
    setModalResetPass(false); setNewPasswordInput(''); setUserToReset(null);
  };

  // FILTRADO DEL AULA VIRTUAL
  const clasesInternasFiltradas = cursosCatalogo.filter(item => {
    const tipoFiltro = item.tipo ? item.tipo.toLowerCase() : 'virtual';
    const coincideModalidad = tipoFiltro === modalidadFiltro.toLowerCase();
    const coincideCategoria = categoriaSeleccionada === 'todas' || item.categoria === categoriaSeleccionada;
    const busqMin = busqueda.toLowerCase();
    const coincideBusqueda = item.titulo.toLowerCase().includes(busqMin) || (item.instructor && item.instructor.toLowerCase().includes(busqMin));
    return coincideModalidad && coincideCategoria && coincideBusqueda;
  });

  // =========================================================================
  // VISTA 1: TIENDA VIRTUAL (PRE-LOGIN)
  // =========================================================================
  if (!sesionIniciada) {
    const categoriasTienda = ['Todos', ...new Set(cursosCatalogo.map(c => c.categoria))];
    const cursosTiendaFiltrados = cursosCatalogo.filter(c => {
      const matchCat = catTiendaActiva === 'Todos' || c.categoria === catTiendaActiva;
      const matchTxt = c.titulo.toLowerCase().includes(busquedaTienda.toLowerCase()) || c.descripcion.toLowerCase().includes(busquedaTienda.toLowerCase());
      return matchCat && matchTxt;
    });

    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        {/* NAVBAR */}
        <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid #1e293b', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: '0', fontSize: '22px', color: '#38bdf8', fontWeight: 'bold' }}>Aula Virtual Pórtico San Marcos</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setCarritoAbierto(true)} style={{ background: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' }}>
              🛒 Mi Carrito {carrito.length > 0 && <span style={{ background: '#ef4444', marginLeft: '6px', padding: '2px 8px', borderRadius: '999px' }}>{carrito.length}</span>}
            </button>
            <button onClick={() => setMostrarModalLogin(true)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              🔐 Ingresar al Aula
            </button>
          </div>
        </header>

        {/* HERO Y BUSCADOR */}
        <section style={{ textAlign: 'center', padding: '50px 20px', maxWidth: '850px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '34px', color: '#fff', marginBottom: '15px' }}>Catálogo de Cursos de Ingeniería Mecatrónica</h2>
          <input type="text" placeholder="🔍 Buscar curso..." value={busquedaTienda} onChange={(e) => setBusquedaTienda(e.target.value)} style={{ width: '100%', maxWidth: '520px', padding: '12px 18px', borderRadius: '99px', background: '#1e293b', color: '#fff', border: '1px solid #334155', outline: 'none' }} />
        </section>

        {/* FILTROS DE CATEGORÍA */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', padding: '0 20px 30px' }}>
          {categoriasTienda.map(cat => (
            <button key={cat} onClick={() => setCatTiendaActiva(cat)} style={{ padding: '8px 16px', borderRadius: '99px', background: catTiendaActiva === cat ? '#2563eb' : '#1e293b', color: '#fff', border: '1px solid #334155', cursor: 'pointer', fontWeight: 'bold' }}>{cat}</button>
          ))}
        </div>

        {/* GRILLA DE CURSOS EN TIENDA */}
        <main style={{ maxWidth: '1260px', margin: '0 auto', padding: '0 20px 60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '24px' }}>
          {cursosTiendaFiltrados.map(curso => (
            <div key={curso.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative' }}>
                <img src={curso.imagen_url} alt={curso.titulo} style={{ width: '100%', height: '185px', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(15,23,42,0.9)', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>{curso.categoria}</span>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#fff' }}>{curso.titulo}</h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', flex: 1, lineHeight: '1.5' }}>{curso.descripcion}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #334155', paddingTop: '12px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>⏱ {curso.duracion || '5 Semanas'}</span>
                  <strong style={{ fontSize: '20px', color: '#34d399' }}>S/ {Number(curso.precio).toFixed(2)}</strong>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button onClick={() => setCursoDemoModal(curso)} style={{ background: '#0f172a', color: '#fff', border: '1px solid #475569', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>🎬 Demo</button>
                  <button onClick={() => agregarAlCarrito(curso)} style={{ background: estaEnCarrito(curso.id) ? '#059669' : '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {estaEnCarrito(curso.id) ? '✓ En Carrito' : '+ Agregar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </main>

        {/* MODAL DEL VIDEO DEMO Y SÍLABO */}
        {cursoDemoModal && (
          <div onClick={() => setCursoDemoModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div onClick={e => e.stopPropagation()} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '24px', position: 'relative' }}>
              <button onClick={() => setCursoDemoModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
              <h2 style={{ color: '#fff', marginTop: 0 }}>{cursoDemoModal.titulo}</h2>
              <iframe src={cursoDemoModal.video_demo_url} title="demo" style={{ width: '100%', height: '350px', border: 'none', borderRadius: '8px', background: '#000', marginBottom: '15px' }} />
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(Array.isArray(cursoDemoModal.temario) ? cursoDemoModal.temario : []).map((mod, i) => (
                  <li key={i} style={{ background: '#0f172a', padding: '10px 14px', borderRadius: '8px', borderLeft: '4px solid #2563eb', fontSize: '13px', color: '#e2e8f0' }}>{mod}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* CARRITO Y PAGOS (MERCADO PAGO + WHATSAPP) */}
        {carritoAbierto && (
          <div onClick={() => setCarritoAbierto(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 250, display: 'flex', justifyContent: 'flex-end' }}>
            <aside onClick={e => e.stopPropagation()} style={{ background: '#1e293b', width: '100%', maxWidth: '410px', height: '100vh', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '14px' }}>
                <h3 style={{ color: '#fff', margin: 0 }}>🛒 Carrito ({carrito.length})</h3>
                <button onClick={() => setCarritoAbierto(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>✕</button>
              </div>

              {carrito.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '40px' }}>Tu carrito está vacío.</p>
              ) : (
                <>
                  <div style={{ flex: 1, overflowY: 'auto', margin: '20px 0' }}>
                    {carrito.map(item => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0f172a', padding: '10px', marginBottom: '10px', borderRadius: '8px' }}>
                        <img src={item.imagen_url} alt="img" style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}/>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '13px' }}>{item.titulo}</h4>
                          <span style={{ color: '#34d399', fontSize: '13px', fontWeight: 'bold' }}>S/ {Number(item.precio).toFixed(2)}</span>
                        </div>
                        <button onClick={() => quitarDelCarrito(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid #334155', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input type="text" placeholder="Tu Nombre Completo" value={nombreInteresado} onChange={e => setNombreInteresado(e.target.value)} style={{ padding: '12px', borderRadius: '6px', background: '#0f172a', color: '#fff', border: '1px solid #475569', outline: 'none' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '18px' }}>
                      <span style={{ color: '#cbd5e1' }}>Total:</span>
                      <strong style={{ color: '#34d399' }}>S/ {totalCarrito.toFixed(2)}</strong>
                    </div>
                    
                    {/* BOTONES DE PAGO REVISADOS */}
                    <button onClick={procesarPagoOnline} style={{ width: '100%', background: '#009ee3', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 158, 227, 0.3)' }}>
                      💳 Pagar en Línea (Tarjeta / Yape / Plin)
                    </button>
                    <button onClick={enviarPedidoWhatsApp} style={{ width: '100%', background: '#25D366', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
                      Coordinar por WhatsApp
                    </button>
                  </div>
                </>
              )}
            </aside>
          </div>
        )}

        {/* MODAL DE LOGIN REDISEÑADO (MODO OSCURO / ELEGANTE) */}
        {mostrarModalLogin && (
          <div onClick={() => setMostrarModalLogin(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div onClick={e => e.stopPropagation()} style={{ background: '#1e293b', border: '1px solid #334155', padding: '40px 30px', borderRadius: '16px', width: '100%', maxWidth: '420px', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
              
              <button onClick={() => setMostrarModalLogin(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>✕</button>

              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <h2 style={{ color: '#f8fafc', margin: '0 0 8px 0', fontSize: '24px', fontWeight: '800' }}>Pórtico San Marcos</h2>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>Acceso exclusivo para estudiantes y docentes matriculados en la institución.</p>
              </div>

              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#cbd5e1' }}>Usuario / Matrícula:</label>
                  <input 
                    type="text" 
                    value={usuario} 
                    onChange={(e) => setUsuario(e.target.value)} 
                    required 
                    placeholder="Ej: jperez"
                    style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: '#fff', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#cbd5e1' }}>Contraseña:</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: '#fff', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>

                {mensaje && (
                  <div style={{ color: mensaje.includes('exitoso') || mensaje.includes('Verificando') ? '#38bdf8' : '#ef4444', fontSize: '14px', textAlign: 'center', fontWeight: 'bold', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px' }}>
                    {mensaje}
                  </div>
                )}

                <button type="submit" style={{ width: '100%', padding: '15px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', marginTop: '10px', transition: '0.2s' }}>
                  Autenticar e Ingresar
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VISTA 2: INTERIOR DEL AULA VIRTUAL (TU CÓDIGO ORIGINAL COMPLETO)
  // =========================================================================
  return (
    <div style={{ minHeight: '100vh', width: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', scrollBehavior: 'smooth' }}>
      
      {/* NAVBAR SUPERIOR INTERNO */}
      <header style={{ width: '100%', background: '#091e42', color: '#fff', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 1000, flexWrap: 'wrap', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', color: '#38bdf8', fontWeight: 'bold' }}>Pórtico San Marcos</h2>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Aula Virtual & Biblioteca 3D</span>
          </div>
        </div>

        <button 
          onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
          style={{ display: 'none', background: 'none', border: 'none', color: '#fff', fontSize: '26px', cursor: 'pointer' }}
          className="mobile-btn-toggle"
        >
          ☰
        </button>

        <nav className={`navbar-menu-items ${menuMovilAbierto ? 'abierto' : ''}`} style={{ display: 'flex', gap: '22px', alignItems: 'center' }}>
          <button onClick={() => irASeccion(seccionInicioRef)} style={{ background: 'none', border: 'none', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Inicio</button>
          <button onClick={() => irASeccion(seccionCursosRef)} style={{ background: 'none', border: 'none', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Cursos</button>
          {rolUsuario === 'alumno' && (
            <button onClick={() => irASeccion(seccionDocentesRef)} style={{ background: 'none', border: 'none', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Docentes</button>
          )}
          <button onClick={() => irASeccion(seccionBibliotecaRef)} style={{ background: 'none', border: 'none', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Biblioteca 3D</button>
          {rolUsuario === 'docente' && (
            <button onClick={() => irASeccion(seccionUsuariosRef)} style={{ background: 'none', border: 'none', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Usuarios</button>
          )}

          <div className="navbar-user-info" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>{usuarioLogueado}</span>
              <span style={{ fontSize: '11px', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 'bold' }}>{rolUsuario}</span>
            </div>
            <button onClick={cerrarSesion} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </header>

      <main style={{ flex: 1, padding: '30px 0', display: 'flex', flexDirection: 'column', gap: '40px', width: '100%' }}>
        
        {/* SECCIÓN 1: CARRUSEL HERO */}
        <div ref={seccionInicioRef} style={{ width: '100%', scrollMarginTop: '90px' }}>
          <div className="dashboard-container">
            <div className="focus-hero-banner-main">
              <div className="hero-banner-content">
                <span style={{ background: 'rgba(255,255,255,0.15)', color: '#38bdf8', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                  {bannersHero[bannerActual].tag} ({rolUsuario.toUpperCase()})
                </span>
                <h1>
                  {bannersHero[bannerActual].titulo}<br /><span style={{ color: '#38bdf8' }}>{bannersHero[bannerActual].subtitulo}</span>
                </h1>
                <div className="hero-stats-badge" style={{ marginTop: '20px', display: 'flex', gap: '20px', background: 'rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: '12px', backdropFilter: 'blur(10px)', width: 'fit-content' }}>
                  <div>
                    <strong style={{ fontSize: '20px', color: '#fff', display: 'block' }}>{bannersHero[bannerActual].statsNum}</strong>
                    <span style={{ fontSize: '12px', color: '#cbd5e1' }}>{bannersHero[bannerActual].statsTxt}</span>
                  </div>
                </div>
              </div>
              <div className="hero-banner-image">
                <img src={bannersHero[bannerActual].img} alt="Hero Banner" />
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: CURSOS Y CLASES (AULA) */}
        <div ref={seccionCursosRef} style={{ width: '100%', scrollMarginTop: '90px' }}>
          <div className="dashboard-container">
            <div style={{ marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '24px', color: '#0f172a', margin: 0, fontWeight: 'bold' }}>MIS CLASES & LABORATORIOS</h2>
            </div>

            <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
              <div className="filter-bar-responsive" style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button onClick={() => { setModalidadFiltro('virtual'); setVideoActivo(null); setLaboratorioSeleccionado(null); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: modalidadFiltro === 'virtual' ? '#2563eb' : '#f1f5f9', color: modalidadFiltro === 'virtual' ? '#fff' : '#334155' }}>
                  Modalidad Virtual ({cursosCatalogo.filter(c => (c.tipo || 'Virtual') === 'Virtual').length})
                </button>
                <button onClick={() => { setModalidadFiltro('presencial'); setVideoActivo(null); setLaboratorioSeleccionado(null); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: modalidadFiltro === 'presencial' ? '#059669' : '#f1f5f9', color: modalidadFiltro === 'presencial' ? '#fff' : '#334155' }}>
                  Modalidad Presencial ({cursosCatalogo.filter(c => c.tipo === 'Presencial').length})
                </button>
                <input type="text" placeholder="Buscar clase o profesor..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ marginLeft: 'auto', padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', minWidth: '240px' }} />
              </div>
            </div>

            {/* REPRODUCTOR VIRTUAL */}
            {modalidadFiltro === 'virtual' && videoActivo && (
              <div style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', color: '#fff', marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, color: '#38bdf8' }}>Reproduciendo Sesión: {videoActivo.titulo}</h3>
                  <button onClick={() => setVideoActivo(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Cerrar Video</button>
                </div>
                <video controls autoPlay style={{ width: '100%', maxHeight: '420px', borderRadius: '8px', background: '#000' }}>
                  <source src={videoActivo.videoUrl || videoActivo.video_demo_url} type="video/mp4" />
                </video>
              </div>
            )}

            {/* GRILLA DE CLASES INTERNAS */}
            <div className="courses-grid-focus">
              {clasesInternasFiltradas.map((item) => {
                const esVirtual = (item.tipo || 'Virtual') === 'Virtual';
                return (
                  <div key={item.id} className="focus-card-item">
                    <div className="card-image-wrapper">
                      <img src={item.imagen_url} alt={item.titulo} />
                      <span className="badge-status">Activo</span>
                    </div>
                    <div className="card-body-content">
                      <h3>{item.titulo}</h3>
                      <p>{item.descripcion}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#475569', marginBottom: '15px' }}>
                        <span><strong>Horario:</strong> {item.horario || 'Por definir'}</span>
                        <span><strong>Docente:</strong> {item.instructor || 'Staff Académico'}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                        {esVirtual ? (
                          <>
                            <button className="card-action-btn" style={{ flex: 1 }} onClick={() => setVideoActivo(item)}>Grabación</button>
                            <a href={item.enlaceSede || '#'} target="_blank" rel="noreferrer" className="card-action-btn" style={{ flex: 1, backgroundColor: '#10b981', textDecoration: 'none' }}>Zoom</a>
                          </>
                        ) : (
                          <button className="card-action-btn" onClick={() => setLaboratorioSeleccionado(item)} style={{ backgroundColor: '#059669', width: '100%' }}>Detalles Sede</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: DOCENTES */}
        {rolUsuario === 'alumno' && (
          <div ref={seccionDocentesRef} style={{ width: '100%', scrollMarginTop: '90px' }}>
            <div className="dashboard-container">
              <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '25px' }}>
                <h2 style={{ fontSize: '24px', color: '#0f172a', margin: 0, fontWeight: 'bold' }}>DOCENTES & INSTRUCTORES</h2>
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

        {/* SECCIÓN 4: BIBLIOTECA DIGITAL FLIPBOOK (RESTAURADA) */}
        <div ref={seccionBibliotecaRef} style={{ width: '100%', scrollMarginTop: '90px' }}>
          <div className="dashboard-container">
            <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '25px' }}>
              <h2 style={{ fontSize: '24px', color: '#0f172a', margin: 0, fontWeight: 'bold' }}>BIBLIOTECA VIRTUAL (FLIPBOOK 3D)</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {listaLibros.map((libro) => (
                <div key={libro.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <img src={libro.portada} alt={libro.titulo} style={{ width: '100%', height: '210px', objectFit: 'cover' }} />
                  <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>{libro.categoria}</span>
                    <h3 style={{ fontSize: '15px', color: '#0f172a', margin: '0 0 8px 0', fontWeight: 'bold' }}>{libro.titulo}</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 15px 0' }}>Autor: {libro.autor}</p>
                    <button onClick={() => setLibroSeleccionado(libro.pdfUrl)} style={{ marginTop: 'auto', padding: '10px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                      Leer en Flipbook 3D
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECCIÓN 5: GESTIÓN DE USUARIOS (DOCENTES) */}
        {rolUsuario === 'docente' && (
          <div ref={seccionUsuariosRef} style={{ width: '100%', scrollMarginTop: '90px' }}>
            <div className="dashboard-container">
              <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '24px', color: '#0f172a', margin: 0, fontWeight: 'bold' }}>GESTIÓN DE USUARIOS Y ACCESOS</h2>
                <button onClick={abrirModalCrearUsuario} style={{ background: '#2563eb', color: '#fff', padding: '10px 18px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>+ Nuevo Usuario</button>
              </div>
              <div className="table-responsive-wrapper">
                <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '13px' }}>
                      <th style={{ padding: '14px' }}>Usuario</th>
                      <th style={{ padding: '14px' }}>Nombres</th>
                      <th style={{ padding: '14px' }}>Rol</th>
                      <th style={{ padding: '14px' }}>Estado</th>
                      <th style={{ padding: '14px', textAlign: 'right' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listaUsuarios.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '13px', color: '#1e293b' }}>
                        <td style={{ padding: '14px', fontWeight: 'bold' }}>{u.usuario}</td>
                        <td style={{ padding: '14px' }}>{u.nombres}</td>
                        <td style={{ padding: '14px' }}>{u.rol}</td>
                        <td style={{ padding: '14px' }}>{u.estado}</td>
                        <td style={{ padding: '14px', textAlign: 'right', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button onClick={() => abrirModalEditarUsuario(u)} style={{ background: '#e2e8f0', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Editar</button>
                          <button onClick={() => toggleEstadoUsuario(u.id)} style={{ background: u.estado === 'activo' ? '#fee2e2' : '#dcfce7', color: u.estado === 'activo' ? '#991b1b' : '#166534', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
                            {u.estado === 'activo' ? 'Desactivar' : 'Activar'}
                          </button>
                          <button onClick={() => { setUserToReset(u); setModalResetPass(true); }} style={{ background: '#fef3c7', color: '#b45309', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Clave</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODALES DEL AULA INTERNA */}
      {libroSeleccionado && <PdfFlipbook pdfUrl={libroSeleccionado} alCerrar={() => setLibroSeleccionado(null)} />}
      
      {laboratorioSeleccionado && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#fff', maxWidth: '700px', width: '100%', padding: '25px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#059669' }}>{laboratorioSeleccionado.titulo}</h3>
              <button onClick={() => setLaboratorioSeleccionado(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Cerrar</button>
            </div>
            <p>{laboratorioSeleccionado.descripcion}</p>
            <p><strong>Sede:</strong> {laboratorioSeleccionado.enlaceSede} | <strong>Horario:</strong> {laboratorioSeleccionado.horario}</p>
          </div>
        </div>
      )}

      {modalUsuario && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px', boxSizing: 'border-box' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '440px', padding: '25px', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>{modoEdicion ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}</h3>
            {mensajeUserMsg && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{mensajeUserMsg}</p>}
            <form onSubmit={handleGuardarUsuario} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input type="text" disabled={modoEdicion} placeholder="Usuario" value={usuarioForm.usuario} onChange={e => setUsuarioForm({...usuarioForm, usuario: e.target.value})} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: modoEdicion ? '#f1f5f9' : '#fff' }} />
              <input type="text" placeholder="Nombres completos" value={usuarioForm.nombres} onChange={e => setUsuarioForm({...usuarioForm, nombres: e.target.value})} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <select value={usuarioForm.rol} onChange={e => setUsuarioForm({...usuarioForm, rol: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <option value="alumno">Alumno</option>
                <option value="docente">Docente</option>
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, background: '#2563eb', color: '#fff', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Guardar</button>
                <button type="button" onClick={() => setModalUsuario(false)} style={{ flex: 1, background: '#e2e8f0', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalResetPass && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '390px', padding: '25px', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 8px 0' }}>Restablecer Clave</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '15px' }}>Nueva clave para <strong>{userToReset.usuario}</strong>:</p>
            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input type="password" value={newPasswordInput} onChange={e => setNewPasswordInput(e.target.value)} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, background: '#d97706', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>Actualizar</button>
                <button type="button" onClick={() => setModalResetPass(false)} style={{ flex: 1, background: '#e2e8f0', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}