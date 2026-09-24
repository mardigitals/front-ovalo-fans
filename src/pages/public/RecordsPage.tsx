import { Timer } from 'lucide-react';

const RecordsPage = () => {
  // Mock temporal
  const records = [
    { fecha: "1971-02-28", piloto: "Emilio Bertolini", descripcion: "Récord de velocidad final", velocidad: "278.4 km/h", ganadas: "2" }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-12">
      <div className="flex flex-col items-center justify-center gap-4 mb-16 text-center">
        <Timer size={48} className="text-red-500 mb-2" />
        <h2 className="title-fan text-5xl md:text-6xl text-slate-800 dark:text-white uppercase tracking-tighter">
          Récords del Óvalo
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {records.map((r, i) => (
          <div key={i} className="bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-md hover:border-red-500/50 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-red-500/10 text-red-500 font-black px-3 py-1 rounded-md text-sm">{r.fecha}</span>
              <span className="font-mono text-xl font-black text-slate-800 dark:text-white group-hover:text-red-500 transition-colors">{r.velocidad}</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase mb-2">{r.piloto}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{r.descripcion}</p>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-slate-200 dark:border-white/10 pt-4">
              Carreras Ganadas en el circuito: {r.ganadas}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordsPage;