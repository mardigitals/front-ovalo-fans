import { useState, useEffect } from 'react';
import logo from '@/assets/icons/logo-autodromo-negro.png';
import api from '@/api/axios';
import CalendarioVisualizador from '@/components/ui/Calendar';
import ButtonHome from '@/components/ui/ButtonHome';
import Footer from '@/components/ui/Footer';

const CalendarPage = () => {
  const [eventos, setEventos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        // Asegúrate de que en el backend este endpoint (GET /evento) tenga @Public() o no requiera token, 
        // para que los fans sin registrarse puedan verlo.
        const response = await api.get('/evento');
        setEventos(response.data);
      } catch (error) {
        console.error("Error cargando eventos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventos();
  }, []);

  return (
    <main className="flex flex-col pt-16 min-h-screen bg-zinc dark:bg-[#08060d] transition-colors duration-300">
      
      {/* HEADER HERO (Adaptado a menor altura para dar espacio al calendario) */}
      <header className="absolute top-0 w-full h-[50vh] flex-shrink-0 overflow-hidden bg-gradient-to-r from-transparent via-white/20 to-transparent z-0">
        <div className="absolute inset-0">
          <img 
            src={logo} 
            alt="Logo Autódromo de Rafaela" 
            className="w-full h-full object-cover opacity-60 dark:opacity-40" 
          />          
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc/80 to-zinc dark:via-[#08060d]/80 dark:to-[#08060d]" />
        </div>
      </header>  

      {/* BOTÓN FLOTANTE PARA VOLVER A LA WEB */}
      <div className="fixed bottom-6 right-6 z-50">
        <ButtonHome />
      </div>

      <section className="relative z-10 flex flex-col items-center px-4 py-16 md:py-20 w-full max-w-6xl mx-auto flex-grow">
        
        <div className="text-center mb-10">
          <h2 className="title-fan text-4xl md:text-5xl uppercase drop-shadow-lg">
            CALENDARIO DE EVENTOS
          </h2>
          <h3 className="subtitle-fan text-lg md:text-xl text-slate-700 dark:text-slate-300 mt-2">
            Seguí de cerca la actividad del <em className="not-italic text-institucional-celeste">templo de la velocidad.</em>
          </h3>
        </div>

        {/* CONTENEDOR DEL CALENDARIO */}
        <div className="w-full w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-white/10">
              <div className="w-12 h-12 border-4 border-institucional-celeste border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400 font-bold tracking-widest uppercase text-sm animate-pulse">
                Cargando Motores...
              </p>
            </div>
          ) : (
            <CalendarioVisualizador eventos={eventos} />
          )}
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  );
};

export default CalendarPage;