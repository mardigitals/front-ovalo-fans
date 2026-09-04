import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";

interface GenericPayProps {
  onSelectPlan: (nivelId: number) => void; 
  isLoading?: boolean; 
  titulo?: string; 
  subtitulo?: string; 
  membresias: any[]; 
}

const GenericPay = ({ onSelectPlan, isLoading = false, titulo, subtitulo, membresias }: GenericPayProps) => {
  // Ahora el modal guarda el objeto entero de la membresía para leer sus datos
  const [membresiaActiva, setMembresiaActiva] = useState<any | null>(null);

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(precio);
  };

  // Función para darle jerarquía visual (Oro al más caro, Celeste al medio, Gris al base)
  const obtenerEstilosTarjeta = (index: number) => {
    if (index === 0) return { 
        border: 'border-yellow-500', 
        text: 'text-yellow-500', 
        btn: 'bg-yellow-500 text-black hover:bg-yellow-400', 
        badge: 'VIP', shadow: '' 
    };
    if (index === 1) return { 
        border: 'border-sky-500', 
        text: 'text-sky-500', 
        btn: 'bg-sky-500 text-black hover:bg-sky-400', 
        badge: 'RECOMENDADO', shadow: 'shadow-[0_0_15px_rgba(14,165,233,0.3)]' 
    };
    return { 
        border: 'border-slate-200 dark:border-white/10', 
        text: 'text-slate-500', 
        btn: 'bg-slate-800 text-white hover:bg-slate-700', 
        badge: null, shadow: '' 
    };
  };

  return (
    <>
      <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
        
        {/* TÍTULOS (Solo se muestran si vienen por prop y el estado base lo permite) */}
        {(titulo || subtitulo) && (
            <div className="text-center space-y-2">
            <h2 className="title-fan text-center text-3xl md:text-5xl text-slate-500">{titulo}</h2>
            <p className="text-fan text-slate-600 dark:text-slate-400">{subtitulo}</p>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {membresias.map((membresia, index) => {
            const estilos = obtenerEstilosTarjeta(index);
            
            return (
              <div key={membresia.id} className={`border ${estilos.border} ${estilos.shadow} p-6 rounded-xl text-center relative flex flex-col h-full bg-white dark:bg-[#0a0f16]`}>
                
                {estilos.badge && (
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 ${index === 0 ? 'bg-yellow-500' : 'bg-sky-500'} text-black px-3 py-1 text-[10px] font-black rounded-full tracking-widest`}>
                    {estilos.badge}
                  </span>
                )}
                
                <h3 className={`title-fan text-xl uppercase ${estilos.text}`}>{membresia.nombre}</h3>
                
                <button 
                  type="button" 
                  onClick={() => setMembresiaActiva(membresia)} 
                  className="subtitle-fan text-sm text-sky-500 hover:text-sky-400 transition-colors mt-1 underline underline-offset-2"
                >
                  Ver Beneficios
                </button>
                
                <div className="flex-grow flex flex-col justify-end mt-6">
                  <p className="text-2xl font-black mb-4 text-slate-800 dark:text-white">
                    {formatearPrecio(membresia.precio_mensual)} <span className="text-sm text-slate-500 font-medium">/ mes</span>
                  </p>
                  <button 
                    onClick={() => onSelectPlan(membresia.id)} 
                    disabled={isLoading}
                    className={`w-full py-3 rounded-xl font-black transition-colors uppercase tracking-wide disabled:opacity-50 ${estilos.btn}`}
                  >
                    Seleccionar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Beneficios Dinámico */}
      {membresiaActiva && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white/95 dark:bg-[#08060d]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl relative p-6 md:p-8 animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setMembresiaActiva(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-sky-500 transition-colors bg-slate-100 dark:bg-white/5 p-2 rounded-full"
            >
              <X size={20} />
            </button>

            <h3 className="title-fan text-2xl mb-6 text-center text-slate-800 dark:text-white border-b border-slate-200 dark:border-white/10 pb-4 uppercase">
              Beneficios {membresiaActiva.nombre}
            </h3>

            <ul className="space-y-4 text-slate-600 dark:text-slate-300 font-medium">
              {/* Parseamos los beneficios que redactó el admin y limpiamos las viñetas manuales */}
              {membresiaActiva.descripcion_beneficios
                ?.split('\n')
                .filter((linea: string) => linea.trim() !== '')
                .map((linea: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 leading-relaxed">
                    <CheckCircle2 className="text-sky-500 shrink-0 mt-0.5" size={18} /> 
                    <span>{linea.replace(/^[•\-\*]\s*/, '')}</span>
                  </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
              <button 
                onClick={() => window.open('/terms-conditions', '_blank')}
                className="w-full py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition-all text-sm uppercase tracking-wider"
              >
                Términos y Condiciones
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GenericPay;