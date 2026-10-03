import { Gauge, Trophy, Users, Calendar, ShieldCheck } from 'lucide-react';
import logo from '/src/assets/icons/logo-autodromo-color.png';
import { RECORDS } from '@/data/historia';

const RecordsPage = () => {
  // Función para asignar colores e íconos dinámicos según el TIPO de récord
  const getEstiloPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'velocidad':
        return {
          color: 'text-slate-500 dark:text-white',
          bgGlow: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]',
          borderHover: 'group-hover:border-cyan-500/50',
          icono: <Gauge size={28} className="drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
        };
      case 'victoria':
        return {
          color: 'text-slate-500 dark:text-white',
          bgGlow: 'group-hover:shadow-[0_0_30px_rgba(234,179,8,0.15)]',
          borderHover: 'group-hover:border-yellow-500/50',
          icono: <Trophy size={28} className="drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
        };
      case 'publico':
        return {
          color: 'text-slate-500 dark:text-white',
          bgGlow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]',
          borderHover: 'group-hover:border-emerald-500/50',
          icono: <Users size={28} className="drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        };
      default:
        return {
          color: 'text-slate-500 dark:text-white',
          bgGlow: 'group-hover:shadow-[0_0_30px_rgba(148,163,184,0.15)]',
          borderHover: 'group-hover:border-slate-500/50',
          icono: <ShieldCheck size={28} />
        };
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6">
      
      {/* HEADER */}
      <div className="flex flex-col items-center justify-center gap-3 md:gap-4 mb-12 md:mb-16 text-center">
        <img src={logo} alt="Logo Autódromo" className="h-10 md:h-14 mb-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
        <h2 className="title-fan text-4xl sm:text-5xl md:text-6xl text-slate-800 dark:text-white uppercase tracking-tighter">
          Récords
        </h2>
        <p className="subtitle-fan text-lg sm:text-xl md:text-2xl max-w-2xl">
          Las marcas históricas en el Templo de la Velocidad
        </p>
      </div>
      
      {/* GRILLA DE RÉCORDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {RECORDS.map((record) => {
          const estilo = getEstiloPorTipo(record.tipo);

          return (
            <div 
              key={record.id} 
              className={`group relative flex flex-col bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 transition-all duration-500 ${estilo.borderHover} ${estilo.bgGlow} shadow-lg`}
            >
              
              {/* Header de la tarjeta (Ícono + Año) */}
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 ${estilo.color}`}>
                  {estilo.icono}
                </div>
                <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono font-bold px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                  <Calendar size={14} />
                  {record.año}
                </div>
              </div>

              {/* Título del Récord */}
              <h2 className="title-fan text-lg tracking-widest mb-2">
                {record.nombre}
              </h2>
              {/* LOGUITO DE LA CATEGORÍA (Renderizado condicional y extrayendo la URL) */}
                {record.categoria && record.categoria.length > 0 && (
                  <div className="inline-flex items-center justify-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1.5 m-2  rounded-lg">
                    <img 
                      src={record.categoria[0].url} 
                      alt="Logo categoría" 
                      className="h-8 w-auto m-2 object-contain" // h-4 lo mantiene chiquito, del tamaño del texto
                    />
                  </div>
                )}
              {/* Protagonista (Piloto / Entidad) */}
              <h3 className="font-bold text-2xl sm:text-3xl uppercase mb-1 text-slate-900 dark:text-white leading-tight">
                {record.protagonista}
              </h3>
              <h4 className="title-fan text-2xl sm:text-3xl mb-1 leading-tight">
                {record.velocidad}
              </h4>
              {/* Marca / Vehículo */}
              <p className={`font-black text-sm sm:text-base uppercase tracking-wider mb-6 ${estilo.color}`}>
                {record.marca}
              </p>

              {/* Separador */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-white/20 to-transparent mb-6"></div>

              {/* Detalle descriptivo */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed flex-grow text-justify">
                {record.detalle}
              </p>

            </div>
          );
        })}
      </div>
      
    </div>
  );
};

export default RecordsPage;