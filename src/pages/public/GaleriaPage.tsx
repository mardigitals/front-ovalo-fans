import { useState, useMemo, useEffect } from 'react';
import { Search, Lock, Eye, Image as ImageIcon, Play, Star, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// INTERFAZ BASADA EN TU BACKEND
interface ContenidoMultimedia {
  id: number;
  titulo: string;
  descripcion: string;
  url_archivo: string;
  tipo: 'IMAGEN' | 'VIDEO';
  es_vip: boolean;
  es_destacado: boolean;
  vistas: number;
  fecha_publicacion: string;
  autor: {
    nombre: string;
    apellido: string;
    area: string;
    cargo: string;
  };
}

const GaleriaPage = () => {
  // ESTADOS REALES
  const [contenidos, setContenidos] = useState<ContenidoMultimedia[]>([]);
  const [userRole, setUserRole] = useState<string>('GUEST');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');

  // LÓGICA DE FETCHING A TU BACKEND NESTJS
  useEffect(() => {
    const fetchDatos = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {};
        
        // Si hay token, lo mandamos para que el Interceptor de NestJS y el Auth funcionen
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
          
          // 1. Buscar Perfil del Usuario
          const resPerfil = await fetch('http://localhost:3000/usuario-auth/perfil', { headers });
          if (resPerfil.ok) {
            const dataPerfil = await resPerfil.json();
            // Asumimos que tu backend devuelve el rol o tipo de membresía en alguna de estas props
            setUserRole(dataPerfil.rol || dataPerfil.membresia || 'GUEST');
          }
        }

        // 2. Buscar Contenido Multimedia (El interceptor actúa acá del lado del servidor)
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

  // LÓGICA DE PERMISOS FRONTEND (Para cambiar la UI)
  const canViewVip = userRole === 'P1' || userRole === 'P2' || userRole === 'ADMIN';

  // LÓGICA DEL BUSCADOR (Búsqueda en memoria sobre los datos ya traídos)
  const contenidoFiltrado = useMemo(() => {
    return contenidos.filter((item) => {
      const busqueda = searchTerm.toLowerCase();
      return (
        item.titulo.toLowerCase().includes(busqueda) ||
        item.descripcion.toLowerCase().includes(busqueda)
      );
    });
  }, [contenidos, searchTerm]);

  return (
    <main className="min-h-screen bg-slate-200 dark:bg-[#08060d] transition-colors duration-300 pt-20 pb-12">
      
      {/* Fondo decorativo global */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-sky-400/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* ENCABEZADO Y BUSCADOR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 mt-8">
          <div>
            <h1 className="title-fan text-4xl md:text-5xl text-slate-800 dark:text-white mb-2">
              Galería <span className="text-sky-500">Multimedia</span>
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
              placeholder="Buscar fotos o videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 text-slate-800 dark:text-white rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none shadow-sm placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* ESTADO DE CARGA */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-sky-500 animate-spin mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Cargando archivos desde boxes...</p>
          </div>
        ) : (
          /* GRILLA DE TARJETAS VIDRIADAS */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contenidoFiltrado.length > 0 ? (
              contenidoFiltrado.map((item) => {
                // Evaluamos si requiere candado y bloqueo visual
                const isLocked = item.es_vip && !canViewVip;

                return (
                  <article 
                    key={item.id} 
                    className="flex flex-col bg-white/90 dark:bg-[#ffffff05] backdrop-blur-xl border border-slate-200 dark:border-white/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_8px_30px_rgba(14,165,233,0.8)] dark:hover:shadow-[0_8px_30px_rgba(14,165,233,0.8)] transition-all duration-300 group"
                  >
                  
                    {/* CONTENEDOR DE IMAGEN */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-200 dark:bg-black/50">
                      
                      {item.es_destacado && (
                        <div className="absolute top-3 left-3 z-20 bg-amber-500/90 backdrop-blur-sm text-white text-xs font-black uppercase px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-lg">
                          <Star size={14} className="fill-current" /> Destacado
                        </div>
                      )}

                      <div className="absolute top-3 right-3 z-20 bg-black/50 backdrop-blur-md text-white p-2 rounded-lg">
                        {item.tipo === 'VIDEO' ? <Play size={16} /> : <ImageIcon size={16} />}
                      </div>

                      <img
                        src={item.url_archivo}
                        alt={item.titulo}
                        className={`w-full h-full object-cover transition-all duration-700 
                          ${isLocked ? 'scale-110 blur-xl opacity-80' : 'group-hover:scale-105'}`}
                      />

                      {isLocked && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/20 dark:bg-black/40 backdrop-blur-[2px]">
                          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full mb-3 shadow-2xl">
                            <Lock className="text-white w-8 h-8" />
                          </div>
                          <span className="text-white font-black tracking-widest uppercase text-sm drop-shadow-md">
                            Exclusivo Fans
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CUERPO DE LA TARJETA */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2 line-clamp-1">
                          {item.titulo}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4">
                          {isLocked ? 'Contenido bloqueado. Uníte a la membresía P1 o P2 para disfrutar de este material exclusivo en alta definición.' : item.descripcion}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-white/10 mt-auto">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider">
                            Subido por
                          </span>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {item.autor?.nombre} {item.autor?.apellido}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-400 bg-white/50 dark:bg-black/20 px-2.5 py-1 rounded-lg">
                          <Eye size={14} />
                          <span className="text-xs font-bold">{item.vistas}</span>
                        </div>
                      </div>

                      <div className="mt-5">
                        {isLocked ? (
                          <Link 
                            to="/planes" 
                            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-sky-500 dark:hover:bg-sky-500 hover:text-white transition-colors"
                          >
                            <Lock size={16} /> Desbloquear Contenido
                          </Link>
                        ) : (
                          <Link 
                            to={`/galeria/${item.id}`} // Enrutamos al detalle o abrimos modal
                            className="w-full flex items-center justify-center gap-2 py-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 dark:hover:text-sky-100 hover:bg-sky-500  hover:text-white rounded-xl font-bold transition-colors border border-sky-500/20"
                          >
                            Ver {item.tipo.toLowerCase()}
                          </Link>
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
      </div>
    </main>
  );
};

export default GaleriaPage;