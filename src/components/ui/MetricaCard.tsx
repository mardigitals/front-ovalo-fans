interface MetricaCardProps {
  valor: React.ReactNode;
  titulo: string;
  subtitulo: string;
  gradiente?: string;
}

export const MetricaCard = ({ 
  valor, 
  titulo, 
  subtitulo, 
  gradiente = "bg-gradient-to-br from-white/60 via-cyan-600 to-cyan-600" 
}: MetricaCardProps) => {
  return (
    <div className={`w-[calc(50%-0.5rem)] md:w-auto md:flex-1 glass-neon-btn ${gradiente} border border-slate-300 dark:border-white/30 p-5 rounded-2xl flex flex-col items-center text-center gap-2 transition-all hover:border-stone-500/30`}>
      <div className="text-5xl font-bold text-white flex items-center justify-center">
        {valor}
      </div>
      <p className="md:text-3xl text-2xl font-black text-slate-800 dark:text-white leading-none">
        {titulo}
      </p>
      <p className="text-sm md:p-4 pt-3 text-white">
        {subtitulo}
      </p>
    </div>
  );
};