import { useState, useMemo, useEffect } from 'react';
import { Search, Lock, Eye, Image as ImageIcon, Play, Star, Loader2, FileText, FolderOpen, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ContenidoMultimedia {
  id: number;
  titulo: string;
  tipo: 'noticia' | 'video' | 'imagen'; 
  url_recurso: string; 
  nivel_acceso_requerido: number | null; 
  carpeta?: string; 
  autor_staff_id: number;
  fecha_publicacion: string;
  vistas: number;
  es_destacado: number | boolean; 
  autor?: { 
    nombre: string;
    apellido: string;
    area: string;
    cargo: string;
  };
  isFolder?: boolean; 
  cantidad?: number;  
}

const GaleriaPage = () => {
  const [contenidos, setContenidos] = useState<ContenidoMultimedia[]>([]);
  const [userRole, setUserRole] = useState<string>('GUEST');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [carpetaActiva, setCarpetaActiva] = useState<string | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const limitePorPagina = 9; 

  useEffect(() => {
    const fetchDatos = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {};
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const resPerfil = await fetch('http://localhost:3000/usuario-auth/perfil', { headers });
        if (resPerfil.ok) {
          const dataPerfil = await resPerfil.json();
          let rolFinal = 'GUEST';
          
          if (dataPerfil.rol === 'fan') {
            if (dataPerfil.nivelFan && dataPerfil.nivelFan !== 'Inactivo' && dataPerfil.estadoSuscripcion === 'Activo') {
              rolFinal = dataPerfil.nivelFan; 
            } else {
              rolFinal = 'FAN'; 
            }
          } else if (dataPerfil.rol) {
            rolFinal = dataPerfil.rol;
          }
          setUserRole(rolFinal.toUpperCase());
        }

        const resContenido = await fetch('http://localhost:3000/contenido-multimedia', { headers });
        if (resContenido.ok) {
          const dataContenido = await resContenido.json();
          setContenidos(dataContenido);
        }

      } catch (error) {
        console.error('Error cargando la galería:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatos();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [searchTerm, carpetaActiva]);

  const obtenerNivelUsuario = (rol: string) => {
    switch (rol.toUpperCase()) {
      case 'SUPERADMIN':
      case 'ADMINISTRATIVO':
      case 'PRENSA':
        return 99; 
      
      case 'P2':
      case 'P1':
        return 1;
      case 'P3':
      case 'FAN': 
      case 'COMERCIO': 
      case 'GUEST':
      default:
        return 0; 
    }
  };
  const nivelUsuario = obtenerNivelUsuario(userRole);

  const getThumbnail = (url: string, tipo: string) => {
    if (tipo !== 'video' || !url) return url;
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    if (ytMatch && ytMatch[1]) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
    if (url.includes('cloudinary.com') && url.includes('/video/')) return url.replace(/\.[^/.]+$/, ".jpg");
    return 'https://via.placeholder.com/600x400?text=Video';
  };

  //  LÓGICA DE FILTRADO, CARPETAS Y ARCHIVOS SUELTOS 
  const itemsAMostrar = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    // 1. Filtrar por búsqueda
    const filtrados = contenidos.filter(item => {
      const matchTitulo = item.titulo?.toLowerCase().includes(search) ?? false;
      const matchCarpeta = item.carpeta?.toLowerCase().includes(search) ?? false;
      return matchTitulo || matchCarpeta;
    });

    if (carpetaActiva) {
      // ESTAMOS ADENTRO DE UNA CARPETA
      return filtrados.filter(c => c.carpeta === carpetaActiva);
    }

    // ESTAMOS EN LA RAÍZ
    const carpetasMap = new Map<string, number>();
    const archivosSueltos: ContenidoMultimedia[] = [];

    filtrados.forEach(item => {
      const nombreCarpeta = item.carpeta?.trim();
      
      // Evitamos que strings vacíos o la palabra "null" literal se conviertan en carpetas
      if (nombreCarpeta && nombreCarpeta.toLowerCase() !== 'null' && nombreCarpeta.toLowerCase() !== 'undefined') {
        // Es un archivo dentro de una carpeta (sumamos 1 al contador)
        carpetasMap.set(nombreCarpeta, (carpetasMap.get(nombreCarpeta) || 0) + 1);
      } else {
        // Es un archivo suelto real
        archivosSueltos.push(item);
      }
    });

    // Armamos las tarjetas de las carpetas Y LAS ORDENAMOS
    const carpetasCards: any[] = Array.from(carpetasMap.entries())
      .map(([nombre, cantidad]) => ({
        id: `folder-${nombre}`,
        isFolder: true,
        titulo: nombre,
        carpeta: nombre,
        tipo: 'imagen', // Default para que no rompa el tipado
        url_recurso: '',
        nivel_acceso_requerido: 0,
        autor_staff_id: 0,
        fecha_publicacion: '',
        vistas: 0,
        es_destacado: 0,
        cantidad: cantidad,
        autor: undefined 
      }))
      // ORDENAMIENTO INTELIGENTE: Menor a Mayor (Números) y A-Z (Letras)
      .sort((a, b) => a.titulo.localeCompare(b.titulo, undefined, { numeric: true, sensitivity: 'base' }));

    // Retornamos primero las carpetas (ya ordenadas) y después los archivos sueltos
    return [...carpetasCards, ...archivosSueltos];
  }, [contenidos, searchTerm, carpetaActiva]);

  const indiceUltimoItem = paginaActual * limitePorPagina;
  const indicePrimerItem = indiceUltimoItem - limitePorPagina;
  const itemsPaginados = itemsAMostrar.slice(indicePrimerItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(itemsAMostrar.length / limitePorPagina);

  const registrarVista = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // 1. Avisamos al backend que sume 1
      await fetch(`http://localhost:3000/contenido-multimedia/${id}/vista`, {
        method: 'PATCH',
        headers
      });

      // 2. Actualizamos el estado de React al instante para que el "ojito" cambie sin recargar la página
      setContenidos(prevContenidos => 
        prevContenidos.map(item => 
          item.id === id ? { ...item, vistas: item.vistas + 1 } : item
        )
      );
    } catch (error) {
      console.error("Error sumando vista:", error);
    }
  };

  return (
    <main className="min-h-screen bg-slate-200 dark:bg-[#08060d] transition-colors duration-300 pt-20 pb-12 flex flex-col">
      
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-sky-400/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full flex-grow">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 mt-8">
          <div>
            <h1 className="title-fan text-4xl md:text-5xl text-slate-800 dark:text-white mb-2 uppercase">
              {carpetaActiva ? `ÁLBUM: ${carpetaActiva}` : <><span className="text-sky-500">Galería</span> Multimedia</>}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Explorá el archivo histórico y exclusivo del óvalo.
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por título o carpeta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 text-slate-800 dark:text-white rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none shadow-sm placeholder:text-slate-400"
            />
          </div>
        </div>

        {carpetaActiva && (
          <button 
            onClick={() => setCarpetaActiva(null)}
            className="flex items-center gap-2 text-sky-600 dark:text-sky-400 hover:text-sky-500 font-bold text-sm mb-8 bg-sky-500/10 px-4 py-2 rounded-xl transition-colors w-fit border border-sky-500/20"
          >
            <ArrowLeft size={16} /> Volver 
          </button>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 flex-grow">
            <Loader2 className="w-12 h-12 text-sky-500 animate-spin mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Cargando archivos desde boxes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {itemsPaginados.length > 0 ? (
              itemsPaginados.map((item) => {
                
                if (item.isFolder) {
                  return (
                    <article 
                      key={item.id} 
                      onClick={() => setCarpetaActiva(item.carpeta || null)}
                      className="flex flex-col items-center justify-center bg-white/90 dark:bg-[#ffffff05] backdrop-blur-xl border border-slate-200 dark:border-white/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_8px_30px_rgba(14,165,233,0.3)] hover:border-sky-500/50 transition-all duration-300 cursor-pointer group h-full min-h-[400px]"
                    >
                      <div className="bg-sky-500/10 p-6 rounded-full text-sky-500 group-hover:scale-110 transition-transform duration-300 mb-4 border border-sky-500/20">
                        <FolderOpen size={56} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight text-center px-6">
                        {item.titulo}
                      </h3>
                      <p className="text-slate-500 font-bold mt-2 bg-slate-100 dark:bg-black/30 px-3 py-1 rounded-full text-sm">
                        {item.cantidad} elementos
                      </p>
                    </article>
                  );
                }

                const isLocked = item.nivel_acceso_requerido !== null && item.nivel_acceso_requerido > nivelUsuario;

                return (
                  <article 
                    key={item.id} 
                    className="flex flex-col bg-white/90 dark:bg-[#ffffff05] backdrop-blur-xl border border-slate-200 dark:border-white/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_8px_30px_rgba(14,165,233,0.3)] transition-all duration-300 group h-full"
                  >
                    
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-200 dark:bg-black/50 shrink-0">
                      
                      {Boolean(item.es_destacado) && (
                        <div className="absolute top-3 left-3 z-20 bg-amber-500/90 backdrop-blur-sm text-white text-xs font-black uppercase px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-lg">
                          <Star size={14} className="fill-current" /> Destacado
                        </div>
                      )}

                      <div className="absolute top-3 right-3 z-20 bg-black/50 backdrop-blur-md text-white p-2 rounded-lg">
                        {item.tipo === 'video' && <Play size={16} />}
                        {item.tipo === 'imagen' && <ImageIcon size={16} />}
                        {item.tipo === 'noticia' && <FileText size={16} />}
                      </div>

                      <img
                        src={getThumbnail(item.url_recurso, item.tipo)}
                        alt={item.titulo}
                        className={`w-full h-full object-cover transition-all duration-700 
                          ${isLocked ? 'scale-300 blur-xl opacity-90' : 'group-hover:scale-105'}`}
                      />

                      {isLocked && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/20 dark:bg-black/40 backdrop-blur-[2px]">
                          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full mb-3 shadow-2xl">
                            <Lock className="text-white w-8 h-8" />
                          </div>
                          <span className="text-white font-black tracking-widest uppercase text-sm drop-shadow-md">
                            P1/P2 REQUERIDO 
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2 line-clamp-2">
                          {item.titulo}
                        </h3>
                        {isLocked && (
                          <p className="text-red-600 font-bold text-sm leading-relaxed line-clamp-2 mb-4">
                            EXCLUSIVO <span className="text-sky-600 dark:text-sky-200 font-bold text-sm leading-relaxed line-clamp-2 mb-4">Mejorá tu plan a P1/P2 para disfrutar de este material.</span>
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-white/10 mt-auto">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider">
                            Subido por
                          </span>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {item.autor ? `${item.autor.nombre} ${item.autor.apellido}` : 'Staff Óvalo'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                          <Eye size={14} />
                          <span className="text-xs font-bold">{item.vistas}</span>
                        </div>
                      </div>

                      <div className="mt-5">
                        {isLocked ? (
                          <Link 
                            to="/dashboard/pagos" 
                            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-sky-500 dark:hover:bg-sky-500 hover:text-white transition-colors shadow-lg"
                          >
                            <Lock size={16} /> Subir de Nivel
                          </Link>
                        ) : (
                          <a 
                            href={item.url_recurso}
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={() => registrarVista(item.id)}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 dark:hover:text-sky-100 hover:bg-sky-500 hover:text-white rounded-xl font-bold transition-colors border border-sky-500/20"
                          >
                            Ver {item.tipo}
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-white/20 dark:bg-white/5 backdrop-blur-sm rounded-3xl border border-white/30 dark:border-white/10">
                <Search className="w-12 h-12 text-slate-400 mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-1">No hay resultados</h3>
                <p className="text-slate-500">No encontramos ningún archivo que coincida con tu búsqueda.</p>
              </div>
            )}
          </div>
        )}

        {!isLoading && totalPaginas > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12 pb-8">
            <button 
              onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
              disabled={paginaActual === 1}
              className="p-3 bg-white/50 dark:bg-slate-800 rounded-xl text-slate-800 dark:text-white disabled:opacity-30 hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Página <span className="text-slate-800 dark:text-white text-base">{paginaActual}</span> de {totalPaginas}
            </span>
            
            <button 
              onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
              disabled={paginaActual === totalPaginas}
              className="p-3 bg-white/50 dark:bg-slate-800 rounded-xl text-slate-800 dark:text-white disabled:opacity-30 hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

      </div>
    </main>
  );
};

export default GaleriaPage;
