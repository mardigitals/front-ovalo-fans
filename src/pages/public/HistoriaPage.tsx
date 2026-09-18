import { useState, useEffect } from 'react';
import { ArrowRight, Ellipse, Users, Award, LineDotRightHorizontal, UserStar } from 'lucide-react';
import ModalHistoria from '@/components/ui/ModalHistoria';
import heroImage2 from '@/assets/images/hero-image-2.jpg';
import ButtonHome from '@/components/ui/ButtonHome'; 
import Footer from '@/components/ui/Footer';

import { ETAPAS_HISTORIA, LINEA_HISTORICA, CIRCUITOS, HOMENAJES } from '@/data/historia';

// ============================================================================
// SUB-COMPONENTE 1: La Línea de Tiempo
// ============================================================================
const TimelineInteractiva = ({ etapaActiva, setEtapaActiva }: { etapaActiva: any, setEtapaActiva: (e: any) => void }) => (

  <div id="linea-historica" className="w-full py-8 px-4 md:px-12 m-2 relative mt-12 mb-16 overflow-x-auto custom-scrollbar scroll-mt-24">
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
            <span className="absolute -top-10 whitespace-nowrap px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
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
// SUB-COMPONENTE 3: Evolución de los Circuitos
// ============================================================================
const SeccionCircuitos = () => (

  <div id="circuitos" className="w-full max-w-6xl mx-auto py-24 border-t border-slate-200 dark:border-white/10 mt-12 scroll-mt-24">
    <div className="flex flex-col items-center justify-center gap-4 mb-20">
      <Ellipse size={48} className="text-cyan-500 mb-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
      <h2 className="title-fan text-5xl md:text-7xl text-slate-800 dark:text-white uppercase tracking-tighter text-center">
        Evolución del Óvalo
      </h2>
      <p className="subtitle-fan text-xl md:text-2xl text-cyan-600 dark:text-cyan-400">Los dibujos que marcaron épocas</p>
    </div>
    
    <div className="space-y-32">
      {CIRCUITOS.map((circuito, index) => (
        <div key={circuito.id} className="w-full flex flex-col items-center">
          
          <div className="relative w-full h-[50vh] md:h-[70vh] rounded-[2rem] overflow-hidden shadow-2xl group border border-slate-200 dark:border-white/10">
            <img 
              src={circuito.foto} 
              alt={circuito.nombre} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-700"></div>
            
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col justify-end">
              <div className="inline-block bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 text-cyan-300 font-mono font-bold px-4 py-2 rounded-xl w-max mb-4 shadow-lg">
                {circuito.epoca} | {circuito.medida}
              </div>
              <h3 className="title-fan text-4xl md:text-6xl text-white uppercase mb-4 drop-shadow-lg">
                {circuito.nombre}
              </h3>
              <p className="text-lg md:text-2xl text-slate-200 font-medium leading-relaxed max-w-4xl drop-shadow-md">
                {circuito.detalle}
              </p>
            </div>
          </div>

          {index < CIRCUITOS.length - 1 && (
            <div className="w-full mt-32 flex justify-center items-center opacity-40">
              <div className="w-3/4 md:w-1/2 h-4 bg-[conic-gradient(#ffffff_90deg,#1e293b_90deg_180deg,#ffffff_180deg_270deg,#1e293b_270deg)] bg-[length:24px_24px] rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)]"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

// ============================================================================
// SUB-COMPONENTE 4: Salón de la Fama
// ============================================================================
const SeccionHomenajes = () => (
  <div id="salon-fama" className="w-full max-w-6xl mx-auto py-24 mt-12 scroll-mt-24">
    <div className="flex flex-col items-center justify-center gap-4 mb-32 text-center">
      <Award size={56} className="text-amber-500 mb-2 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
      <h2 className="title-fan text-5xl md:text-7xl text-slate-800 dark:text-white uppercase tracking-tighter">
        Salón de la Fama
      </h2>
      <p className="subtitle-fan text-xl md:text-2xl text-amber-500">Los nombres que forjaron nuestra HISTORIA</p>
    </div>

    <div className="space-y-16">
      {HOMENAJES.map((homenaje, index) => (
        <div key={homenaje.id} className="w-full flex flex-col items-center">
          
          <div className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 lg:gap-20 group w-full`}>
            <div className="w-full md:w-1/2 h-[450px] md:h-[600px] rounded-[2rem] overflow-hidden relative shadow-[0_0_40px_rgba(0,0,0,0.4)] dark:shadow-[0_0_40px_rgba(245,158,11,0.1)] border border-slate-200 dark:border-white/10 shrink-0">
              <div className="absolute inset-0 bg-amber-500/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-700"></div>
              <img 
                src={homenaje.foto} 
                alt={homenaje.nombre} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
              />
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 md:px-8">
              <div className="flex items-center gap-3 mb-2">
                <UserStar size={32} className="text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400 font-black uppercase tracking-widest text-xl border-b-2 border-amber-500/30 pb-1">
                  {homenaje.rol}
                </span>
              </div>
              <h3 className="title-fan text-5xl md:text-7xl text-slate-900 dark:text-white uppercase leading-none drop-shadow-md">
                {homenaje.nombre}
              </h3>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {homenaje.descripcion}
              </p>
            </div>
          </div>

          {index < HOMENAJES.length - 1 && (
            <div className="w-full mt-32 mb-16 flex justify-center items-center opacity-80">
              <div className="h-[2px] w-full max-w-4xl bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_15px_rgba(245,158,11,0.8)]"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
const HistoriaPage = () => {
  const [etapaActiva, setEtapaActiva] = useState<any>(ETAPAS_HISTORIA[0]);
  const [etapaSeleccionada, setEtapaSeleccionada] = useState<any>(null);
  const [mostrarLogo, setMostrarLogo] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setMostrarLogo(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Función para hacer scroll suave
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-slate-50 dark:bg-black transition-colors duration-300 relative overflow-hidden">
      
      {/* FONDOS */}
      <div className="hidden dark:block absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[800px] bg-cover opacity-40" style={{ backgroundImage: `url('/bg/tierra-fondo.webp')`, maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)'}}></div>
        <div className="absolute bottom-0 left-0 w-full h-[800px] bg-cover opacity-50" style={{ backgroundImage: `url('/bg/asfalto-fondo.webp')`, maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10 space-y-12">
        
        {/* ENCABEZADO ANIMADO */}
        <div className="relative flex flex-col items-center justify-center w-full min-h-[350px] max-w-4xl mx-auto">
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
                <p className="text-fan mb-6"><em className="font-bold">Más de un siglo de pasión, velocidad y gloria.</em></p> 
                
                {/*  LOS 3 BOTONES GLASS  */}
                <div className="flex flex-wrap justify-center gap-3 mt-2 pt-4">
                  <button 
                    onClick={() => scrollToSection('linea-historica')}
                   className="
                      group relative flex items-center gap-2 px-6 py-2.5 rounded-2xl 
                      tracking-widest text-xl border-slate-300 transition-all duration-300
                      bg-sky-50 subtitle-fan hover:text-sky-600 border border-sky-200 shadow-sm
                      hover:bg-sky-100 hover:-translate-y-1 hover:shadow-md
                      dark:bg-white/[0.03] dark:subtitle-fan dark:border-white/0 
                      shadow-[0_0_20px_rgba(14,165,233,0.8)]
                      dark:hover:border-sky-400/50 dark:hover:text-sky-500 hover:shadow-[0_0_25px_rgba(14,165,233,0.95)]
                    "
                  >
                    <LineDotRightHorizontal size={18} className="transition-transform duration-300 group-hover:scale-110 text-sky-500 dark:text-sky-400 group-hover:text-sky-700 dark:group-hover:text-sky-300" 
                    /> Línea Histórica
                  </button>
                 <button
                    onClick={() => scrollToSection('circuitos')}
                  className="
                      group relative flex items-center gap-2 px-6 py-2.5 rounded-3xl 
                      tracking-widest text-xl border-slate-300 transition-all duration-300
                      bg-sky-50 subtitle-fan hover:text-sky-600 border border-sky-200 shadow-sm
                      hover:bg-sky-100 hover:-translate-y-1 hover:shadow-md
                      dark:bg-white/[0.03] dark:subtitle-fan dark:border-white/0 
                      shadow-[0_0_20px_rgba(14,165,233,0.8)]
                      dark:hover:border-sky-400/50 dark:hover:text-sky-500 hover:shadow-[0_0_25px_rgba(14,165,233,0.95)]
                    "
                  >
                    {/* El icono cambia de color y se agranda un poquito al pasar el mouse */}
                    <Ellipse 
                      size={18} 
                      className="transition-transform duration-300 group-hover:scale-110 text-sky-500 dark:text-sky-400 group-hover:text-sky-700 dark:group-hover:text-sky-300" 
                    />
                    Evolución de circuitos
                  </button>
                  
                  <button 
                    onClick={() => scrollToSection('salon-fama')}
                    className="
                      group relative flex items-center gap-2 px-6 py-2.5 rounded-2xl 
                      tracking-widest text-xl border-slate-300 transition-all duration-300
                      bg-sky-50 subtitle-fan hover:text-sky-600 border border-sky-200 shadow-sm
                      hover:bg-sky-100 hover:-translate-y-1 hover:shadow-md
                      dark:bg-white/[0.03] dark:subtitle-fan dark:border-white/0 
                      shadow-[0_0_20px_rgba(14,165,233,0.8)]
                      dark:hover:border-sky-400/50 dark:hover:text-sky-500 hover:shadow-[0_0_25px_rgba(14,165,233,0.95)]
                    "
                  >
                    <Award size={18} className="transition-transform duration-300 group-hover:scale-110 text-sky-500 dark:text-sky-400 group-hover:text-sky-700 dark:group-hover:text-sky-300" 
                    /> Salón de la Fama
                  </button>
                </div>
            </div>
        </div>
        
        {/* HERO IMAGE */}
        <div className="relative w-full mx-auto h-[60vh] md:h-[60vh] mt-4 flex items-center justify-center pointer-events-none">
            <img src={heroImage2} alt="Pista Circuito antiguo de Rafaela" className="w-full h-full object-cover opacity-30 dark:opacity-25 mix-blend-luminosity grayscale" style={{ maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 70%)', WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 70%)'}} />
        </div>   

        {/* 1. LÍNEA DE TIEMPO */}
        <TimelineInteractiva etapaActiva={etapaActiva} setEtapaActiva={setEtapaActiva} />
        <TarjetaEtapa etapaActiva={etapaActiva} onClick={() => setEtapaSeleccionada(etapaActiva)} />

        {/* 2. NUEVAS SECCIONES */}
        <SeccionCircuitos />
        <SeccionHomenajes />

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