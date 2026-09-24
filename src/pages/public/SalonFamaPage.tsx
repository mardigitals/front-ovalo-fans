import { Award, UserStar } from 'lucide-react';
import { HOMENAJES } from '@/data/historia';

const SalonFamaPage = () => {
  return (
    <div className="w-full max-w-6xl mx-auto py-12">
      <div className="flex flex-col items-center justify-center gap-4 mb-24 text-center">
        <Award size={56} className="text-amber-500 mb-2 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
        <h2 className="title-fan text-5xl md:text-6xl text-slate-800 dark:text-white uppercase tracking-tighter">
          Salón de la Fama
        </h2>
        <p className="subtitle-fan text-xl md:text-2xl text-amber-500">Los nombres que forjaron nuestra historia</p>
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
};

export default SalonFamaPage;