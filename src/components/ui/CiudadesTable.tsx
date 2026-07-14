import { MapPin } from "lucide-react";

export function CiudadesTable({ ciudades }: { ciudades: any[] }) {
  return (
    <div className="bg-white dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 rounded-xl p-6 shadow-md w-full mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="text-institucional-celeste" size={20} />
        <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider">Demografía Socios</h3>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-white/10 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <th className="pb-2">Ciudad</th>
            <th className="pb-2 text-right">Cantidad</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {ciudades.slice(0, 5).map((ciudad, idx) => (
            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <td className="py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                {ciudad.ciudad || 'No especificada'}
              </td>
              <td className="py-2.5 text-sm font-bold text-institucional-celeste text-right">
                {ciudad.cantidad}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}