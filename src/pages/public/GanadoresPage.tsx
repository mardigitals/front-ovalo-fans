import { Trophy } from 'lucide-react';
import logo from '/src/assets/icons/logo-autodromo-color.png';
import { GANADORES } from '@/data/historia';

const GanadoresPage = () => {
  // 1. Calculamos cuántas carreras ganó cada piloto dinámicamente
  const victoriasPorPiloto = GANADORES.reduce((acc, carrera) => {
    const nombre = carrera.ganador.trim();
    acc[nombre] = (acc[nombre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="w-full max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6">
      
      {/* HEADER */}
      <div className="flex flex-col items-center justify-center gap-3 md:gap-4 mb-12 md:mb-16 text-center">
        <img src={logo} alt="Logo Autódromo" className="h-10 md:h-14 mb-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
        <h2 className="title-fan text-4xl sm:text-5xl md:text-6xl text-slate-800 dark:text-white uppercase tracking-tighter">
          Ganadores Históricos
        </h2>
        <p className="subtitle-fan text-lg sm:text-xl md:text-2xl max-w-2xl text-cyan-600 dark:text-cyan-400">
          Los volantes que conquistaron la cumbre del automovilismo
        </p>
      </div>
      
      {/* GANADORES */}
       <div className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-white/5 font-black uppercase text-slate-800 dark:text-white">
              <tr>
                <th className="p-4 whitespace-nowrap">N° Carrera</th>
                <th className="p-4 whitespace-nowrap">Fecha</th>
                <th className="p-4 whitespace-nowrap">Piloto ganador</th>
                <th className="p-4 whitespace-nowrap">Marca</th>
                <th className="p-4 whitespace-nowrap">Categoría</th>
              </tr>
            </thead>
            <tbody>
              {GANADORES.map((g, i) => {
                // Sacamos la cantidad de victorias calculada arriba
                const cantidadVictorias = victoriasPorPiloto[g.ganador.trim()];
                
                return (
                  <tr key={i} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">#{g.id}</td>
                    <td className="p-4">{g.fecha}</td>
                    <td className="p-4 font-black uppercase">
                      <div className="flex items-center gap-3">
                        <span>{g.ganador}</span>
                        
                        {/* Lógica de Trofeos: Solo si ganó 2 o más */}
                        {cantidadVictorias >= 2 && (
                          <div className="flex gap-1" title={`${cantidadVictorias} victorias en total`}>
                            {Array.from({ length: cantidadVictorias }).map((_, idx) => (
                              <Trophy 
                                key={idx} 
                                size={16} 
                                className="text-yellow-500 fill-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.6)] relative" 
                                style={{ zIndex: cantidadVictorias - idx }} // Para que el solapamiento quede prolijo
                              />
                            ))}
                          </div>
                        )}
                        
                      </div>
                    </td>
                    <td className="p-4">{g.marca}</td>
                    <td className="p-4">{g.categoria}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};

export default GanadoresPage;