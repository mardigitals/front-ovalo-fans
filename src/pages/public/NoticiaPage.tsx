import { useState, useEffect } from 'react';
import { Calendar, User, ChevronLeft, ChevronRight, ArrowRight, Eye, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/api/axios';

const NoticiaPage = () => {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const limitePorPagina = 10;

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const response = await api.get('/contenido-multimedia');
        
        // Filtramos solo las noticias reales (que tienen cuerpo o url externa)
        const dataNoticias = response.data.filter((c: any) => c.tipo === 'noticia');
        
        // Ordenamos de más nueva a más vieja (por ID o por fecha_publicacion)
        const noticiasOrdenadas = dataNoticias.sort((a: any, b: any) => b.id - a.id);
        
        setNoticias(noticiasOrdenadas);
      } catch (error) {
        console.error("Error cargando noticias:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  // SEPARAMOS LAS 3 DESTACADAS DEL RESTO DEL FEED
  const destacadas = noticias.filter(n => n.es_destacado).slice(0, 3);
  const idsDestacadas = destacadas.map(d => d.id);
  
  // El feed general son TODAS las noticias, menos las 3 que ya mostramos arriba
  const feedGeneral = noticias.filter(n => !idsDestacadas.includes(n.id));

  // LÓGICA DE PAGINACIÓN DEL FEED
  const indiceUltimoItem = paginaActual * limitePorPagina;
  const indicePrimerItem = indiceUltimoItem - limitePorPagina;
  const noticiasPaginadas = feedGeneral.slice(indicePrimerItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(feedGeneral.length / limitePorPagina);

  // Formateador de fecha formato Argentino
  const formatearFecha = (fechaString: string) => {
    if (!fechaString) return 'Reciente';
    const opciones: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(fechaString).toLocaleDateString('es-AR', opciones);
  };

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-[#08060d] transition-colors duration-300 pt-24 pb-12">
      
      {/* FONDO DECORATIVO */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-[20%] w-[50%] h-[30%] bg-sky-500/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* HERO SECTION */}
        <div className="mb-12 border-b border-slate-300 dark:border-white/10 pb-8">
          <h1 className="title-fan text-5xl md:text-7xl text-slate-900 dark:text-white uppercase tracking-tighter mb-4">
            Noticias <span className="text-sky-500">Autódromo Rafaela</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl font-medium">
            Toda la actualidad, comunicados oficiales y coberturas recientes del ÚNICO óvalo de Sudamérica.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest">Cargando portadas...</p>
          </div>
        ) : (
          <>
            {/* SECCIÓN TOP 3 DESTACADAS */}
            {destacadas.length > 0 && paginaActual === 1 && (
              <section className="mb-16">
                <div className="flex items-center gap-2 mb-6">
                  <Star className="text-amber-500 fill-amber-500" size={24} />
                  <h2 className="text-2xl font-black uppercase tracking-widest text-slate-800 dark:text-white">Lo más destacado</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {destacadas.map((noticia, index) => (
                    <Link 
                      to={noticia.cuerpo ? `/noticias/${noticia.id}` : noticia.url_recurso}
                      target={noticia.cuerpo ? "_self" : "_blank"}
                      key={noticia.id} 
                      className={`group relative rounded-3xl overflow-hidden bg-black shadow-xl hover:shadow-[0_0_30px_rgba(14,165,233,0.3)] transition-all duration-500 ${index === 0 ? 'lg:col-span-8 aspect-[16/9] lg:aspect-auto min-h-[400px]' : 'lg:col-span-4 aspect-[4/3] lg:aspect-auto min-h-[250px]'}`}
                    >
                      {/* Imagen de Fondo */}
                      <img 
                        src={noticia.url_recurso || 'https://via.placeholder.com/1200x800/0f172a/38bdf8?text=Sin+Portada'} 
                        alt={noticia.titulo}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                      />
                      
                      {/* Gradiente Oscuro Abajo */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                      {/* Contenido Texto */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col justify-end">
                        <div className="flex items-center gap-3 mb-3 text-sky-400 text-xs font-black uppercase tracking-wider">
                          <span className="bg-sky-500/20 px-3 py-1 rounded-full border border-sky-500/30">Destacado</span>
                          <span className="flex items-center gap-1 text-slate-300"><Calendar size={14}/> {formatearFecha(noticia.fecha_publicacion)}</span>
                        </div>
                        <h3 className={`font-black text-white uppercase leading-tight mb-2 ${index === 0 ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl'}`}>
                          {noticia.titulo}
                        </h3>
                        {index === 0 && noticia.descripcion_breve && (
                          <p className="text-slate-300 md:text-lg line-clamp-2 max-w-3xl">
                            {noticia.descripcion_breve}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* FEED GENERAL (FULL WIDTH) */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-widest text-slate-800 dark:text-slate-400 mb-6 border-b border-slate-300 dark:border-white/10 pb-2">
                Últimas Noticias
              </h2>

              <div className="flex flex-col gap-6">
                {noticiasPaginadas.map(noticia => (
                  <Link 
                    to={noticia.cuerpo ? `/noticias/${noticia.id}` : noticia.url_recurso}
                    target={noticia.cuerpo ? "_self" : "_blank"}
                    key={noticia.id} 
                    className="group flex flex-col md:flex-row bg-white dark:bg-[#0f151e] border border-slate-200 dark:border-white/5 rounded-2xl md:rounded-[2rem] overflow-hidden hover:shadow-xl hover:border-sky-500/30 transition-all duration-300"
                  >
                    {/* PORTADA MINIATURA */}
                    <div className="w-full md:w-2/5 lg:w-1/3 aspect-[16/9] md:aspect-auto relative overflow-hidden bg-slate-800 shrink-0">
                      <img 
                        src={noticia.url_recurso || 'https://via.placeholder.com/800x600/0f172a/38bdf8?text=Noticia'} 
                        alt={noticia.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    {/* CUERPO TEXTO FULL WIDTH */}
                    <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                      <div>
                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                          <span className="flex items-center gap-1.5"><Calendar size={14}/> {formatearFecha(noticia.fecha_publicacion)}</span>
                          <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400"><User size={14}/> {noticia.autor?.nombre ? `${noticia.autor.nombre} ${noticia.autor.apellido}` : 'Staff Óvalo'}</span>
                        </div>

                        {/* Título y Bajada */}
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase leading-tight mb-3 group-hover:text-sky-500 transition-colors">
                          {noticia.titulo}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed line-clamp-3">
                          {noticia.descripcion_breve}
                        </p>
                      </div>

                      {/* Footer de la Card Fila */}
                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100 dark:border-white/5">
                        <span className="flex items-center gap-2 text-sky-500 font-bold uppercase text-sm group-hover:translate-x-2 transition-transform">
                          Leer artículo completo <ArrowRight size={16} />
                        </span>
                        
                        <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-full">
                          <Eye size={14} /> {noticia.vistas} vistas
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* CONTROLES DE PAGINACIÓN */}
            {totalPaginas > 1 && (
              <div className="flex justify-center items-center gap-4 mt-16 pb-8 border-t border-slate-300 dark:border-white/10 pt-10">
                <button 
                  onClick={() => {
                    setPaginaActual(p => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube al apretar
                  }}
                  disabled={paginaActual === 1}
                  className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-white/5 text-slate-800 dark:text-white disabled:opacity-30 hover:border-sky-500 transition-colors shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 py-2 px-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                  Página <span className="text-slate-900 dark:text-white text-base">{paginaActual}</span> de {totalPaginas}
                </span>
                
                <button 
                  onClick={() => {
                    setPaginaActual(p => Math.min(totalPaginas, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={paginaActual === totalPaginas}
                  className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-white/5 text-slate-800 dark:text-white disabled:opacity-30 hover:border-sky-500 transition-colors shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
            
          </>
        )}
      </div>
    </main>
  );
};

export default NoticiaPage;