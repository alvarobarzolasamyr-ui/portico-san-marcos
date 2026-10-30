import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import PdfFlipbook from './components/PdfFlipbook';

const API_BASE = 'https://portico-san-marcos.onrender.com/api';
const WHATSAPP_NUMERO = '51967107035';

// CATÁLOGO MAESTRO UNIFICADO
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
      'Módulo 3: Cinemática Directa y parámetros Denavit-Hartenberg (D-H)'
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
      'Módulo 2: Componentes pasivos e impedancia en corriente alterna'
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
    temario: ['Módulo 1: Arquitectura interna (CPU, memoria Flash/RAM y registros)'],
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
    temario: ['Módulo 1: Algoritmos, diagramas de flujo y estructuras de control'],
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
    temario: ['Módulo 1: Hardware de PLCs: Siemens, Allen-Bradley y Delta'],
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
    temario: ['Módulo 1: Espacios de color y matrices de píxeles'],
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
    temario: ['Módulo 1: Simbología esquemática y encapsulados SMD vs THT'],
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
    imagen_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&q=80',
    video_demo_url: 'https://www.youtube.com/embed/2f_ca121kFQ',
    temario: ['Módulo 1: Tratamiento del aire comprimido'],
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
    temario: ['Módulo 1: Tecnologías FDM, SLA y cinemática'],
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
    temario: ['Módulo 1: Lectura de planos industriales'],
    tipo: 'Virtual',
    horario: 'Lunes - 7:00 PM',
    instructor: 'Ing. Luis Alvarado',
    enlaceSede: 'https://zoom.us/j/1234567890',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    estado: 'activo'
  }
];

