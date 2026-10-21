import React, { useState, useEffect, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import * as pdfjsLib from 'pdfjs-dist';

// Configuración del worker nativo para Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export default function PdfFlipbook({ pdfUrl, alCerrar }) {
  const [paginasImg, setPaginasImg] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [zoom, setZoom] = useState(1);
  const bookRef = useRef();

  useEffect(() => {
    let cancelado = false;

    const renderizarPdf = async () => {
      try {
        setCargando(true);
        setErrorMsg('');
        setPaginasImg([]);
        setPaginaActual(1);
        setZoom(1);

        let urlFinal = pdfUrl;
        
        if (!urlFinal || typeof urlFinal !== 'string' || urlFinal.trim() === '') {
          urlFinal = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
        }

        let response;
        try {
          response = await fetch(urlFinal);
        } catch (e) {
          response = { ok: false };
        }

        if (!response.ok) {
          urlFinal = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
          response = await fetch(urlFinal);
        }
        
        const buffer = await response.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: buffer });
        const pdf = await loadingTask.promise;
        const imagenesCargadas = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelado) return;
          const page = await pdf.getPage(i);
          // Alta resolución para mantener nitidez incluso con zoom alto
          const viewport = page.getViewport({ scale: 2.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport }).promise;
          imagenesCargadas.push(canvas.toDataURL('image/png'));
        }

        if (!cancelado) {
          setPaginasImg(imagenesCargadas);
          setCargando(false);
        }
      } catch (err) {
        console.error('Error detallado cargando PDF:', err);
        if (!cancelado) {
          setErrorMsg(err.message || 'No se pudo procesar el archivo PDF.');
          setCargando(false);
        }
      }
    };

    if (pdfUrl !== undefined) {
      renderizarPdf();
    }

    return () => {
      cancelado = true;
    };
  }, [pdfUrl]);

  // Zoom ampliado hasta el 300% (3.0)
  const aumentarZoom = () => setZoom(prev => Math.min(prev + 0.25, 3.0));
  const reducirZoom = () => setZoom(prev => Math.max(prev - 0.25, 1));
  const resetearZoom = () => setZoom(1);

  // Manejador unificado de giro de página
  const manejarGiroPagina = (e) => {
    if (e && typeof e.data === 'number') {
      setPaginaActual(e.data + 1);
    } else if (bookRef.current) {
      const pageIndex = bookRef.current.pageFlip().getCurrentPageIndex();
      setPaginaActual(pageIndex + 1);
    }
  };

  const paginaAnterior = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
      setTimeout(() => {
        const pageIndex = bookRef.current.pageFlip().getCurrentPageIndex();
        setPaginaActual(pageIndex + 1);
      }, 100);
    }
  };

  const paginaSiguiente = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
      setTimeout(() => {
        const pageIndex = bookRef.current.pageFlip().getCurrentPageIndex();
        setPaginaActual(pageIndex + 1);
      }, 100);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(2, 6, 23, 0.96)', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        background: '#0f172a', padding: '15px 25px', borderRadius: '16px',
        width: '98vw', height: '96vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.7)', overflow: 'hidden',
        border: '1px solid #1e293b'
      }}>
        {/* BARRA SUPERIOR DE CONTROL */}
        <div style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '10px', 
          color: '#fff', 
          borderBottom: '1px solid #1e293b', 
          paddingBottom: '10px',
          zIndex: 20
        }}>
          <span style={{ fontWeight: 'bold', color: '#38bdf8', fontSize: '16px' }}>
            📖 Visor Flipbook PDF 3D | Pórtico San Marcos
          </span>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: '#1e293b', 
            padding: '5px 14px', 
            borderRadius: '20px',
            border: '1px solid #334155'
          }}>
            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 'bold' }}>Zoom:</span>
            <button 
              onClick={reducirZoom} 
              disabled={zoom <= 1}
              style={{ background: zoom <= 1 ? '#334155' : '#2563eb', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: zoom <= 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
            >
              ➖
            </button>
            <span style={{ color: '#38bdf8', fontSize: '13px', fontWeight: 'bold', minWidth: '45px', textAlign: 'center' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button 
              onClick={aumentarZoom} 
              disabled={zoom >= 3.0}
              style={{ background: zoom >= 3.0 ? '#334155' : '#2563eb', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: zoom >= 3.0 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
            >
              ➕
            </button>
            {zoom !== 1 && (
              <button 
                onClick={resetearZoom}
                style={{ background: '#64748b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', marginLeft: '4px' }}
              >
                ↺ Reset
              </button>
            )}
          </div>

          <button onClick={alCerrar} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Cerrar Visor ✕
          </button>
        </div>

        {cargando && (
          <div style={{ color: '#38bdf8', margin: 'auto', textAlign: 'center', fontSize: '20px' }}>
            ⏳ Renderizando libro interactivo...
          </div>
        )}

        {errorMsg && (
          <div style={{ color: '#f87171', margin: 'auto', textAlign: 'center', maxWidth: '500px' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* ÁREA DE VISUALIZACIÓN CON DESPLAZAMIENTO PERFECTO */}
        {!cargando && paginasImg.length > 0 && (
          <>
            <div style={{ 
              flex: 1, 
              width: '100%', 
              overflow: 'auto', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'flex-start',
              padding: '20px 0'
            }}>
              <div style={{ 
                margin: '0 auto',
                transform: `scale(${zoom})`, 
                transformOrigin: 'top center',
                transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                marginBottom: zoom > 1 ? `${(zoom - 1) * 700}px` : '0px'
              }}>
                <HTMLFlipBook
                  width={380}
                  height={540}
                  minWidth={280}
                  maxWidth={500}
                  minHeight={380}
                  maxHeight={700}
                  showCover={true}
                  drawShadow={true}
                  flippingTime={700}
                  usePortrait={false}
                  startPage={0}
                  mobileScrollSupport={true}
                  ref={bookRef}
                  onFlip={manejarGiroPagina}
                  style={{ margin: '0 auto', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}
                >
                  {paginasImg.map((imgSrc, index) => (
                    <div key={index} className="page" style={{ background: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                      <img src={imgSrc} alt={`Página ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                  ))}
                </HTMLFlipBook>
              </div>
            </div>

            {/* NAVEGACIÓN INFERIOR */}
            <div style={{ marginTop: 'auto', display: 'flex', gap: '25px', alignItems: 'center', paddingBottom: '5px', zIndex: 20 }}>
              <button
                onClick={paginaAnterior}
                style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
              >
                ◀ Página Anterior
              </button>

              <span style={{ color: '#cbd5e1', fontSize: '16px', fontWeight: 'bold' }}>
                Página {paginaActual} de {paginasImg.length}
              </span>

              <button
                onClick={paginaSiguiente}
                style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
              >
                Siguiente Página ▶
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}