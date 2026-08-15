import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Eye, Loader2 } from 'lucide-react';
import api from '@/api/axios';

const NoticiaDetallePage = () => {
  const { id } = useParams();
  const [noticia, setNoticia] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNoticiaYSumarVista = async () => {
      try {
        const response = await api.get(`/contenido-multimedia/${id}`);
        setNoticia(response.data);
        await api.patch(`/contenido-multimedia/${id}/vista`).catch(e => console.log("Error sumando vista", e));
      } catch (error) {
        console.error("Error cargando la noticia:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNoticiaYSumarVista();
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#08060d] flex flex-col items-center justify-center pt-20">
        <Loader2 className="w-12 h-12 text-sky-500 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest">Cargando artículo...</p>
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#08060d] flex flex-col items-center justify-center pt-20 text-center px-4">
        <h2 className="title-fan text-4xl text-slate-800 dark:text-white mb-4">Noticia no encontrada</h2>
        <p className="text-slate-500 mb-8">El artículo que buscás no existe o fue eliminado.</p>
        <Link to="/noticia" className="px-6 py-3 bg-sky-500 text-black font-black uppercase rounded-xl hover:bg-sky-400 transition-colors">
          Volver a Noticias
        </Link>
      </div>
    );
  }

  const fechaFormateada = new Date(noticia.fecha_publicacion).toLocaleDateString('es-AR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#08060d] transition-colors duration-300 pt-28 pb-20">
      
      {/* Contenedor principal ampliado a max-w-6xl para aprovechar los costados */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* BOTÓN VOLVER (Ahora arriba y fuera de la foto) */}
        <div className="mb-6">
          <Link 
            to="/noticia" 
            className="inline-flex items-center gap-2 bg-white dark:bg-[#0f151e] hover:bg-sky-500 text-slate-700 hover:text-white dark:text-slate-300 px-5 py-2.5 rounded-xl transition-all font-bold text-sm border border-slate-200 dark:border-white/5 shadow-sm"
          >
            <ArrowLeft size={16} /> Volver a Noticias
          </Link>
        </div>

        {/* TARJETA ÚNICA (Contiene la foto y el texto juntos) */}
        <article className="bg-white dark:bg-[#0f151e] rounded-3xl md:rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
          
          {/* FOTO DE PORTADA SIN RECORTES */}
          <div className="w-full bg-slate-100 dark:bg-black">
            <img 
              src={noticia.url_recurso || 'https://via.placeholder.com/1920x1080/0f172a/38bdf8?text=Autodromo+Rafaela'} 
              alt={noticia.titulo}
              className="w-full h-auto max-h-[75vh] object-cover md:object-contain"
            />
          </div>

          {/* CABECERA DE LA NOTICIA */}
          <div className="p-8 md:p-12 border-b border-slate-100 dark:border-white/5">
            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">
              <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-lg"><Calendar size={16} className="text-sky-500"/> {fechaFormateada}</span>
              <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-lg"><User size={16} className="text-sky-500"/> {noticia.autor?.nombre ? `${noticia.autor.nombre} ${noticia.autor.apellido}` : 'Staff Óvalo'}</span>
              <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-lg"><Eye size={16} className="text-sky-500"/> {noticia.vistas + 1} vistas</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white uppercase leading-tight mb-6">
              {noticia.titulo}
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed border-l-4 border-sky-500 pl-4 md:pl-6">
              {noticia.descripcion_breve}
            </p>
          </div>

          {/* CUERPO DEL TEXTO */}
          <div className="p-8 md:p-12">
            <div className="text-slate-800 dark:text-slate-300 text-lg md:text-xl leading-relaxed md:leading-loose whitespace-pre-wrap">
              {noticia.cuerpo}
            </div>
          </div>

        </article>

      </div>
    </main>
  );
};

export default NoticiaDetallePage;