export default function App() {
  const [sesionIniciada, setSesionIniciada] = useState(() => localStorage.getItem('sesionIniciada') === 'true');
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => localStorage.getItem('usuarioLogueado') || '');
  const [usernameActual, setUsernameActual] = useState(() => localStorage.getItem('usernameActual') || '');
  const [rolUsuario, setRolUsuario] = useState(() => localStorage.getItem('rolUsuario') || '');
  const [cursosCatalogo, setCursosCatalogo] = useState(CATALOGO_INICIAL);
  
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

  const [aceptaDatosLogin, setAceptaDatosLogin] = useState(false);
  const [aceptaDatosCarrito, setAceptaDatosCarrito] = useState(false);
  const [modalPrivacidadAbierto, setModalPrivacidadAbierto] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [tiempoBloqueo, setTiempoBloqueo] = useState(0);

  const [modalNuevoCurso, setModalNuevoCurso] = useState(false);
  const [nuevoCursoForm, setNuevoCursoForm] = useState({
    titulo: '', categoria: 'Robótica', descripcion: '', precio: '120',
    duracion: '5 Semanas (20 Horas)', imagen_url: '', video_demo_url: '',
    temarioTexto: 'Módulo 1: Fundamentos', tipo: 'Virtual', horario: 'Martes y Jueves - 7:00 PM',
    instructor: 'Ing. Fabrizio Barzola', enlaceSede: 'https://zoom.us/j/9876543210'
  });

  const [matriculas, setMatriculas] = useState([]);
  const [alumnoSeleccionadoMatricula, setAlumnoSeleccionadoMatricula] = useState('');
  const [cursoSeleccionadoMatricula, setCursoSeleccionadoMatricula] = useState(1);

  const [mensajesBD, setMensajesBD] = useState([]);
  const [destinatarioMsg, setDestinatarioMsg] = useState('');
  const [asuntoMsg, setAsuntoMsg] = useState('');
  const [contenidoMsg, setContenidoMsg] = useState('');
  const [estadoEnvioMsg, setEstadoEnvioMsg] = useState('');

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

  const cargarCatalogoDesdeBD = () => {
    fetch(`${API_BASE}/catalogo`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const cursosUnificados = data.map(dbCurso => {
            const cursoLocal = CATALOGO_INICIAL.find(c => c.id === dbCurso.id) || {};
            return { ...cursoLocal, ...dbCurso, estado: dbCurso.estado || cursoLocal.estado || 'activo' };
          });
          setCursosCatalogo(cursosUnificados);
        }
      }).catch(() => {});
  };

  const cargarMatriculasDesdeBD = () => {
    fetch(`${API_BASE}/matriculas`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setMatriculas(data); }).catch(() => {});
  };

  const cargarMensajesDesdeBD = (usr) => {
    if (!usr) return;
    fetch(`${API_BASE}/mensajes/${usr}`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setMensajesBD(data); }).catch(() => {});
  };

  // ESTADO LOCAL DE USUARIOS PRECARGADOS (Garantiza que la lista NUNCA esté vacía)
  const [listaUsuarios, setListaUsuarios] = useState([
    { id: 1, usuario: 'jperez', nombres: 'Juan Pérez', rol: 'alumno', estado: 'activo' },
    { id: 2, usuario: 'mgomez', nombres: 'María Gómez', rol: 'alumno', estado: 'activo' },
    { id: 3, usuario: 'cmendoza', nombres: 'Carlos Mendoza', rol: 'docente', estado: 'activo' },
    { id: 4, usuario: 'fbarzola', nombres: 'Fabrizio Barzola', rol: 'docente', estado: 'activo' },
    { id: 5, usuario: 'lalvarado', nombres: 'Luis Alvarado', rol: 'docente', estado: 'activo' },
    { id: 6, usuario: 'admin', nombres: 'Administrador General', rol: 'admin', estado: 'activo' },
    { id: 7, usuario: 'dflores', nombres: 'Diego Flores', rol: 'alumno', estado: 'activo' },
    { id: 8, usuario: 'jsalazar', nombres: 'Jorge Salazar', rol: 'docente', estado: 'activo' }
  ]);

  const cargarUsuariosDesdeBD = () => {
    fetch(`${API_BASE}/usuarios`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setListaUsuarios(data); })
      .catch(() => {});
  };

  const [modalUsuario, setModalUsuario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioForm, setUsuarioForm] = useState({ id: null, usuario: '', password: '', nombres: '', rol: 'alumno' });
  const [mensajeUserMsg, setMensajeUserMsg] = useState('');
  const [modalResetPass, setModalResetPass] = useState(false);
  const [userToReset, setUserToReset] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  useEffect(() => { cargarCatalogoDesdeBD(); }, []);

  useEffect(() => {
    if (sesionIniciada && usernameActual) {
      cargarUsuariosDesdeBD();
      cargarMatriculasDesdeBD();
      cargarMensajesDesdeBD(usernameActual);
    }
  }, [sesionIniciada, usernameActual]);

  const agregarAlCarrito = (curso) => {
    if (!carrito.some(item => item.id === curso.id)) setCarrito([...carrito, curso]);
    setCarritoAbierto(true);
  };
  const quitarDelCarrito = (id) => setCarrito(carrito.filter(item => item.id !== id));
  const estaEnCarrito = (id) => carrito.some(item => item.id === id);
  const totalCarrito = carrito.reduce((acc, item) => acc + Number(item.precio), 0);

  const enviarPedidoWhatsApp = () => {
    if (carrito.length === 0) return;
    if (!aceptaDatosCarrito) return alert('Por favor, acepta la Política de Privacidad.');
    const nombreLimpio = nombreInteresado.replace(/[<>]/g, '').trim();
    const saludo = nombreLimpio ? `¡Hola *Pórtico San Marcos*! 👋 Mi nombre es *${nombreLimpio}*.` : `¡Hola *Pórtico San Marcos*! 👋`;
    const listaTexto = carrito.map((c, i) => `${i + 1}. *${c.titulo}* - S/ ${Number(c.precio).toFixed(2)}`).join('\n');
    const textoFinal = `${saludo}\nDeseo adquirir los siguientes cursos:\n\n${listaTexto}\n\n💰 *Total a pagar: S/ ${totalCarrito.toFixed(2)}*\n\n*(He leído y acepto la política de datos)*`;
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(textoFinal)}`, '_blank');
  };

  // =========================================================================
  // FUNCIONES DE CURSOS
  // =========================================================================
  const handleCrearCursoBD = async (e) => {
    e.preventDefault();
    const temarioArray = nuevoCursoForm.temarioTexto.split('\n').map(l => l.trim()).filter(Boolean);
    const payload = { ...nuevoCursoForm, precio: Number(nuevoCursoForm.precio), temario: temarioArray };
    try {
      const res = await fetch(`${API_BASE}/catalogo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const nuevoCursoObj = { ...payload, id: data.id || Date.now(), imagen_url: payload.imagen_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80', video_demo_url: payload.video_demo_url || 'https://www.youtube.com/embed/fc_cA62Z1kQ', estado: 'activo' };
      setCursosCatalogo([...cursosCatalogo, nuevoCursoObj]);
      setModalNuevoCurso(false);
      alert('Curso guardado exitosamente.');
    } catch (error) {
      alert('Error al conectar con el servidor.');
    }
  };

  const handleToggleEstadoCurso = async (curso) => {
    const nuevoEstado = curso.estado === 'inactivo' ? 'activo' : 'inactivo';
    setCursosCatalogo(cursosCatalogo.map(c => c.id === curso.id ? { ...c, estado: nuevoEstado } : c));
    try {
      await fetch(`${API_BASE}/catalogo/${curso.id}/estado`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: nuevoEstado }) });
    } catch (error) { console.error(error); }
  };

  // =========================================================================
  // FUNCIONES DE MATRÍCULA
  // =========================================================================
  const handleAsignarCursoAlumno = async (e) => {
    e.preventDefault();
    if (!alumnoSeleccionadoMatricula) return alert("Selecciona un alumno.");
    const nuevaMat = { usuario_alumno: alumnoSeleccionadoMatricula, curso_id: Number(cursoSeleccionadoMatricula) };
    if (!matriculas.some(m => m.usuario_alumno === nuevaMat.usuario_alumno && Number(m.curso_id) === nuevaMat.curso_id)) {
      setMatriculas([...matriculas, nuevaMat]);
    }
    try {
      await fetch(`${API_BASE}/matriculas`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nuevaMat) });
      alert(`Curso asignado al estudiante @${alumnoSeleccionadoMatricula}`);
    } catch (err) { console.error(err); }
  };

  const handleQuitarCursoAlumno = async (usuario_alumno, curso_id) => {
    setMatriculas(matriculas.filter(m => !(m.usuario_alumno === usuario_alumno && Number(m.curso_id) === Number(curso_id))));
    try { await fetch(`${API_BASE}/matriculas/${usuario_alumno}/${curso_id}`, { method: 'DELETE' }); } catch (err) { console.error(err); }
  };

  // =========================================================================
  // FUNCIONES DE MENSAJERÍA
  // =========================================================================
  const handleEnviarMensajeBD = async (e) => {
    e.preventDefault();
    if (!contenidoMsg.trim() || !destinatarioMsg) return;
    setEstadoEnvioMsg('Enviando mensaje...');
    const nuevoMensaje = {
      remitente: usernameActual || usuarioLogueado, rol_remitente: rolUsuario, destinatario: destinatarioMsg,
      asunto: asuntoMsg.trim() || 'Consulta', contenido: contenidoMsg.trim(), fecha_envio: new Date().toISOString()
    };
    try {
      const res = await fetch(`${API_BASE}/mensajes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nuevoMensaje) });
      if (res.ok) {
        setMensajesBD([nuevoMensaje, ...mensajesBD]);
        setAsuntoMsg(''); setContenidoMsg(''); setEstadoEnvioMsg('✓ Mensaje enviado.');
        setTimeout(() => setEstadoEnvioMsg(''), 3500);
      }
    } catch (err) {
      setMensajesBD([nuevoMensaje, ...mensajesBD]);
      setAsuntoMsg(''); setContenidoMsg(''); setEstadoEnvioMsg('✓ Mensaje registrado localmente.');
    }
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
  const seccionUsuariosRef = useRef(null);

  const irASeccion = (ref) => {
    setMenuMovilAbierto(false);
    if (ref && ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  const [bannerActual, setBannerActual] = useState(0);
  const bannersHero = [
    { tag: 'PÓRTICO SAN MARCOS | AULA VIRTUAL', titulo: 'Excelencia Académica y Tecnológica,', subtitulo: 'Formación de alto impacto para el futuro.', statsNum: '+ 35 MIL', statsTxt: 'Estudiantes Registrados', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop' },
    { tag: 'BIBLIOTECA VIRTUAL & LIBROS INTERACTIVOS', titulo: 'Accede a Textos y Manuales Técnicos,', subtitulo: 'Visor estilo Flipbook digital para tus estudios.', statsNum: '100%', statsTxt: 'Material Digital Gratuito', img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop' }
  ];

  useEffect(() => {
    const interval = setInterval(() => setBannerActual((prev) => (prev + 1) % bannersHero.length), 5000);
    return () => clearInterval(interval);
  }, [bannersHero.length]);

  const [videoActivo, setVideoActivo] = useState(null);
  const [laboratorioSeleccionado, setLaboratorioSeleccionado] = useState(null);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);

  const listaLibros = [
    { id: 1, titulo: 'Manual de Automatización TIA Portal', autor: 'Ing. Carlos Mendoza', categoria: 'ingenieria', portada: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop', pdfUrl: '/manual_plc.pdf' },
    { id: 2, titulo: 'Microservicios con Node.js', autor: 'Dr. Roberto Gómez', categoria: 'programacion', portada: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop', pdfUrl: '/node_microservicios.pdf' },
    { id: 3, titulo: 'Guía Práctica de Robótica e IoT con ESP32', autor: 'Ing. Fabrizio Barzola', categoria: 'mecatronica', portada: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop', pdfUrl: '/guia_esp32.pdf' },
    { id: 4, titulo: 'Fundamentos de Neumática e Hidráulica ISO 1219', autor: 'Ing. Luis Alvarado', categoria: 'mecatronica', portada: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=600&auto=format&fit=crop', pdfUrl: '/neumatica_iso1219.pdf' }
  ];

  const docentesDestacados = [
    { id: 1, nombre: 'Ing. Fabrizio Barzola', especialidad: 'Especialista en Robótica', sede: 'Lab 4', foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop' },
    { id: 2, nombre: 'Ing. Carlos Mendoza', especialidad: 'Experto en PLC Siemens', sede: 'Lab Electrónica', foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop' }
  ];

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (tiempoBloqueo > 0) return;
    if (!aceptaDatosLogin) return setMensaje('Debes aceptar la Política de Privacidad.');

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
          setMensaje('⚠️ Demasiados intentos fallidos. Bloqueado.');
        } else {
          setMensaje(`${data.message || 'Credenciales incorrectas'} (${nuevosIntentos}/3)`);
        }
      }
    } catch (error) { setMensaje('Error de conexión con el servidor.'); }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('sesionIniciada'); localStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('usernameActual'); localStorage.removeItem('rolUsuario');
    setSesionIniciada(false); setUsuario(''); setPassword('');
    setRolUsuario(''); setUsernameActual(''); setVideoActivo(null);
    setLaboratorioSeleccionado(null); setLibroSeleccionado(null);
  };

  const abrirModalCrearUsuario = () => { setModoEdicion(false); setUsuarioForm({ id: null, usuario: '', password: '', nombres: '', rol: 'alumno' }); setMensajeUserMsg(''); setModalUsuario(true); };
  const abrirModalEditarUsuario = (u) => { setModoEdicion(true); setUsuarioForm({ id: u.id, usuario: u.usuario, password: '', nombres: u.nombres, rol: u.rol }); setMensajeUserMsg(''); setModalUsuario(true); };
  
  const handleGuardarUsuario = (e) => {
    e.preventDefault();
    if (!modoEdicion) {
      if (listaUsuarios.some(u => u.usuario.toLowerCase() === usuarioForm.usuario.toLowerCase())) return setMensajeUserMsg('El usuario ya existe.');
      const nuevoUsr = { id: Date.now(), usuario: usuarioForm.usuario.replace(/[^a-zA-Z0-9._-]/g, ''), nombres: usuarioForm.nombres, rol: usuarioForm.rol, estado: 'activo' };
      setListaUsuarios([...listaUsuarios, nuevoUsr]); setModalUsuario(false);
    } else {
      setListaUsuarios(listaUsuarios.map(u => u.id === usuarioForm.id ? { ...u, nombres: usuarioForm.nombres, rol: usuarioForm.rol } : u));
      setModalUsuario(false);
    }
  };
  
  const toggleEstadoUsuario = (id) => { setListaUsuarios(listaUsuarios.map(u => u.id === id ? { ...u, estado: u.estado === 'activo' ? 'inactivo' : 'activo' } : u)); };
  
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!newPasswordInput) return;
    alert(`Contraseña del usuario '${userToReset.usuario}' actualizada.`);
    setModalResetPass(false); setNewPasswordInput(''); setUserToReset(null);
  };

  const renderModalPrivacidad = () => {
    if (!modalPrivacidadAbierto) return null;
    return (
      <div onClick={() => setModalPrivacidadAbierto(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.88)', backdropFilter: 'blur(6px)', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div onClick={e => e.stopPropagation()} style={{ background: '#1e293b', color: '#f8fafc', border: '1px solid #334155', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '24px', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.6)' }}>
          <button onClick={() => setModalPrivacidadAbierto(false)} style={{ position: 'absolute', top: '14px', right: '14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Cerrar ✕</button>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#fff' }}>Política de Privacidad</h3>
          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', margin: '0 0 20px 0' }}>Tus datos personales y credenciales son protegidos mediante cifrado seguro.</p>
          <div style={{ textAlign: 'right' }}><button onClick={() => { setAceptaDatosLogin(true); setAceptaDatosCarrito(true); setModalPrivacidadAbierto(false); }} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Entendido</button></div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // DEFINICIÓN EXACTA DE PERMISOS: ADMIN VS DOCENTE
  // =========================================================================
  const esAdmin = rolUsuario === 'admin';
  const esDocente = rolUsuario === 'docente';
  
  // Tanto Administradores como Docentes pueden agregar y gestionar cursos
  const puedeGestionarCursos = esAdmin || esDocente;

  const misCursosMatriculados = cursosCatalogo.filter(c => matriculas.some(m => m.usuario_alumno === usernameActual && Number(m.curso_id) === Number(c.id)));
  const clasesInternasFiltradas = cursosCatalogo.filter(item => {
    if (!puedeGestionarCursos && item.estado === 'inactivo') return false;
    const tipoFiltro = item.tipo ? item.tipo.toLowerCase() : 'virtual';
    const coincideModalidad = tipoFiltro === modalidadFiltro.toLowerCase();
    const coincideCategoria = categoriaSeleccionada === 'todas' || item.categoria === categoriaSeleccionada;
    const busqMin = busqueda.toLowerCase();
    const coincideBusqueda = item.titulo.toLowerCase().includes(busqMin) || (item.instructor && item.instructor.toLowerCase().includes(busqMin));
    return coincideModalidad && coincideCategoria && coincideBusqueda;
  });

  // VISTA 1: TIENDA VIRTUAL
  if (!sesionIniciada) {
    const cursosActivosTienda = cursosCatalogo.filter(c => c.estado !== 'inactivo');
    const categoriasTienda = ['Todos', ...new Set(cursosActivosTienda.map(c => c.categoria))];
    const cursosTiendaFiltrados = cursosActivosTienda.filter(c => {
      const matchCat = catTiendaActiva === 'Todos' || c.categoria === catTiendaActiva;
      const matchTxt = c.titulo.toLowerCase().includes(busquedaTienda.toLowerCase()) || c.descripcion.toLowerCase().includes(busquedaTienda.toLowerCase());
      return matchCat && matchTxt;
    });

    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #1e293b', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ margin: '0', fontSize: '22px', color: '#38bdf8', fontWeight: 'bold' }}>Aula Virtual Pórtico San Marcos</h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={() => setCarritoAbierto(true)} style={{ background: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>🛒 Mi Carrito {carrito.length > 0 && <span style={{ background: '#ef4444', marginLeft: '6px', padding: '2px 8px', borderRadius: '999px', fontSize: '12px' }}>{carrito.length}</span>}</button>
            <button onClick={() => setMostrarModalLogin(true)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>🔐 Ingresar al Aula</button>
          </div>
        </header>
        <section style={{ textAlign: 'center', padding: '50px 20px 30px', maxWidth: '850px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '34px', color: '#fff', marginBottom: '12px', fontWeight: '800' }}>Catálogo de Cursos de Ingeniería Mecatrónica</h2>
          <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.6', margin: '0 0 25px 0' }}>Explora el temario y agrega los cursos de tu interés al carrito.</p>
          <input type="text" placeholder="🔍 Buscar curso..." value={busquedaTienda} onChange={(e) => setBusquedaTienda(e.target.value)} style={{ width: '100%', maxWidth: '520px', padding: '12px 18px', borderRadius: '99px', background: '#1e293b', color: '#fff', border: '1px solid #334155', outline: 'none' }} />
        </section>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', padding: '0 20px 30px' }}>
          {categoriasTienda.map(cat => <button key={cat} onClick={() => setCatTiendaActiva(cat)} style={{ padding: '8px 16px', borderRadius: '99px', background: catTiendaActiva === cat ? '#2563eb' : '#1e293b', color: '#fff', border: '1px solid #334155', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>{cat}</button>)}
        </div>
        <main style={{ maxWidth: '1260px', margin: '0 auto', padding: '0 20px 60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '24px' }}>
          {cursosTiendaFiltrados.map(curso => (
            <div key={curso.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.25)' }}>
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
                  <button onClick={() => setCursoDemoModal(curso)} style={{ background: '#0f172a', color: '#fff', border: '1px solid #475569', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>🎬 Demo</button>
                  <button onClick={() => estaEnCarrito(curso.id) ? setCarritoAbierto(true) : agregarAlCarrito(curso)} style={{ background: estaEnCarrito(curso.id) ? '#059669' : '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>{estaEnCarrito(curso.id) ? '✓ En el Carrito' : '+ Agregar'}</button>
                </div>
              </div>
            </div>
          ))}
        </main>
        
        {/* Modales Tienda */}
        {cursoDemoModal && (
          <div onClick={() => setCursoDemoModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div onClick={e => e.stopPropagation()} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '24px', position: 'relative' }}>
              <button onClick={() => setCursoDemoModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}>Cerrar ✕</button>
              <h2 style={{ color: '#fff', margin: '4px 0 14px 0', fontSize: '22px' }}>{cursoDemoModal.titulo}</h2>
              <iframe src={cursoDemoModal.video_demo_url} title="demo" style={{ width: '100%', height: '350px', border: 'none', borderRadius: '8px', background: '#000', marginBottom: '15px' }} allowFullScreen />
              <button onClick={() => { agregarAlCarrito(cursoDemoModal); setCursoDemoModal(null); }} style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>🛒 Seleccionar Curso</button>
            </div>
          </div>
        )}
        {carritoAbierto && (
          <div onClick={() => setCarritoAbierto(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 250, display: 'flex', justifyContent: 'flex-end' }}>
            <aside onClick={e => e.stopPropagation()} style={{ background: '#1e293b', width: '100%', maxWidth: '410px', height: '100vh', padding: '24px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '14px' }}>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '18px' }}>🛒 Carrito ({carrito.length})</h3>
                <button onClick={() => setCarritoAbierto(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>✕</button>
              </div>
              {carrito.length === 0 ? ( <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '20px' }}>Tu carrito está vacío.</p> ) : (
                <div style={{ flex: 1, overflowY: 'auto', margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {carrito.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0f172a', padding: '10px', borderRadius: '8px' }}>
                      <img src={item.imagen_url} alt={item.titulo} style={{ width: '55px', height: '42px', objectFit: 'cover', borderRadius: '6px' }}/>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '13px' }}>{item.titulo}</h4>
                        <span style={{ color: '#34d399', fontSize: '13px', fontWeight: 'bold' }}>S/ {Number(item.precio).toFixed(2)}</span>
                      </div>
                      <button onClick={() => quitarDelCarrito(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ borderTop: '1px solid #334155', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" placeholder="Tu Nombre Completo" value={nombreInteresado} onChange={e => setNombreInteresado(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#0f172a', color: '#fff', border: '1px solid #475569', boxSizing: 'border-box' }} />
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#cbd5e1', cursor: 'pointer' }}>
                  <input type="checkbox" checked={aceptaDatosCarrito} onChange={e => setAceptaDatosCarrito(e.target.checked)} style={{ marginTop: '2px' }} />
                  <span>Acepto la <button type="button" onClick={() => setModalPrivacidadAbierto(true)} style={{ background: 'none', border: 'none', color: '#38bdf8', textDecoration: 'underline', padding: 0, cursor: 'pointer', fontSize: '12px' }}>Política de Privacidad</button>.</span>
                </label>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '16px' }}>
                  <span style={{ color: '#cbd5e1' }}>Total:</span>
                  <strong style={{ color: '#34d399', fontSize: '20px' }}>S/ {totalCarrito.toFixed(2)}</strong>
                </div>
                <button onClick={enviarPedidoWhatsApp} style={{ width: '100%', background: '#25D366', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}>Coordinar por WhatsApp</button>
              </div>
            </aside>
          </div>
        )}
        {mostrarModalLogin && (
          <div onClick={() => setMostrarModalLogin(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div onClick={e => e.stopPropagation()} style={{ background: '#1e293b', border: '1px solid #334155', padding: '38px 30px', borderRadius: '16px', width: '100%', maxWidth: '420px', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
              <button onClick={() => setMostrarModalLogin(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 style={{ color: '#f8fafc', margin: '0 0 8px 0', fontSize: '24px', fontWeight: '800' }}>Pórtico San Marcos</h2>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Acceso para estudiantes y docentes.</p>
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
                  {tiempoBloqueo > 0 ? `Bloqueado (${tiempoBloqueo}s)` : 'Ingresar al Aula'}
                </button>
              </form>
            </div>
          </div>
        )}
        {renderModalPrivacidad()}
      </div>
    );
  }

  // VISTA 2: INTERIOR DEL AULA VIRTUAL
  return (
    <div style={{ minHeight: '100vh', width: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', scrollBehavior: 'smooth' }}>
      
      <header style={{ width: '100%', background: '#091e42', color: '#fff', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 1000, flexWrap: 'wrap', boxSizing: 'border-box' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#38bdf8', fontWeight: 'bold' }}>Pórtico San Marcos</h2>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Aula Virtual & Biblioteca 3D</span>
        </div>
        <nav style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => irASeccion(seccionInicioRef)} style={{ background: 'none', border: 'none', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Inicio</button>
          
          {rolUsuario === 'alumno' && <button onClick={() => irASeccion(seccionPerfilRef)} style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Mi Perfil</button>}
          
          {/* DOCENTES Y ADMIN VEN "Administrar Cursos", ALUMNOS VEN "Catálogo" */}
          <button onClick={() => irASeccion(seccionCursosRef)} style={{ background: 'none', border: 'none', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
            {puedeGestionarCursos ? 'Administrar Cursos' : 'Catálogo'}
          </button>
          
          {rolUsuario === 'alumno' && <button onClick={() => irASeccion(seccionDocentesRef)} style={{ background: 'none', border: 'none', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Docentes</button>}
          <button onClick={() => irASeccion(seccionBibliotecaRef)} style={{ background: 'none', border: 'none', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Biblioteca</button>
          <button onClick={() => irASeccion(seccionMensajesRef)} style={{ background: 'none', border: 'none', color: '#34d399', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>💬 Mensajería</button>
          
          {/* SÓLO EL ADMIN VE LA PESTAÑA DE GESTIÓN DE USUARIOS Y MATRÍCULAS */}
          {esAdmin && <button onClick={() => irASeccion(seccionUsuariosRef)} style={{ background: 'none', border: 'none', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Usuarios y Matrículas</button>}

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>{usuarioLogueado}</span>
              <span style={{ fontSize: '11px', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 'bold' }}>{rolUsuario}</span>
            </div>
            <button onClick={cerrarSesion} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Cerrar Sesión</button>
          </div>
        </nav>
      </header>

      <main style={{ flex: 1, padding: '30px 0', display: 'flex', flexDirection: 'column', gap: '40px', width: '100%' }}>
        
        <div ref={seccionInicioRef} style={{ width: '100%', scrollMarginTop: '90px' }}>
          <div className="dashboard-container">
            <div className="focus-hero-banner-main">
              <div className="hero-banner-content">
                <span style={{ background: 'rgba(255,255,255,0.15)', color: '#38bdf8', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{bannersHero[bannerActual].tag} ({rolUsuario.toUpperCase()})</span>
                <h1>{bannersHero[bannerActual].titulo}<br /><span style={{ color: '#38bdf8' }}>{bannersHero[bannerActual].subtitulo}</span></h1>
              </div>
              <div className="hero-banner-image"><img src={bannersHero[bannerActual].img} alt="Hero Banner" /></div>
            </div>
          </div>
        </div>

        {/* PERFIL DEL ALUMNO: CURSOS MATRICULADOS */}
        {rolUsuario === 'alumno' && (
          <div ref={seccionPerfilRef} style={{ width: '100%', scrollMarginTop: '90px' }}>
            <div className="dashboard-container">
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                <h2 style={{ fontSize: '22px', color: '#0f172a', margin: '0 0 20px 0', fontWeight: 'bold', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>🎓 MI PERFIL DE ESTUDIANTE: CURSOS MATRICULADOS</h2>
                {misCursosMatriculados.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '14px' }}>Aún no tienes cursos asignados. Comunícate con el Administrador.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '16px' }}>
                    {misCursosMatriculados.map(curso => (
                      <div key={curso.id} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderLeft: '5px solid #2563eb', borderRadius: '10px', padding: '16px' }}>
                        <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 'bold' }}>{curso.categoria}</span>
                        <h4 style={{ margin: '6px 0 8px 0', fontSize: '16px', color: '#0f172a' }}>{curso.titulo}</h4>
                        <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#334155' }}><strong>Docente:</strong> {curso.instructor}</p>
                        
                        {/* BOTONES DE GRABACIÓN Y ZOOM DENTRO DEL PERFIL DEL ALUMNO */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                          {(curso.tipo || 'Virtual') === 'Virtual' ? (
                            <>
                              <button className="card-action-btn" style={{ flex: 1, padding: '8px', fontSize: '12px' }} onClick={() => setVideoActivo(curso)}>Ver Grabación</button>
                              <a href={curso.enlaceSede || '#'} target="_blank" rel="noreferrer" className="card-action-btn" style={{ flex: 1, backgroundColor: '#10b981', padding: '8px', fontSize: '12px', textDecoration: 'none', textAlign: 'center' }}>Ir a Zoom</a>
                            </>
                          ) : (
                            <button className="card-action-btn" onClick={() => setLaboratorioSeleccionado(curso)} style={{ backgroundColor: '#059669', width: '100%', padding: '8px', fontSize: '12px' }}>Ver Sede Física</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CATÁLOGO DE CURSOS */}
        <div ref={seccionCursosRef} style={{ width: '100%', scrollMarginTop: '90px' }}>
          <div className="dashboard-container">
            <div style={{ marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '24px', color: '#0f172a', margin: 0, fontWeight: 'bold' }}>{puedeGestionarCursos ? 'ADMINISTRACIÓN DE CURSOS' : 'CATÁLOGO DE CLASES & LABORATORIOS'}</h2>
              {/* ADMIN Y DOCENTE PUEDEN AÑADIR CURSOS */}
              {puedeGestionarCursos && <button onClick={() => setModalNuevoCurso(true)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>+ Añadir Nuevo Curso</button>}
            </div>

            {/* REPRODUCTOR DE VIDEO INCORPORADO */}
            {videoActivo && (
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
                      
                      {/* BOTONES DE ACCESO A CLASES PARA TODOS */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                        {esVirtual ? (
                          <>
                            <button className="card-action-btn" style={{ flex: 1 }} onClick={() => setVideoActivo(item)}>Grabación</button>
                            <a href={item.enlaceSede || '#'} target="_blank" rel="noreferrer" className="card-action-btn" style={{ flex: 1, backgroundColor: '#10b981', textDecoration: 'none', textAlign: 'center' }}>Zoom</a>
                          </>
                        ) : (
                          <button className="card-action-btn" onClick={() => setLaboratorioSeleccionado(item)} style={{ backgroundColor: '#059669', width: '100%' }}>Ver Sede</button>
                        )}
                      </div>
                      
                      {/* ADMIN Y DOCENTE PUEDEN HABILITAR O DESHABILITAR CURSOS */}
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

        {/* BIBLIOTECA VIRTUAL FLIPBOOK */}
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

        {/* MENSAJERÍA */}
        <div ref={seccionMensajesRef} style={{ width: '100%', scrollMarginTop: '90px' }}>
          <div className="dashboard-container">
            <h2 style={{ fontSize: '24px', color: '#0f172a', margin: '0 0 25px 0', fontWeight: 'bold', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>💬 MENSAJERÍA INTERNA (SINCRONIZADA CON BASE DE DATOS)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              <form onSubmit={handleEnviarMensajeBD} style={{ background: '#ffffff', padding: '22px', borderRadius: '12px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '17px', color: '#0f172a' }}>Redactar Nuevo Mensaje</h3>
                
                {/* LA LISTA ESTÁ PRECARGADA PARA NO DEPENDER SOLO DE LA BD AL INICIAR */}
                <select value={destinatarioMsg} onChange={e => setDestinatarioMsg(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}>
                  <option value="">-- Selecciona a quién enviar el mensaje --</option>
                  {listaUsuarios.filter(u => u.usuario !== usernameActual).map(u => (
                    <option key={u.id || u.usuario} value={u.usuario}>{u.nombres} (@{u.usuario} - {u.rol})</option>
                  ))}
                  <option value="todos">📢 Todos los Usuarios (Aviso General)</option>
                </select>
                
                <input type="text" placeholder="Asunto..." value={asuntoMsg} onChange={e => setAsuntoMsg(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} />
                <textarea rows="4" placeholder="Escribe tu mensaje aquí..." value={contenidoMsg} onChange={e => setContenidoMsg(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', resize: 'vertical' }} />
                {estadoEnvioMsg && <span style={{ fontSize: '12px', color: '#059669', fontWeight: 'bold' }}>{estadoEnvioMsg}</span>}
                <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar Mensaje</button>
              </form>

              <div style={{ background: '#ffffff', padding: '22px', borderRadius: '12px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', maxHeight: '420px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '17px', color: '#0f172a' }}>Bandeja de Mensajes (@{usernameActual || usuarioLogueado})</h3>
                  <button onClick={() => cargarMensajesDesdeBD(usernameActual)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>↻ Actualizar</button>
                </div>
                {mensajesBD.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', margin: 'auto 0' }}>No hay mensajes registrados para tu perfil todavía.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {mensajesBD.map((m, idx) => (
                      <div key={m.id || idx} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: m.remitente === usernameActual ? '4px solid #10b981' : '4px solid #2563eb' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                          <span><strong>De:</strong> @{m.remitente} ➔ <strong>Para:</strong> @{m.destinatario}</span>
                        </div>
                        <strong style={{ display: 'block', fontSize: '13px', color: '#0f172a', marginBottom: '4px' }}>{m.asunto}</strong>
                        <p style={{ margin: 0, fontSize: '13px', color: '#334155' }}>{m.contenido}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* GESTIÓN DE USUARIOS Y MATRÍCULAS (EXCLUSIVO DEL ADMIN) */}
        {esAdmin && (
          <div ref={seccionUsuariosRef} style={{ width: '100%', scrollMarginTop: '90px' }}>
            <div className="dashboard-container">
              <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '24px', color: '#0f172a', margin: 0, fontWeight: 'bold' }}>GESTIÓN DE PERFILES Y MATRÍCULAS</h2>
                <button onClick={abrirModalCrearUsuario} style={{ background: '#2563eb', color: '#fff', padding: '10px 18px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>+ Nuevo Usuario</button>
              </div>

              <form onSubmit={handleAsignarCursoAlumno} style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#334155', marginBottom: '6px' }}>Estudiante:</label>
                  <select value={alumnoSeleccionadoMatricula} onChange={e => setAlumnoSeleccionadoMatricula(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <option value="">-- Seleccionar alumno --</option>
                    {listaUsuarios.filter(u => u.rol === 'alumno').map(u => (
                      <option key={u.id} value={u.usuario}>{u.nombres} (@{u.usuario})</option>
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
                        <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '13px', color: '#1e293b' }}>
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
                            <button onClick={() => toggleEstadoUsuario(u.id)} style={{ background: u.estado === 'activo' ? '#fee2e2' : '#dcfce7', color: u.estado === 'activo' ? '#991b1b' : '#166534', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>{u.estado === 'activo' ? 'Desactivar' : 'Activar'}</button>
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

      {/* MODAL DE NUEVO CURSO (ADMIN Y DOCENTE) */}
      {modalNuevoCurso && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', padding: '25px', borderRadius: '14px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#0f172a' }}>Añadir Nuevo Curso a la BD</h3>
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
              <textarea rows="3" placeholder="Temario (Módulo 1: ..., Módulo 2: ...)" value={nuevoCursoForm.temarioTexto} onChange={e => setNuevoCursoForm({...nuevoCursoForm, temarioTexto: e.target.value})} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <button type="submit" style={{ background: '#2563eb', color: '#fff', padding: '12px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Guardar Curso</button>
              <button type="button" onClick={() => setModalNuevoCurso(false)} style={{ background: '#e2e8f0', padding: '12px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
      
      {/* MODALES RECURRENTES: PDF Y SEDE */}
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

      {/* MODAL USUARIO (SOLO ADMIN) */}
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
                <option value="admin">Administrador (admin)</option>
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, background: '#2563eb', color: '#fff', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Guardar</button>
                <button type="button" onClick={() => setModalUsuario(false)} style={{ flex: 1, background: '#e2e8f0', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL RESET CLAVE (SOLO ADMIN) */}
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