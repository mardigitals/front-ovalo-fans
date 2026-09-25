import { useState, useEffect } from 'react';
import { Flag, CalendarDays, ChevronLeft, ChevronRight, Quote, ArrowRight } from 'lucide-react';
import { ETAPAS_HISTORIA, LINEA_HISTORICA } from '@/data/historia';

const LineaHistoricaPage = () => {
  const [etapaActiva, setEtapaActiva] = useState<any>(ETAPAS_HISTORIA[0]);
  const [imagenActualIndex, setImagenActualIndex] = useState(0);

  const index = etapaActiva ? ETAPAS_HISTORIA.findIndex(e => e.id === etapaActiva.id) : 0;
  const numeroLargada = String(index + 1).padStart(2, '0');

  const fotosSlider = etapaActiva?.fotos || [];

  // Variables para la etapa siguiente
  const hasNext = index < ETAPAS_HISTORIA.length - 1;
  const nextEtapa = hasNext ? ETAPAS_HISTORIA[index + 1] : null;
  const nextPunto = nextEtapa ? LINEA_HISTORICA.find(p => p.etapaId === nextEtapa.id) : null;

  useEffect(() => {
    setImagenActualIndex(0);
  }, [etapaActiva]);

  const nextImagen = () => {
    setImagenActualIndex((prev) => (prev === fotosSlider.length - 1 ? 0 : prev + 1));
  };

  const prevImagen = () => {
    setImagenActualIndex((prev) => (prev === 0 ? fotosSlider.length - 1 : prev - 1));
  };

  const irAEtapaSiguiente = () => {
    if (nextEtapa) {
      setEtapaActiva(nextEtapa);
      // Scrollea suavemente al inicio del panel de lectura
      document.getElementById('panel-lectura')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

    return (
        <div className="w-full flex flex-col items-center">
        
            {/* 1. LÍNEA DE TIEMPO INTERACTIVA */}
            <div className="w-full py-8 px-4 md:px-12 m-2 relative mt-4 mb-10 overflow-x-auto custom-scrollbar">
                <div className="min-w-[900px] md:max-w-[1200px] relative">
                <div className="absolute top-1/2 left-4 right-4 h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 transform -translate-y-1/2 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)] z-0"></div>
                
                <div className="relative z-10 flex justify-between items-center w-full px-4">
                    {LINEA_HISTORICA.map((punto, idx) => (
                    <div 
                        key={idx}
                        className="flex flex-col items-center justify-center cursor-pointer group relative"
                        onClick={() => {
                        const etapaData = ETAPAS_HISTORIA.find(e => e.id === punto.etapaId);
                        if (etapaData) setEtapaActiva(etapaData);
                        }}
                    >
                        <span className="absolute -top-10 whitespace-nowrap px-3 py-1.5 bg-black/90 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                        {ETAPAS_HISTORIA.find(e => e.id === punto.etapaId)?.titulo || 'Desconocida'}
                        </span>

                        <div className={`rounded-full transition-all duration-300 ease-out group-hover:scale-150 group-hover:backdrop-blur-md flex items-center justify-center
                        ${punto.important 
                            ? 'w-6 h-6 bg-cyan-400 shadow-[0_0_20px_rgba(0,0,0,1)] dark:shadow-[0_0_20px_rgba(255,211,238,0.8)] border-2 border-slate-100 dark:border-slate-800 z-20' 
                            : 'w-4 h-4 bg-slate-900 dark:bg-white border-2 border-slate-300 dark:border-slate-600 z-10'
                        }
                        ${etapaActiva?.id === punto.etapaId ? 'ring-4 ring-cyan-500/50 scale-150' : ''} 
                        `}></div>

                        <span className={`absolute top-8 font-black transition-colors duration-300 ${
                        etapaActiva?.id === punto.etapaId ? 'text-institucional-celeste text-[16px]' : 
                        punto.important ? 'text-cyan-600 dark:text-cyan-400 text-[15px]' : 'text-slate-500 dark:text-slate-400 text-xs'
                        }`}>
                        {punto.year}
                        </span>
                    </div>
                    ))}
                </div>
                </div>
            </div>

            {/* 2. PANEL DE LECTURA */}
            {etapaActiva && (
                <div className="flex justify-center w-full lg:pb-12 px-4 scroll-mt-24" id="panel-lectura">
                    <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 md:p-12 relative flex flex-col overflow-hidden w-full max-w-6xl animate-[fadeIn_0.5s_ease-out] shadow-2xl">
                        <div className="flex items-left m-1">
                            <span className="inline-flex items-center gap-2 bg-slate-100 dark:bg-white/5 text-slate-400 mb-6 dark:text-slate-600 font-black uppercase px-6 py-2 rounded-full text-xs border border-slate-200 dark:border-white/10">
                                <Flag size={15} className="text-institucional-celeste" />Etapa {numeroLargada}
                            </span>
                        </div>
                        <div className="flex flex-col items-center text-center mb-10 relative z-10">
                    
                            <div className="flex items-center gap-4 mb-6">
                                <span className="h-[2px] w-12 bg-institucional-celeste"></span>
                                <span className="text-sm md:text-base font-firma  text-fan font-bold  uppercase tracking-[0.3em] flex items-center gap-2">
                                    {etapaActiva.periodo}
                                </span>
                                <span className="h-[2px] w-12 bg-institucional-celeste"></span>
                            </div>
                    
                            <h3 className="title-fan text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-6 leading-tight">
                                {etapaActiva.titulo} 
                            </h3>

                            <span className="inline-flex items-center gap-2 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-firma italic px-6 py-2 rounded-full text-sm md:text-lg border border-slate-200 dark:border-white/10">
                                <CalendarDays size={20} className="text-institucional-celeste" />{etapaActiva.fecha}
                            </span>
                        </div>

                        {fotosSlider.length > 0 && (
                        <div className="relative w-full max-w-4xl mx-auto mb-12">
                            <div className="relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl group border border-slate-200 dark:border-white/10">
                            <img 
                                src={fotosSlider[imagenActualIndex].url} 
                                alt={fotosSlider[imagenActualIndex].epigrafe || `${etapaActiva.titulo} - Foto ${imagenActualIndex + 1}`} 
                                className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700" 
                            />
                            
                            {fotosSlider.length > 1 && (
                                <>
                                <button onClick={prevImagen} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-institucional-celeste text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                                    <ChevronLeft size={24} />
                                </button>
                                <button onClick={nextImagen} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-institucional-celeste text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                                    <ChevronRight size={24} />
                                </button>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {fotosSlider.map((_: any, idx: number) => (
                                    <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === imagenActualIndex ? 'w-6 bg-institucional-celeste' : 'w-2 bg-white/50'}`}></div>
                                    ))}
                                </div>
                                </>
                            )}
                            </div>
                            {fotosSlider[imagenActualIndex].epigrafe && (
                            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-3 font-medium italic">
                                {fotosSlider[imagenActualIndex].epigrafe}
                            </p>
                            )}
                        </div>
                        )}

                        <div className="max-w-5xl mx-auto w-full relative z-10 flex flex-col">
                        <div className="relative mb-12 px-4 md:px-10">
                            <Quote size={40} className="absolute -top-4 -left-2 text-institucional-celeste/20 dark:text-institucional-celeste/10 -z-10 transform rotate-180" />
                            <p className="text-2xl md:text-3xl text-slate-800 dark:text-slate-200 font-medium leading-snug text-center italic">
                            {etapaActiva.resumen}
                            </p>
                        </div>

                        {etapaActiva.descripcionLarga && (
                            <div className="columns-1 md:columns-2 gap-x-12 text-slate-700 dark:text-slate-400 text-lg leading-relaxed text-justify space-y-6">
                            {etapaActiva.descripcionLarga.split('\n').map((parrafo: string, i: number) => {
                                if (!parrafo.trim()) return null;
                                return (
                                <p key={i} className={i === 0 ? "first-letter:text-6xl first-letter:font-black first-letter:text-institucional-celeste first-letter:float-left first-letter:mr-4 first-letter:mt-2" : "mt-6"}>
                                    {parrafo}
                                </p>
                                )
                            })}
                            </div>
                        )}

                            {/* 3. BOTÓN ETAPA SIGUIENTE */}
                            {nextEtapa && (
                                <div className="mt-20 flex flex-col items-center border-t border-slate-200 dark:border-white/10 pt-12 w-full">
                                    <span className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6">
                                        Continuar Leyendo
                                    </span>
                                    
                                    <button
                                        onClick={irAEtapaSiguiente}
                                        className="group flex items-center gap-6 bg-slate-50 dark:bg-[#151515] hover:bg-slate-100 dark:hover:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 hover:border-institucional-celeste/50 px-6 py-4 rounded-full shadow-md hover:shadow-[0_0_30px_rgba(14,165,233,0.15)] transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        {/* Recreación del punto de la línea de tiempo */}
                                        <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)] border-2 border-slate-900 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                                        </div>
                                        
                                        <div className="flex flex-col items-start text-left">
                                        <span className="font-black text-2xl text-slate-800 dark:text-white leading-none">
                                            {nextPunto?.year || nextEtapa.periodo}
                                        </span>
                                        <span className="text-xs font-bold text-institucional-celeste uppercase tracking-widest mt-1">
                                            Etapa {String(index + 2).padStart(2, '0')}
                                        </span>
                                        </div>

                                        <div className="ml-4 p-2 rounded-full bg-slate-200 dark:bg-white/10 group-hover:bg-institucional-celeste group-hover:text-white text-slate-500 dark:text-slate-400 transition-colors duration-300">
                                        <ArrowRight size={20} />
                                        </div>
                                    </button>
                                </div>
                            )}
                    
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LineaHistoricaPage;