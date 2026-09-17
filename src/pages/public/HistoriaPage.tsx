import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import ModalHistoria from '@/components/ui/ModalHistoria';
import heroImage2 from '@/assets/images/hero-image-2.jpg';
import ButtonHome from '@/components/ui/ButtonHome'; 
import Footer from '@/components/ui/Footer';
import { ETAPAS_HISTORIA, LINEA_HISTORICA } from '@/data/historia';

// ============================================================================
// SUB-COMPONENTE 1: La Línea de Tiempo
// ============================================================================
const TimelineInteractiva = ({ etapaActiva, setEtapaActiva }: { etapaActiva: any, setEtapaActiva: (e: any) => void }) => (
  <div className="w-full py-8 px-4 md:px-12 m-2 relative mt-12 mb-16 overflow-x-auto custom-scrollbar">
    <div className="min-w-[900px] md:max-w-[1200px] relative">
      <div className="absolute top-1/2 left-4 right-4 h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 transform -translate-y-1/2 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)] z-0"></div>
      
      <div className="relative z-10 flex justify-between items-center w-full px-4">
        {LINEA_HISTORICA.map((punto, index) => (
          <div 
            key={index}
            className="flex flex-col items-center justify-center cursor-pointer group relative"
            onClick={() => {
              const etapaData = ETAPAS_HISTORIA.find(e => e.id === punto.etapaId);
              if (etapaData) setEtapaActiva(etapaData);
            }}
          >
            <span className="absolute -top-10 whitespace-nowrap px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {ETAPAS_HISTORIA.find(e => e.id === punto.etapaId)?.titulo || 'Desconocida'}
            </span>

            <div className={`rounded-full transition-all duration-300 ease-out group-hover:scale-150 group-hover:backdrop-blur-md group-hover:shadow-[0_0_15px_rgba(255,255,255,0.6)] flex items-center justify-center
              ${punto.important 
                ? 'w-6 h-6 bg-cyan-400 shadow-[0_0_20px_rgba(0,0,0,1)] dark:shadow-[0_0_20px_rgba(255,211,238,0.8)] border-2 border-slate-100 dark:border-slate-800 z-20' 
                : 'w-4 h-4 bg-slate-900 dark:bg-white border-2 border-slate-300 dark:border-slate-600 z-10'
              }
              ${etapaActiva?.id === punto.etapaId ? 'ring-4 ring-cyan-500/50 scale-125' : ''} 
            `}></div>

            <span className={`absolute top-8 font-bold transition-colors duration-300 ${
              punto.important ? 'text-cyan-600 dark:text-cyan-400 text-[15px]' : 'text-slate-600 dark:text-slate-300 text-xs'
            }`}>
              {punto.year}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ============================================================================
// SUB-COMPONENTE 2: La Tarjeta de Detalles
// ============================================================================
const TarjetaEtapa = ({ etapaActiva, onClick }: { etapaActiva: any, onClick: () => void }) => {
  if (!etapaActiva) return null;
  
  const index = ETAPAS_HISTORIA.findIndex(e => e.id === etapaActiva.id);
  const numeroLargada = String(index + 1).padStart(2, '0');

  return (
    <div className="flex justify-center w-full lg:pb-12">
      <div 
        key={etapaActiva.id}
        onClick={onClick}
        className="bg-zinc-200 dark:bg-[#111] backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-8 md:p-10 hover:border-institucional-celeste/50 hover:shadow-lg dark:hover:shadow-[0_0_25px_rgba(14,165,233,0.2)] transition-all duration-500 group relative flex flex-col h-full overflow-hidden cursor-pointer w-full max-w-3xl animate-[fadeIn_0.5s_ease-out]"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-[conic-gradient(#ffffff_90deg,#1e293b_90deg_180deg,#ffffff_180deg_270deg,#1e293b_270deg)] bg-[length:12px_12px] opacity-80"></div>
        <div className="absolute -right-4 -bottom-8 text-[160px] md:text-[200px] font-black italic text-slate-100 dark:text-white/[0.03] pointer-events-none group-hover:text-institucional-celeste/5 transition-colors z-0 leading-none tracking-tighter">
          {numeroLargada}
        </div>

        <div className="flex justify-between items-start mb-6 relative z-10 mt-2">
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-black italic px-4 py-2 rounded-md text-sm md:text-base shadow-sm border-b-2 border-institucional-celeste group-hover:bg-institucional-celeste transition-colors font-mono">
            {etapaActiva.periodo}
          </span>
          <span className="text-sm font-bold text-institucional-celeste uppercase tracking-widest">
            Etapa {numeroLargada}
          </span>
        </div>

        <div className="relative z-10 flex-grow py-4">
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-institucional-celeste transition-colors mb-4">
            {etapaActiva.titulo}
          </h3>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed transition-colors">
            {etapaActiva.resumen}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-300 dark:border-white/10 flex items-center justify-between text-base font-bold text-institucional-celeste group-hover:text-sky-500 transition-colors relative z-10">
          <span className="uppercase tracking-widest text-sm md:text-base">Abrir archivo histórico completo</span>
          <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL (¡Mirá qué cortito quedó!)
// ============================================================================
const HistoriaPage = () => {
  const [etapaActiva, setEtapaActiva] = useState<any>(ETAPAS_HISTORIA[0]);
  const [etapaSeleccionada, setEtapaSeleccionada] = useState<any>(null);
  const [mostrarLogo, setMostrarLogo] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setMostrarLogo(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen pt-16 bg-slate-50 dark:bg-black transition-colors duration-300 relative overflow-hidden">
      
      {/* 🏁 FONDOS */}
      <div className="hidden dark:block absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[800px] bg-cover opacity-40" style={{ backgroundImage: `url('/bg/tierra-fondo.webp')`, maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)'}}></div>
        <div className="absolute bottom-0 left-0 w-full h-[800px] bg-cover opacity-50" style={{ backgroundImage: `url('/bg/asfalto-fondo.webp')`, maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10 space-y-12">
        
        {/* ENCABEZADO ANIMADO */}
        <div className="relative flex items-center justify-center w-full h-[300px] max-w-3xl mx-auto">
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out ${mostrarLogo ? 'opacity-100 blur-none scale-100 z-20' : 'opacity-0 blur-xl scale-110 -z-10'}`}>
                <div className="inline-flex justify-center p-5 bg-white dark:bg-institucional-celeste/10 border border-slate-200 dark:border-institucional-celeste/30 rounded-3xl shadow-md dark:shadow-[0_0_20px_rgba(14,165,233,0.2)] mb-2 transition-all duration-300 hover:scale-105"> 
                    <img src="src/assets/icons/logo-autodromo-horizontal-color.png" alt="Logo Autódromo Rafaela" className="justify-center h-auto max-w-full" />
                </div>
            </div>

            <div className={`absolute inset-0 flex flex-col items-center justify-center text-center space-y-4 transition-all duration-1000 ease-in-out delay-[400ms] ${!mostrarLogo ? 'opacity-100 z-20 translate-y-0' : 'opacity-0 -z-10 translate-y-4'}`}>
                <h1 className="title-fan text-7xl inline-flex px-4 py-4 shadow-[0_0_20px_rgba(14,165,233,0.2)] m-4 rounded-3xl border-slate-200 bg-white/5 backdrop-blur-sm">
                    Historia 
                </h1>
                <p className="text-fan text-lg">Desde la tierra y los paraísos, hasta el asfalto entre paredones.</p>
                <h2 className="subtitle-fan text-3xl md:text-3xl text-cyan-600 dark:text-cyan-400">Rafaela, Cumbre del Automovilismo Argentino</h2>
                <p className="text-fan"><em className="font-bold">Más de un siglo de pasión, velocidad y gloria.</em></p> 
            </div>
        </div>
        
        {/* HERO IMAGE */}
        <div className="relative w-full mx-auto h-[60vh] md:h-[60vh] mt-4 flex items-center justify-center pointer-events-none">
            <img src={heroImage2} alt="Pista Circuito antiguo de Rafaela" className="w-full h-full object-cover opacity-30 dark:opacity-25 mix-blend-luminosity grayscale" style={{ maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 70%)', WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 70%)'}} />
        </div>   

        {/* COMPONENTES EXTRAÍDOS */}
        <TimelineInteractiva etapaActiva={etapaActiva} setEtapaActiva={setEtapaActiva} />
        <TarjetaEtapa etapaActiva={etapaActiva} onClick={() => setEtapaSeleccionada(etapaActiva)} />
      </div>

      <ModalHistoria etapa={etapaSeleccionada} onClose={() => setEtapaSeleccionada(null)} />
      
      <div className="fixed bottom-6 right-6 z-50">
        <ButtonHome />
      </div>
      
      <Footer />    
    </div>
  );
};

export default HistoriaPage;