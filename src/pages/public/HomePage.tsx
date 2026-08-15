import { Link } from 'react-router-dom';
import heroImage from '@/assets/images/hero-image.png';
import Footer from '@/components/ui/Footer';
import videoHero from '@/assets/videos/ovalo-animacion.mp4';
import videoHeroDark from '@/assets/videos/ovalo-animacion-dark.mp4';
import api from '@/api/axios';
import { useState, useEffect } from 'react';
import { Calendar, Star } from 'lucide-react';

const HomePage = () => {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
    
    // Formateador de fecha formato Argentino
    const formatearFecha = (fechaString: string) => {
      if (!fechaString) return 'Reciente';
      const opciones: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(fechaString).toLocaleDateString('es-AR', opciones);
    };
  
  return(
    <main className="flex flex-col min-h-screen bg-zinc dark:bg-[#08060d] transition-colors duration-300">
      
      {/* image hero */}
      <header className="relative w-full h-[40vh] md:h-screen flex-shrink-0 overflow-hidden bg-gradient-to-r from-transparent via-white/20 to-transparent">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Pista del Autódromo de Rafaela" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-[#08060d]" />
        </div>
      </header>  

      {/* <section> */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 py-16 md:py-24 max-w-4xl mx-auto">
        
        <h2 className="title-fan text-center text-4xl md:text-5xl">
          ¡VIVE LA PASIÓN!
        </h2>
        
        {/* <article> */}
        <div className="space-y-8 mb-12">
          <h3 className="subtitle-fan text-xl md:text-2xl leading-relaxed text-slate-800 dark:text-slate-200">
            Bienvenido a <em className="subtitle-fan not-italic">ÓVALO FANS,</em> tu espacio para vivir la historia y la emoción del automovilismo.
          </h3>
          
          {/* Fondo sutil adaptado a ambos modos */}
          <div className="p-6 rounded-2xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 backdrop-blur-sm">
              <p className="text-slate-600 dark:text-slate-300 font-medium italic mb-2">
                  ¡Elegí la membresía que más se adapte a vos!
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
                  Convertite en un <span className="subtitle-fan text-lg font-black tracking-tighter">P1 · P2 · P3</span> <em className="text-black dark:text-white not-italic text-lg font-bold">FAN</em>, accedé a contenido exclusivo y disfrutá de <em className="text-black dark:text-white not-italic font-bold">beneficios únicos.</em>
              </p>
          </div>
        </div>
      </section>

      <section className="relative p-2 m-2 md:p-6 md:m-6 over-flow-hidden"> 
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest">Cargando portadas...</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </section>

      {/* video hero */}
      <div className="relative w-full h-[40vh] md:h-screen flex-shrink-0 overflow-hidden">
        <div className="absolute inset-0">
          <video src={videoHero} autoPlay loop muted playsInline className="w-full h-full dark:hidden object-cover" />
          <video src={videoHeroDark} autoPlay loop muted playsInline className="w-full h-full object-cover hidden dark:block" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f4f4f5] dark:to-[#08060d]" />
        </div>
      </div>

        
      
      {/* <section> */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 py-16 md:py-24 max-w-4xl mx-auto">
      
        {/* Navegación de acción */}
        <nav className="flex flex-col items-center gap-8">
          <Link 
            to="/login" 
            className="py-5 px-12 font-black rounded-full text-black bg-sky-500 hover:bg-sky-400 
                      shadow-[0_0_25px_rgba(14,165,233,0.3)] hover:shadow-[0_0_45px_rgba(14,165,233,0.6)] 
                      hover:scale-105 transition-all uppercase tracking-widest text-lg"
          >
            ¡Únete a ÓVALO FANS!
          </Link>

          <Link 
            to="/terms-conditions" 
            className="text-slate-500 hover:text-sky-500 dark:text-slate-400 dark:hover:text-sky-400 transition-colors text-xs font-bold uppercase tracking-widest"
          >
            Ver términos y condiciones
          </Link>
        </nav>
      </section>

      {/* <footer> */}
      <Footer />
    </main>
  );
}

export default HomePage;