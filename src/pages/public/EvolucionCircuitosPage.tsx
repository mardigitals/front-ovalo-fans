import { createPortal } from 'react-dom';
import { useState } from 'react';
import { RulerDimensionLine, Gauge, TriangleRight, RotateCw, RotateCcw, X, ZoomIn, RefreshCw, Road } from 'lucide-react';
import logo from '/src/assets/icons/logo-autodromo-color.png';
import { CIRCUITOS } from '@/data/historia';

const EvolucionCircuitosPage = () => {
  const [imagenModal, setImagenModal] = useState<string | null>(null);

  return (
    <div className="w-full max-w-6xl mx-auto py-8 md:py-12 px-4 sm:px-6">
      
      <div className="flex flex-col items-center justify-center gap-3 md:gap-4 mb-12 md:mb-20 text-center">
        <img src={logo} alt="Logo Autódromo" className="h-10 md:h-14 mb-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
        <h2 className="title-fan text-4xl sm:text-5xl md:text-6xl text-slate-800 dark:text-white uppercase tracking-tighter">
          Evolución del Óvalo Rafaelino
        </h2>
        <p className="subtitle-fan text-lg sm:text-xl md:text-2xl text-cyan-600 dark:text-cyan-400 max-w-2xl">
          Los distintos trazados que marcaron épocas
        </p>
      </div>
      
      <div className="space-y-16 md:space-y-24">
        {CIRCUITOS.map((circuito, index) => (
          <div key={circuito.id} className="w-full flex flex-col items-center max-w-4xl mx-auto">
            
            {/* 1. LA FOTO DEL CIRCUITO (Auto-ajustable, sin recortes) */}
            <div 
              className="relative w-full rounded-t-2xl md:rounded-t-3xl overflow-hidden shadow-xl border-t-2 border-x-2 border-slate-200 dark:border-white/10 z-10 bg-white dark:bg-[#050505] cursor-pointer group"
              onClick={() => setImagenModal(circuito.foto)}
            >
              <img 
                src={circuito.foto} 
                alt={circuito.nombre} 
                className="w-full h-auto block grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 opacity-95 group-hover:opacity-100 group-hover:scale-[1.02]" 
              />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                <div className="bg-cyan-500/80 backdrop-blur-sm text-white px-6 py-3 rounded-full flex items-center gap-2 font-bold uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                  <ZoomIn size={20} /> Ampliar Plano
                </div>
              </div>
            </div>

            {/* 2. LA TARJETA DE DETALLES */}
            <div className="relative z-20 w-full bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-b-2xl md:rounded-b-3xl p-5 sm:p-8 md:p-10 shadow-lg dark:shadow-[0_0_30px_rgba(6,182,212,0.1)] flex flex-col items-center text-center mt-[-2px]">
              
              <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-cyan-500/10 border border-slate-300 dark:border-cyan-500/30 font-mono font-bold px-4 py-1.5 md:px-5 md:py-2 rounded-xl mb-4 md:mb-6 shadow-inner text-cyan-800 dark:text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                <span className="uppercase tracking-widest text-xs md:text-sm">{circuito.epoca}</span>
              </div>
              
              <h3 className="title-fan text-3xl sm:text-4xl md:text-5xl uppercase mb-6 md:mb-8 text-slate-900 dark:text-white drop-shadow-sm leading-tight">
                {circuito.nombre}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 w-full mb-6 md:mb-8">

                {circuito.trazados && (
                  <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl group hover:border-cyan-500/50 transition-colors">
                    <div className="text-cyan-600 dark:text-cyan-400 mb-1 md:mb-2 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"><Road size={20} className="md:w-6 md:h-6" /></div>
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Cantidad circuitos</span>
                    <span className="text-xs sm:text-sm md:text-base font-black text-slate-800 dark:text-white leading-tight">{circuito.trazados}</span>
                  </div>
                )}

                <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl group hover:border-cyan-500/50 transition-colors">
                  <div className="text-cyan-600 dark:text-cyan-400 mb-1 md:mb-2 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"><RulerDimensionLine size={20} className="md:w-6 md:h-6" /></div>
                  <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Medida</span>
                  <span className="text-xs sm:text-sm md:text-base font-black text-slate-800 dark:text-white leading-tight">{circuito.medida}</span>
                </div>

                <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl group hover:border-cyan-500/50 transition-colors">
                  <div className="text-cyan-600 dark:text-cyan-400 mb-1 md:mb-2 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"><TriangleRight size={20} className="md:w-6 md:h-6" /></div>
                  <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Peralte</span>
                  <span className="text-xs sm:text-sm md:text-base font-black text-slate-800 dark:text-white leading-tight">{circuito.pendiente}</span>
                </div>

                <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl group hover:border-cyan-500/50 transition-colors">

                    <div className="text-cyan-600 dark:text-cyan-400 mb-1 md:mb-2 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                      {circuito.sentido === 'anti-horario' ? (<RotateCcw size={20} className="md:w-6 md:h-6" />)
                       : circuito.sentido === 'horario' ? ((<RotateCw size={20} className="md:w-6 md:h-6" />)) 
                       : (<RefreshCw size={20} className="md:w-6 md:h-6" />)
                      }
                    </div>
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Sentido</span>
                    <span className="text-xs sm:text-sm md:text-base font-black text-slate-800 dark:text-white capitalize leading-tight">{circuito.sentido}</span>
                  
                </div>
                {circuito.record &&(
                  <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl group hover:border-cyan-500/50 transition-colors">
                    <div className="text-cyan-600 dark:text-cyan-400 mb-1 md:mb-2 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"><Gauge size={20} className="md:w-6 md:h-6" /></div>
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Récord de vuelta promedio</span>
                    <span className="text-xs sm:text-sm md:text-base font-black text-slate-800 dark:text-white leading-tight">{circuito.record}</span>
                  </div>
                )}
                
                {circuito.recordmax &&(
                  <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl group hover:border-cyan-500/50 transition-colors">
                    <div className="text-cyan-600 dark:text-cyan-400 mb-1 md:mb-2 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"><Gauge size={20} className="md:w-6 md:h-6" /></div>
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Récord velocidad final</span>               
                    <span className="text-xs sm:text-sm md:text-base font-black text-slate-800 dark:text-white leading-tight">{circuito.recordmax}</span>
                  </div>
                )}

                {circuito.recordmoto && (
                  <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl group hover:border-cyan-500/50 transition-colors">
                    <div className="text-cyan-600 dark:text-cyan-400 mb-1 md:mb-2 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"><Gauge size={20} className="md:w-6 md:h-6" /></div>
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Récord de velocidad final (moto)</span>
                    <span className="text-xs sm:text-sm md:text-base font-black text-slate-800 dark:text-white leading-tight">{circuito.recordmoto}</span>
                  </div>
                )}
          
                {circuito.recordsud && (
                  <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl group hover:border-cyan-500/50 transition-colors">  
                    <div className="text-cyan-600 dark:text-cyan-400 mb-1 md:mb-2 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"><Gauge size={20} className="md:w-6 md:h-6" /></div>
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Récord sudamericano de vuelta promedio</span>
                    <span className="text-xs sm:text-sm md:text-base font-black text-slate-800 dark:text-white leading-tight">{circuito.recordsud}</span>
                  </div>
                )}

              </div>
              
              <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-4xl text-justify md:text-center mt-2 border-t border-slate-200 dark:border-white/10 pt-6 md:pt-8">
                {circuito.detalle}
              </p>

            </div>

            {/* 3. SEPARADOR */}
            {index < CIRCUITOS.length - 1 && (
              <div className="w-full mt-16 md:mt-24 flex justify-center items-center opacity-40 px-4 md:px-0">
                <div className="w-full h-3 md:h-4 bg-[conic-gradient(#ffffff_90deg,#1e293b_90deg_180deg,#ffffff_180deg_270deg,#1e293b_270deg)] bg-[length:16px_16px] md:bg-[length:24px_24px] rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)]"></div>
              </div>
            )}
          </div>
        ))}
      </div>

     {/* 4. MODAL PARA AMPLIAR IMAGEN */}
      {imagenModal && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setImagenModal(null)}
        >
          <button 
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-red-500/80 text-white rounded-full backdrop-blur-md transition-colors z-50"
            onClick={(e) => {
              e.stopPropagation();
              setImagenModal(null);
            }}
          >
            <X size={32} />
          </button>
          
          <img 
            src={imagenModal} 
            alt="Plano Ampliado" 
            className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] rounded-lg cursor-default"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>,
        document.body
      )}
      
    </div>
  );
};

export default EvolucionCircuitosPage;