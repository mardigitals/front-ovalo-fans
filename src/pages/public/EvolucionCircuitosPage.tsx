import logo from '/src/assets/icons/logo-autodromo-color.png';
import { CIRCUITOS } from '@/data/historia';

const EvolucionCircuitosPage = () => {
  return (
    <div className="w-full max-w-6xl mx-auto py-12">
      <div className="flex flex-col items-center justify-center gap-4 mb-20 text-center">
        <img src={logo} className="text-cyan-500 h-14 mb-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
        <h2 className="title-fan text-5xl md:text-6xl text-slate-800 dark:text-white uppercase tracking-tighter">
          Evolución del Óvalo Rafaelino
        </h2>
        <p className="subtitle-fan text-xl md:text-2xl text-cyan-600 dark:text-cyan-400">Los distintos trazados que marcaron épocas</p>
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
};

export default EvolucionCircuitosPage;