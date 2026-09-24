import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ModalHistoria from '@/components/ui/ModalHistoria';
import { ETAPAS_HISTORIA, LINEA_HISTORICA } from '@/data/historia';

const LineaHistoricaPage = () => {
  const [etapaActiva, setEtapaActiva] = useState<any>(ETAPAS_HISTORIA[0]);
  const [etapaSeleccionada, setEtapaSeleccionada] = useState<any>(null);

  const index = etapaActiva ? ETAPAS_HISTORIA.findIndex(e => e.id === etapaActiva.id) : 0;
  const numeroLargada = String(index + 1).padStart(2, '0');

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* LÍNEA DE TIEMPO INTERACTIVA */}
      <div className="w-full py-8 px-4 md:px-12 m-2 relative mt-8 mb-16 overflow-x-auto custom-scrollbar">
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
                <span className="absolute -top-10 whitespace-nowrap px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                  {ETAPAS_HISTORIA.find(e => e.id === punto.etapaId)?.titulo || 'Desconocida'}
                </span>

                <div className={`rounded-full transition-all duration-300 ease-out group-hover:scale-150 group-hover:backdrop-blur-md flex items-center justify-center
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

      {/* TARJETA DE ETAPA */}
      {etapaActiva && (
        <div className="flex justify-center w-full lg:pb-12">
          <div 
            onClick={() => setEtapaSeleccionada(etapaActiva)}
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
      )}

      <ModalHistoria etapa={etapaSeleccionada} onClose={() => setEtapaSeleccionada(null)} />
    </div>
  );
};

export default LineaHistoricaPage;