import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import heroImage2 from '@/assets/images/hero-image-2.jpg';
import ButtonHome from '@/components/ui/ButtonHome'; 
import Footer from '@/components/ui/Footer';
import LogoAutodromo from '@/assets/icons/logo-autodromo-horizontal-color.png';
import logo from '@/assets/icons/logo-autodromo-negro.png';
import logoDark from '@/assets/icons/logo-autodromo-blanco.png';

const HistoriaLayout = () => {
  const [mostrarLogo, setMostrarLogo] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setMostrarLogo(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 md:px-6 py-3 text-sm md:text-base uppercase tracking-widest transition-all border-b-[3px] whitespace-nowrap ${
      isActive
        ? 'border-institucional-celeste title-fan bg-institucional-celeste/10' // Estilo activo (Celeste)
        : 'border-transparent text-slate-400 hover:text-slate-800 text-slate-600 dark:hover:text-white hover:border-slate-400' // Inactivo
    }`;

  return (
    <div className="min-h-screen pt-16 bg-slate-50 dark:bg-black transition-colors duration-300 relative overflow-x-hidden">
      
      {/* FONDOS (Se mantienen para todas las sub-páginas) */}
      <div className="hidden dark:block absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[800px] bg-cover opacity-40" style={{ backgroundImage: `url('/bg/tierra-fondo.webp')`, maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)'}}></div>
        <div className="absolute bottom-0 left-0 w-full h-[800px] bg-cover opacity-50" style={{ backgroundImage: `url('/bg/asfalto-fondo.webp')`, maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10 space-y-8">
        
        {/* ENCABEZADO ANIMADO */}
        <div className="relative flex flex-col items-center justify-center w-full min-h-[350px] max-w-4xl mx-auto">
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out ${mostrarLogo ? 'opacity-100 blur-none scale-100 z-20' : 'opacity-0 blur-xl scale-110 -z-10'}`}>
                <div className="inline-flex justify-center p-5 bg-white dark:bg-institucional-celeste/10 border border-slate-200 dark:border-institucional-celeste/30 rounded-3xl shadow-md dark:shadow-[0_0_20px_rgba(14,165,233,0.2)] mb-2 transition-all duration-300 hover:scale-105"> 
                    <img src={LogoAutodromo} alt="Logo Autódromo Rafaela" className="justify-center h-auto max-w-full" />
                </div>
            </div>

            <div className={`absolute inset-0 flex flex-col items-center justify-center text-center space-y-4 pt-6 transition-all duration-1000 ease-in-out delay-[400ms] ${!mostrarLogo ? 'opacity-100 z-20 translate-y-0' : 'opacity-0 -z-10 translate-y-4'}`}>  
                <p className="font-medium italic font-firma text-sm md:text-lg">Desde la tierra entre paraísos, hasta el asfalto entre paredones.</p>
                <h2 className="title-fan text-lg md:p-4 md:text-4xl uppercase p-1">Cumbre del Automovilismo Argentino</h2>
                <p className="font-medium italic font-firma mb-3">Más de un siglo de pasión, velocidad y gloria.</p> 
                <div className="md:block w-1 h-1 bg-slate-700 dark:bg-slate-300 rounded-full" />
                    <div className="flex items-center gap-2">
                    <img src={logo} alt="Logo Autódromo" className="h-7 w-auto dark:hidden opacity-70" />
                    <img src={logoDark} alt="Logo Autódromo" className="h-7 w-auto hidden dark:block opacity-70" />
                </div>
            </div>
        </div>
        
        {/* HERO IMAGE */}
        <div className="relative w-full mx-auto h-[30vh] md:h-[40vh] mt-4 flex items-center justify-center pointer-events-none">
            <img src={heroImage2} alt="Pista Circuito antiguo de Rafaela" className="w-full h-full object-cover opacity-30 dark:opacity-25 mix-blend-luminosity grayscale" style={{ maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 70%)', WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 70%)'}} />
        </div>   

        {/* NAVEGACIÓN ESTILO ACTC */}
        <div className="w-full flex justify-center border-b border-slate-200 dark:border-white/10 mt-8 sticky top-16 z-40 bg-slate-50/90 dark:bg-black/90 backdrop-blur-md">
          <nav className="flex overflow-x-auto custom-scrollbar mb-[-2px] w-full md:w-auto justify-start md:justify-center">
            <NavLink to="/historia/linea-historica" className={navClass}>Línea Histórica</NavLink>
            <NavLink to="/historia/evolucion-circuitos" className={navClass}>Evolución</NavLink>
            <NavLink to="/historia/salon-fama" className={navClass}>Salón de la Fama</NavLink>
            <NavLink to="/historia/ganadores" className={navClass}>Ganadores</NavLink>
            <NavLink to="/historia/records" className={navClass}>Récords</NavLink>
          </nav>
        </div>

        {/* CONTENIDO DINÁMICO DE LAS SUB-PÁGINAS */}
        <div className="animate-in fade-in duration-500 min-h-[40vh]">
          <Outlet />
        </div>

      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <ButtonHome />
      </div>
      
      <Footer />    
    </div>
  );
};

export default HistoriaLayout;