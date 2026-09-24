import { Trophy } from 'lucide-react';

const GanadoresPage = () => {
  // Mock temporal hasta que crees el JSON
  const ganadores = [
    { carrera: "1", fecha: "1919-05-25", piloto: "Juan Perez", marca: "Ford", categoria: "Fuerza Libre" }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-12">
      <div className="flex flex-col items-center justify-center gap-4 mb-16 text-center">
        <Trophy size={48} className="text-institucional-celeste mb-2" />
        <h2 className="title-fan text-5xl md:text-6xl text-slate-800 dark:text-white uppercase tracking-tighter">
          Ganadores Históricos
        </h2>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-white/5 font-black uppercase text-slate-800 dark:text-white">
              <tr>
                <th className="p-4">N° Carrera</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Piloto</th>
                <th className="p-4">Marca</th>
                <th className="p-4">Categoría</th>
              </tr>
            </thead>
            <tbody>
              {ganadores.map((g, i) => (
                <tr key={i} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="p-4 font-mono font-bold text-institucional-celeste">#{g.carrera}</td>
                  <td className="p-4">{g.fecha}</td>
                  <td className="p-4 font-black uppercase">{g.piloto}</td>
                  <td className="p-4">{g.marca}</td>
                  <td className="p-4">{g.categoria}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GanadoresPage;