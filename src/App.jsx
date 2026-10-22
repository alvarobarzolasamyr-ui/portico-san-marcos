import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import PdfFlipbook from './components/PdfFlipbook';

export default function App() {
  // Persistencia de sesión
  const [sesionIniciada, setSesionIniciada] = useState(() => {
    return localStorage.getItem('sesionIniciada') === 'true';
  });
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
    return localStorage.getItem('usuarioLogueado') || '';
  });
  const [rolUsuario, setRolUsuario] = useState(() => {
    return localStorage.getItem('rolUsuario') || '';
  });

  const [modalidadFiltro, setModalidadFiltro] = useState('virtual'); 
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  
  // REFERENCIAS PARA EL DESPLAZAMIENTO FLUIDO (SMOOTH SCROLL)
  const seccionInicioRef = useRef(null);
  const seccionCursosRef = useRef(null);
  const seccionDocentesRef = useRef(null);
  const seccionBibliotecaRef = useRef(null);
  const seccionUsuariosRef = useRef(null);

  const irASeccion = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  // CARRUSEL DE BANNERS HERO CON PUNTITOS
  const [bannerActual, setBannerActual] = useState(0);
  const bannersHero = [
    {
      tag: 'PÓRTICO SAN MARCOS | AULA VIRTUAL',
      titulo: 'Excelencia Académica y Tecnológica,',
      subtitulo: 'Formación de alto impacto para el futuro.',
      statsNum: '+ 35 MIL',
      statsTxt: 'Estudiantes Registrados',
      img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop'
    },
    {
      tag: 'BIBLIOTECA VIRTUAL & LIBROS INTERACTIVOS',
      titulo: 'Accede a Textos y Manuales Técnicos,',
      subtitulo: 'Visor estilo Flipbook digital para tus estudios.',
      statsNum: '100%',
      statsTxt: 'Material Digital Gratuito',
      img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop'
    },
    {
      tag: 'LABORATORIOS DE AUTOMATIZACIÓN Y ROBÓTICA',
      titulo: 'Sesiones Prácticas en Banco de Pruebas,',
      subtitulo: 'Infraestructura acreditada de primer nivel.',
      statsNum: '+ 150',
      statsTxt: 'Prácticas Habilitadas',
      img: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerActual((prev) => (prev + 1) % bannersHero.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannersHero.length]);

  // ESTADOS MULTIMEDIA Y MODALES
  const [videoActivo, setVideoActivo] = useState(null);
  const [laboratorioSeleccionado, setLaboratorioSeleccionado] = useState(null);

  // ESTADO Y MODAL DE LIBROS (FLIPBOOK PDF REAL)
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);

  // LISTADO DE LIBROS FIJOS VINCULADOS A LA CARPETA /public
  const listaLibros = [
    {
      id: 1,
      titulo: 'Manual de Automatización e Industria 4.0 con TIA Portal',
      autor: 'Ing. Carlos Mendoza',
      categoria: 'ingenieria',
      portada: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop',
      pdfUrl: '/manual_plc.pdf'
    },
    {
      id: 2,
      titulo: 'Arquitectura Limpia y Microservicios con Node.js',
      autor: 'Dr. Roberto Gómez',
      categoria: 'programacion',
      portada: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop',
      pdfUrl: '/node_microservicios.pdf'
    },
    {
      id: 3,
      titulo: 'Guía Práctica de Robótica e IoT con ESP32',
      autor: 'Ing. Fabrizio Barzola',
      categoria: 'mecatronica',
      portada: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop',
      pdfUrl: '/guia_esp32.pdf'
    },
    {
      id: 4,
      titulo: 'Fundamentos de Neumática e Hidráulica ISO 1219',
      autor: 'Ing. Luis Alvarado',
      categoria: 'mecatronica',
      portada: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=600&auto=format&fit=crop',
      pdfUrl: '/neumatica_iso1219.pdf'
    }
  ];

  // LOGIN STATES
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  // LISTA DE DOCENTES
  const docentesDestacados = [
    { id: 1, nombre: 'Ing. Fabrizio Barzola', especialidad: 'Especialista en Robótica, ESP32 y Microcontroladores', sede: 'Campus Central - Lab 4', foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop' },
    { id: 2, nombre: 'Ing. Carlos Mendoza', especialidad: 'Experto en PLC Siemens TIA Portal y Electrónica de Potencia', sede: 'Campus Central - Lab Electrónica', foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop' },
    { id: 3, nombre: 'Ing. Luis Alvarado', especialidad: 'Consultor en Neumática, Electroneumática e ISO 1219', sede: 'Sede Arequipa - Pabellón B', foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop' },
    { id: 4, nombre: 'Dra. María Fernández', especialidad: 'Doctora en Procesamiento Digital de Señales y MATLAB', sede: 'Campus Virtual', foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop' }
  ];

  // MÓDULO DE USUARIOS
  const [listaUsuarios, setListaUsuarios] = useState([
    { id: 1, usuario: 'jperez', nombres: 'Juan Pérez', rol: 'alumno', estado: 'activo' },
    { id: 2, usuario: 'mgomez', nombres: 'María Gómez', rol: 'alumno', estado: 'activo' },
    { id: 3, usuario: 'cmendoza', nombres: 'Carlos Mendoza', rol: 'docente', estado: 'activo' },
    { id: 4, usuario: 'fbarzola', nombres: 'Fabrizio Barzola', rol: 'docente', estado: 'activo' },
    { id: 5, usuario: 'lalvarado', nombres: 'Luis Alvarado', rol: 'docente', estado: 'activo' }
  ]);

  const [modalUsuario, setModalUsuario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioForm, setUsuarioForm] = useState({ id: null, usuario: '', password: '', nombres: '', rol: 'alumno' });
  const [mensajeUserMsg, setMensajeUserMsg] = useState('');

  const [modalResetPass, setModalResetPass] = useState(false);
  const [userToReset, setUserToReset] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // CLASES Y CURSOS
  const [listaClases, setListaClases] = useState([
    { id: 1, titulo: 'Asesoría en Automatización y PLC TIA Portal', tipo: 'Virtual', categoria: 'ingenieria', horario: 'Martes y Jueves - 7:00 PM', instructor: 'Ing. Carlos Mendoza', desc: 'Clases en vivo resolviendo lógica de contactos y programación PID.', enlaceSede: 'https://zoom.us/j/9876543210', videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4', imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop' },
    { id: 2, titulo: 'Fundamentos de Microservicios en Node.js', tipo: 'Virtual', categoria: 'programacion', horario: 'Lunes y Miércoles - 8:00 PM', instructor: 'Dr. Roberto Gómez', desc: 'Arquitectura limpia y conexión a base de datos MySQL.', enlaceSede: 'https://meet.google.com/abc-defg-hij', videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4', imgUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop' },
    { id: 3, titulo: 'Control de Sistemas de Eventos Discretos', tipo: 'Virtual', categoria: 'ingenieria', horario: 'Sábados - 3:00 PM', instructor: 'Ing. Carlos Mendoza', desc: 'Modelado usando Redes de Petri y supervisión SCADA.', enlaceSede: 'https://zoom.us/j/1234567890', videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', imgUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop' },
    { id: 4, titulo: 'Procesamiento Digital de Señales en MATLAB', tipo: 'Virtual', categoria: 'programacion', horario: 'Viernes - 6:00 PM', instructor: 'Dra. María Fernández', desc: 'Análisis de transformadas de Fourier y diseño de filtros.', enlaceSede: 'https://zoom.us/j/5556667770', videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4', imgUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop' },
    { id: 5, titulo: 'Clase Magistral de Robótica con ESP32', tipo: 'Presencial', categoria: 'mecatronica', horario: 'Lunes y Miércoles - 6:00 PM', instructor: 'Ing. Fabrizio Barzola', desc: 'Implementación de sensores y control de servomotores IoT en banco de pruebas físico.', enlaceSede: 'Campus Central - Laboratorio 4', ubicacionImg: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop', imgUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop' },
    { id: 6, titulo: 'Laboratorio de Neumática y Electroneumática', tipo: 'Presencial', categoria: 'mecatronica', horario: 'Martes - 4:00 PM', instructor: 'Ing. Luis Alvarado', desc: 'Simulación FluidSIM e implementación física en banco de pruebas neumáticas ISO 1219.', enlaceSede: 'Sede Arequipa - Pabellón B - Lab 2', ubicacionImg: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop', imgUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=600&auto=format&fit=crop' },
    { id: 7, titulo: 'Taller de Ensamblaje e Impresión 3D', tipo: 'Presencial', categoria: 'mecatronica', horario: 'Jueves - 5:00 PM', instructor: 'Ing. Fabrizio Barzola', desc: 'Diseño en Tinkercad, calibración de extrusores e impresión física de partes mecánicas.', enlaceSede: 'Campus Central - Taller Mecánico', ubicacionImg: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop', imgUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=600&auto=format&fit=crop' },
    { id: 8, titulo: 'Sistemas Electrónicos de Potencia y Rectificadores', tipo: 'Presencial', categoria: 'potencia', horario: 'Viernes - 7:00 PM', instructor: 'Ing. Carlos Mendoza', desc: 'Mediciones de THD, factor de rizado y pruebas con tiristores usando osciloscopio de banco.', enlaceSede: 'Campus Central - Laboratorio de Electrónica', ubicacionImg: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop', imgUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop' }
  ]);

  const guardarSesionLocal = (nombres, rol) => {
    localStorage.setItem('sesionIniciada', 'true');
    localStorage.setItem('usuarioLogueado', nombres);
    localStorage.setItem('rolUsuario', rol);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMensaje('Verificando credenciales...');

    try {
      const response = await fetch('https://portico-san-marcos.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
      });
      
      const data = await response.json();

      if (response.ok && data.success) {
        const nombreUsr = data.user.nombres || data.user.usuario;
        const rolUsr = data.user.rol || 'alumno';

        setUsuarioLogueado(nombreUsr);
        setRolUsuario(rolUsr);
        setSesionIniciada(true); 
        setMensaje('');

        guardarSesionLocal(nombreUsr, rolUsr);
      } else {
        setMensaje(data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor backend');
    }
  };

  const cerrarSesion = () => {
    localStorage.clear();
    setSesionIniciada(false);
    setUsuario('');
    setPassword('');
    setRolUsuario('');
    setVideoActivo(null);
    setLaboratorioSeleccionado(null);
    setLibroSeleccionado(null);
  };

  // FUNCIONES DE USUARIO
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

  const handleGuardarUsuario = (e) => {
    e.preventDefault();
    setMensajeUserMsg('');

    if (!modoEdicion) {
      const existe = listaUsuarios.some(
        u => u.usuario.toLowerCase() === usuarioForm.usuario.toLowerCase()
      );
      if (existe) {
        setMensajeUserMsg('El nombre de usuario ya existe en la base de datos.');
        return;
      }

      const nuevo = { id: Date.now(), usuario: usuarioForm.usuario, nombres: usuarioForm.nombres, rol: usuarioForm.rol, estado: 'activo' };
      setListaUsuarios([...listaUsuarios, nuevo]);
      setModalUsuario(false);
    } else {
      setListaUsuarios(listaUsuarios.map(u => 
        u.id === usuarioForm.id ? { ...u, nombres: usuarioForm.nombres, rol: usuarioForm.rol } : u
      ));
      setModalUsuario(false);
    }
  };

  const toggleEstadoUsuario = (id) => {
    setListaUsuarios(listaUsuarios.map(u => {
      if (u.id === id) {
        const nuevoEstado = u.estado === 'activo' ? 'inactivo' : 'activo';
        return { ...u, estado: nuevoEstado };
      }
      return u;
    }));
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!newPasswordInput) return;
    alert(`Contraseña del usuario '${userToReset.usuario}' restablecida con éxito.`);
    setModalResetPass(false);
    setNewPasswordInput('');
    setUserToReset(null);
  };

  // FILTRADO DE CLASES
  const clasesFiltradas = listaClases.filter(item => {
    const coincideModalidad = item.tipo.toLowerCase() === modalidadFiltro.toLowerCase();
    const coincideCategoria = categoriaSeleccionada === 'todas' || item.categoria === categoriaSeleccionada;
    const coincideBusqueda = item.titulo.toLowerCase().includes(busqueda.toLowerCase()) || 
                             item.instructor.toLowerCase().includes(busqueda.toLowerCase());

    return coincideModalidad && coincideCategoria && coincideBusqueda;
  });

  // VISTA DE LOGIN FORMAL Y LIMPIO
  if (!sesionIniciada) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a', padding: '20px' }}>
        <div style={{ background: '#ffffff', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 50px rgba(0,0,0,0.35)', border: '1px solid #1e293b' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#0f172a', margin: '0 0 6px 0', fontSize: '22px', fontWeight: 'bold' }}>Pórtico San Marcos</h2>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0, fontWeight: '500' }}>Sistema de Gestión Académica & Aula Virtual</p>
          </div>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>Usuario:</label>
              <input 
                type="text" 
                value={usuario} 
                onChange={(e) => setUsuario(e.target.value)} 
                required 
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>Contraseña:</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            {mensaje && (
              <div style={{ color: mensaje.includes('exitoso') || mensaje.includes('Verificando') ? '#0284c7' : '#ef4444', fontSize: '13px', textAlign: 'center', fontWeight: 'bold' }}>
                {mensaje}
              </div>
            )}

            <button type="submit" style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginTop: '5px' }}>
              Ingresar al Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', scrollBehavior: 'smooth' }}>
      
      {/* NAVBAR SUPERIOR FIJO */}
      <header style={{ background: '#0f172a', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '16px', color: '#38bdf8' }}>Pórtico San Marcos</h2>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Aula Virtual & Biblioteca 3D</span>
          </div>
        </div>

        {/* PESTAÑAS CON PESTAÑA CURSOS INCLUIDA */}
        <nav style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
          <button 
            onClick={() => irASeccion(seccionInicioRef)}
            style={{ background: 'none', border: 'none', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
          >
            Inicio
          </button>

          <button 
            onClick={() => irASeccion(seccionCursosRef)}
            style={{ background: 'none', border: 'none', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
          >
            Cursos
          </button>
          
          {rolUsuario === 'alumno' && (
            <button 
              onClick={() => irASeccion(seccionDocentesRef)}
              style={{ background: 'none', border: 'none', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
            >
              Docentes
            </button>
          )}

          <button 
            onClick={() => irASeccion(seccionBibliotecaRef)}
            style={{ background: 'none', border: 'none', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
          >
            Biblioteca 3D
          </button>

          {rolUsuario === 'docente' && (
            <button 
              onClick={() => irASeccion(seccionUsuariosRef)}
              style={{ background: 'none', border: 'none', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
            >
              Usuarios
            </button>
          )}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>{usuarioLogueado}</span>
            <span style={{ fontSize: '11px', color: '#38bdf8', textTransform: 'uppercase' }}>{rolUsuario}</span>
          </div>
          <button onClick={cerrarSesion} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL CONTINUO */}
      <main style={{ flex: 1, padding: '30px 0', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* SECCIÓN 1: INICIO */}
        <div ref={seccionInicioRef} style={{ width: '100%', maxWidth: '100%', padding: '0 20px', scrollMarginTop: '90px' }}>
          <div className="dashboard-container" style={{ width: '100%', maxWidth: '100%', margin: '0 auto' }}>
            
            {/* HERO BANNER DINÁMICO */}
            <div className="focus-hero-banner-main" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2563eb 100%)', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', position: 'relative', overflow: 'hidden', paddingBottom: '45px', marginBottom: '35px' }}>
              <div className="hero-banner-content">
                <span className="hero-tag" style={{ background: 'rgba(255,255,255,0.15)', color: '#38bdf8', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                  {bannersHero[bannerActual].tag} ({rolUsuario.toUpperCase()})
                </span>
                <h1 style={{ color: '#ffffff', marginTop: '15px', fontSize: '34px', lineHeight: '1.2' }}>
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
                <img src={bannersHero[bannerActual].img} alt="Hero Banner" style={{ borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.3)', transition: 'all 0.5s ease' }} />
              </div>

              {/* PUNTITOS */}
              <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 10 }}>
                {bannersHero.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setBannerActual(index)}
                    style={{
                      width: bannerActual === index ? '24px' : '10px',
                      height: '10px',
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: bannerActual === index ? '#ef4444' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* SECCIÓN 2: CURSOS Y OFERTA ACADÉMICA */}
        <div ref={seccionCursosRef} style={{ width: '100%', maxWidth: '100%', padding: '0 20px', scrollMarginTop: '90px' }}>
          <div className="dashboard-container" style={{ width: '100%', maxWidth: '100%', margin: '0 auto' }}>
            
            <div style={{ marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', textAlign: 'left' }}>
              <h2 style={{ fontSize: '26px', color: '#0f172a', margin: 0, fontWeight: 'bold' }}>
                OFERTA ACADÉMICA & CURSOS
              </h2>
            </div>

            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => { setModalidadFiltro('virtual'); setVideoActivo(null); setLaboratorioSeleccionado(null); }}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    backgroundColor: modalidadFiltro === 'virtual' ? '#2563eb' : '#f1f5f9',
                    color: modalidadFiltro === 'virtual' ? '#fff' : '#334155'
                  }}
                >
                  Modalidad Virtual ({listaClases.filter(c => c.tipo === 'Virtual').length})
                </button>

                <button 
                  onClick={() => { setModalidadFiltro('presencial'); setVideoActivo(null); setLaboratorioSeleccionado(null); }}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    backgroundColor: modalidadFiltro === 'presencial' ? '#059669' : '#f1f5f9',
                    color: modalidadFiltro === 'presencial' ? '#fff' : '#334155'
                  }}
                >
                  Modalidad Presencial ({listaClases.filter(c => c.tipo === 'Presencial').length})
                </button>

                <input 
                  type="text" 
                  placeholder="Buscar clase o profesor..." 
                  value={busqueda} 
                  onChange={(e) => setBusqueda(e.target.value)}
                  style={{ marginLeft: 'auto', padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', minWidth: '260px', fontSize: '14px' }}
                />
              </div>

              {/* Categorías */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                <span style={{ fontSize: '13px', color: '#64748b', alignSelf: 'center', fontWeight: 'bold' }}>Categorías:</span>
                {[
                  { id: 'todas', label: 'Todas' },
                  { id: 'ingenieria', label: 'Ingeniería & PLC' },
                  { id: 'programacion', label: 'Programación & Cloud' },
                  { id: 'mecatronica', label: 'Mecatrónica & IoT' },
                  { id: 'potencia', label: 'Potencia & Electrónica' }
                ].map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setCategoriaSeleccionada(cat.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: 'none',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      backgroundColor: categoriaSeleccionada === cat.id ? '#0f172a' : '#e2e8f0',
                      color: categoriaSeleccionada === cat.id ? '#fff' : '#475569'
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* REPRODUCTOR VIRTUAL */}
            {modalidadFiltro === 'virtual' && videoActivo && (
              <div style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', color: '#fff', marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, color: '#38bdf8' }}>Reproduciendo Sesión: {videoActivo.titulo}</h3>
                  <button onClick={() => setVideoActivo(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                    Cerrar Video
                  </button>
                </div>
                <video controls autoPlay style={{ width: '100%', maxHeight: '420px', borderRadius: '8px', background: '#000' }}>
                  <source src={videoActivo.videoUrl} type="video/mp4" />
                  Tu navegador no soporta video HTML5.
                </video>
              </div>
            )}

            {/* TARJETAS DE CLASES */}
            <div className="courses-grid-focus">
              {clasesFiltradas.length > 0 ? (
                clasesFiltradas.map((item) => (
                  <div key={item.id} className="focus-card-item">
                    <div className="card-image-wrapper">
                      <img src={item.imgUrl} alt={item.titulo} />
                      <span className="badge-status">Activo</span>
                    </div>

                    <div className="card-body-content">
                      <h3>{item.titulo}</h3>
                      <p>{item.desc}</p>
                      
                      <div className="card-meta" style={{ flexDirection: 'column', gap: '5px', alignItems: 'flex-start' }}>
                        <span><strong>Horario:</strong> {item.horario}</span>
                        <span><strong>Docente:</strong> {item.instructor}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        {item.tipo === 'Virtual' ? (
                          <>
                            <button className="card-action-btn" onClick={() => setVideoActivo(item)}>
                              Ver Grabación
                            </button>
                            <a href={item.enlaceSede} target="_blank" rel="noreferrer" className="card-action-btn" style={{ backgroundColor: '#10b981', textAlign: 'center', textDecoration: 'none' }}>
                              Ir a Zoom
                            </a>
                          </>
                        ) : (
                          <button className="card-action-btn" onClick={() => setLaboratorioSeleccionado(item)} style={{ backgroundColor: '#059669', width: '100%', cursor: 'pointer' }}>
                            Ver Detalles y Ubicación
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#64748b', gridColumn: '1 / -1', padding: '40px' }}>
                  No se encontraron clases que coincidan con los criterios.
                </p>
              )}
            </div>

          </div>
        </div>

        {/* SECCIÓN 3: DOCENTES E INSTRUCTORES (EXCLUSIVO PARA ALUMNOS) */}
        {rolUsuario === 'alumno' && (
          <div ref={seccionDocentesRef} style={{ width: '100%', maxWidth: '1150px', margin: '0 auto', padding: '0 20px', scrollMarginTop: '90px' }}>
            <div style={{ background: '#f8fafc', padding: '30px 25px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '25px', textAlign: 'left' }}>
                <h2 style={{ fontSize: '24px', color: '#0f172a', margin: 0, fontWeight: 'bold' }}>
                  DOCENTES & INSTRUCTORES
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                {docentesDestacados.map(docente => (
                  <div key={docente.id} style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', overflow: 'hidden', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <img src={docente.foto} alt={docente.nombre} style={{ width: '100%', height: '190px', objectFit: 'cover' }} />
                    <div style={{ padding: '15px' }}>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '15px', color: '#1e293b', fontWeight: 'bold' }}>{docente.nombre}</h3>
                      <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#2563eb', fontWeight: 'bold' }}>{docente.especialidad}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '6px', borderRadius: '6px' }}>
                        <strong>Sede:</strong> {docente.sede}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 4: BIBLIOTECA DIGITAL Y VISOR 3D */}
        <div ref={seccionBibliotecaRef} style={{ width: '100%', maxWidth: '1150px', margin: '0 auto', padding: '0 20px', scrollMarginTop: '90px' }}>
          <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '25px', textAlign: 'left' }}>
            <h2 style={{ fontSize: '24px', color: '#0f172a', margin: 0, fontWeight: 'bold' }}>
              BIBLIOTECA VIRTUAL & LIBROS INTERACTIVOS (3D)
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {listaLibros.map((libro) => (
              <div key={libro.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
                <img src={libro.portada} alt={libro.titulo} style={{ width: '100%', height: '210px', objectFit: 'cover' }} />
                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>{libro.categoria}</span>
                  <h3 style={{ fontSize: '15px', color: '#0f172a', margin: '0 0 8px 0', lineHeight: '1.4', fontWeight: 'bold' }}>{libro.titulo}</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 15px 0' }}>Autor: {libro.autor}</p>
                  <button 
                    onClick={() => setLibroSeleccionado(libro.pdfUrl)}
                    style={{ marginTop: 'auto', padding: '10px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', textAlign: 'center' }}
                  >
                    Leer en Flipbook 3D
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN 5: GESTIÓN DE USUARIOS (SÓLO DOCENTES) */}
        {rolUsuario === 'docente' && (
          <div ref={seccionUsuariosRef} style={{ width: '100%', maxWidth: '1150px', margin: '0 auto', padding: '0 20px', scrollMarginTop: '90px' }}>
            <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '24px', color: '#0f172a', margin: 0, fontWeight: 'bold' }}>
                GESTIÓN DE USUARIOS Y ACCESOS
              </h2>
              <button onClick={abrirModalCrearUsuario} style={{ background: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                + Nuevo Usuario
              </button>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '13px' }}>
                    <th style={{ padding: '15px' }}>Usuario</th>
                    <th style={{ padding: '15px' }}>Nombres Completos</th>
                    <th style={{ padding: '15px' }}>Rol</th>
                    <th style={{ padding: '15px' }}>Estado</th>
                    <th style={{ padding: '15px', textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {listaUsuarios.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#1e293b' }}>
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>{u.usuario}</td>
                      <td style={{ padding: '15px' }}>{u.nombres}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', backgroundColor: u.rol === 'docente' ? '#e0f2fe' : '#f1f5f9', color: u.rol === 'docente' ? '#0369a1' : '#475569' }}>
                          {u.rol}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', backgroundColor: u.estado === 'activo' ? '#dcfce7' : '#fee2e2', color: u.estado === 'activo' ? '#166534' : '#991b1b' }}>
                          {u.estado}
                        </span>
                      </td>
                      <td style={{ padding: '15px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => abrirModalEditarUsuario(u)} style={{ background: '#e2e8f0', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Editar</button>
                        <button onClick={() => toggleEstadoUsuario(u.id)} style={{ background: u.estado === 'activo' ? '#fee2e2' : '#dcfce7', color: u.estado === 'activo' ? '#991b1b' : '#166534', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                          {u.estado === 'activo' ? 'Desactivar' : 'Activar'}
                        </button>
                        <button onClick={() => { setUserToReset(u); setModalResetPass(true); }} style={{ background: '#fef3c7', color: '#b45309', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Clave</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* VENTANA EMERGENTE DE UBICACIÓN Y DETALLES DE LABORATORIO */}
      {laboratorioSeleccionado && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(5px)' }}>
          <div style={{ background: '#ffffff', width: '90%', maxWidth: '750px', padding: '30px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#059669', fontSize: '20px', fontWeight: 'bold' }}>Ubicación y Detalle del Laboratorio</h3>
              <button onClick={() => setLaboratorioSeleccionado(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cerrar X</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '10px', fontWeight: 'bold' }}>{laboratorioSeleccionado.titulo}</h4>
                <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>{laboratorioSeleccionado.desc}</p>
                <p style={{ fontSize: '14px', margin: '8px 0', color: '#1e293b' }}><strong>Sede y Aula:</strong> {laboratorioSeleccionado.enlaceSede}</p>
                <p style={{ fontSize: '14px', margin: '8px 0', color: '#1e293b' }}><strong>Horario:</strong> {laboratorioSeleccionado.horario}</p>
                <p style={{ fontSize: '14px', margin: '8px 0', color: '#1e293b' }}><strong>Docente:</strong> {laboratorioSeleccionado.instructor}</p>
              </div>
              <div>
                <img src={laboratorioSeleccionado.ubicacionImg || laboratorioSeleccionado.imgUrl} alt="Ubicación Laboratorio" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DEL VISOR FLIPBOOK */}
      {libroSeleccionado && (
        <PdfFlipbook pdfUrl={libroSeleccionado} alCerrar={() => setLibroSeleccionado(null)} />
      )}

      {/* MODAL CREAR / EDITAR USUARIO */}
      {modalUsuario && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', width: '90%', maxWidth: '450px', padding: '30px', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#0f172a' }}>{modoEdicion ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}</h3>
            {mensajeUserMsg && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '15px' }}>{mensajeUserMsg}</p>}
            
            <form onSubmit={handleGuardarUsuario} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Nombre de usuario:</label>
                <input 
                  type="text" 
                  disabled={modoEdicion}
                  value={usuarioForm.usuario} 
                  onChange={e => setUsuarioForm({...usuarioForm, usuario: e.target.value})}
                  required 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: modoEdicion ? '#f1f5f9' : '#fff' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Nombres completos:</label>
                <input 
                  type="text" 
                  value={usuarioForm.nombres} 
                  onChange={e => setUsuarioForm({...usuarioForm, nombres: e.target.value})}
                  required 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Rol:</label>
                <select 
                  value={usuarioForm.rol} 
                  onChange={e => setUsuarioForm({...usuarioForm, rol: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="alumno">Alumno</option>
                  <option value="docente">Docente</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, background: '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Guardar</button>
                <button type="button" onClick={() => setModalUsuario(false)} style={{ flex: 1, background: '#e2e8f0', color: '#334155', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL RESETEAR CONTRASEÑA */}
      {modalResetPass && userToReset && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', width: '90%', maxWidth: '400px', padding: '30px', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#0f172a' }}>Restablecer Clave</h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Establezca una nueva contraseña para el usuario <strong>{userToReset.usuario}</strong>.</p>
            
            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                type="password" 
                value={newPasswordInput} 
                onChange={e => setNewPasswordInput(e.target.value)}
                required 
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, background: '#d97706', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Actualizar</button>
                <button type="button" onClick={() => setModalResetPass(false)} style={{ flex: 1, background: '#e2e8f0', color: '#334155', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}