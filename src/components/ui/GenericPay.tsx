import { useState } from "react";
import { X } from "lucide-react";

// 1. Definimos las Props: ¿Qué espera recibir este componente desde afuera?
interface GenericPayProps {
  onSelectPlan: (nivelId: number) => void; 
  // Opcional: Podés pasarle si está "cargando" para deshabilitar botones
  isLoading?: boolean; 
}

const GenericPay = ({ onSelectPlan, isLoading = false }: GenericPayProps) => {
  const [modalBeneficios, setModalBeneficios] = useState<string | null>(null);

  // Ya no necesitamos un handlePayment interno tan complejo, 
  // simplemente llamamos a la función que nos pasaron por Props.
  const handlePaymentClick = (nivel: number) => {
    onSelectPlan(nivel);
  };

  return (
    <>
      <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="text-center space-y-2">
          <h2 className="title-fan text-center text-3xl md:text-5xl">
            Elegí tu Nivel de FAN
          </h2>
          <p className="text-fan text-slate-600 dark:text-slate-400">Asegurá tu lugar y accedé a los beneficios.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Tarjeta P3 */}
          <div className="border border-slate-200 dark:border-white/10 p-6 rounded-xl text-center flex flex-col h-full">
            <h3 className="title-fan text-xl text-slate-500">Nivel P3</h3>
            <button 
              type="button" 
              onClick={() => setModalBeneficios('P3')} 
              className="subtitle-fan text-sm text-sky-500 hover:text-sky-400 transition-colors mt-1 underline underline-offset-2"
            >
              Ver Beneficios
            </button>
            
            <div className="flex-grow flex flex-col justify-end mt-4">
              <p className="text-2xl font-black mb-4 text-slate-800 dark:text-white">$4.499,05 ARS / mes</p>
              <button 
                onClick={() => handlePaymentClick(3)} 
                disabled={isLoading}
                className="w-full py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
              >
                Seleccionar
              </button>
            </div>
          </div>

          {/* Tarjeta P2 */}
          <div className="border border-sky-500 p-6 rounded-xl text-center relative shadow-[0_0_15px_rgba(14,165,233,0.3)] flex flex-col h-full">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-500 text-black px-3 py-1 text-xs font-black rounded-full">RECOMENDADO</span>
            <h3 className="subtitle-fan text-xl text-sky-500">Nivel P2</h3>
            <button 
              type="button" 
              onClick={() => setModalBeneficios('P2')} 
              className="subtitle-fan text-sm text-sky-500 hover:text-sky-400 transition-colors mt-1 underline underline-offset-2"
            >
              Ver Beneficios
            </button>
            
            <div className="flex-grow flex flex-col justify-end mt-4">
              <p className="text-2xl font-black mb-4 text-slate-800 dark:text-white">$6.999,25 ARS / mes</p>
              <button 
                onClick={() => handlePaymentClick(2)} 
                disabled={isLoading}
                className="w-full py-2 bg-sky-500 text-black rounded-lg hover:bg-sky-400 font-black disabled:opacity-50"
              >
                Seleccionar
              </button>
            </div>
          </div>

          {/* Tarjeta P1 */}
          <div className="border border-yellow-500 p-6 rounded-xl text-center flex flex-col h-full">
            <h3 className="subtitle-fan text-xl text-yellow-500">Nivel P1 VIP</h3>
            <button 
              type="button" 
              onClick={() => setModalBeneficios('P1')} 
              className="subtitle-fan text-sm text-sky-500 hover:text-sky-400 transition-colors mt-1 underline underline-offset-2"
            >
              Ver Beneficios
            </button>
            
            <div className="flex-grow flex flex-col justify-end mt-4">
              <p className="text-2xl font-black mb-4 text-slate-800 dark:text-white">$8.545,45 ARS / mes</p>
              <button 
                onClick={() => handlePaymentClick(1)} 
                disabled={isLoading}
                className="w-full py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 font-black disabled:opacity-50"
              >
                Seleccionar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Beneficios */}
      {modalBeneficios && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white/90 dark:bg-[#08060d]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl relative p-6 animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setModalBeneficios(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-sky-500 transition-colors bg-slate-100 dark:bg-white/5 p-2 rounded-full"
            >
              <X size={20} />
            </button>

            <h3 className="title-fan text-2xl mb-6 text-center text-slate-800 dark:text-white border-b border-slate-200 dark:border-white/10 pb-4">
              Beneficios Nivel {modalBeneficios}
            </h3>

            <ul className="space-y-4 text-slate-600 dark:text-slate-300 font-medium">
              {modalBeneficios === 'P3' && (
                <>
                  <li className="flex items-center gap-3">🏁 Todos los beneficios de P3 FAN.</li>
                  <li className="flex items-center gap-3">⚡ Descuentos del 10% al 20% en comercios adheridos.</li>
                  <li className="flex items-center gap-3">⚡ Descuentos del 20% en pruebas libres.</li>
                  <li className="flex items-center gap-3">⚡ Descuentos del 20% en recitales y carreras.</li>
                </>
              )}
              {modalBeneficios === 'P2' && (
                <>
                  <li className="flex items-center gap-3">🏁 Todos los beneficios de P2 FAN <em>(incluye P3)</em></li>
                  <li className="flex items-center gap-3">⚡ FAST PASS en el TC en Rafaela.</li>
                  <li className="flex items-center gap-3">⚡ Galería de fotos y videos exclusiva.</li>
                  <li className="flex items-center gap-3">⚡ Visitas guiadas al Autódromo.</li>
                  <li className="flex items-center gap-3">⚡ SUPERFAN gift.</li>
                </>
              )}
              {modalBeneficios === 'P1' && (
                <>
                  <li className="flex items-center gap-3">🏁 Todos los beneficios de P1 <em>(incluye P2 y P3)</em></li>
                  <li className="flex items-center gap-3">⭐ Acceso VIP y Hospitalities.</li>
                  <li className="flex items-center gap-3">⭐ Meet & Greet con pilotos.</li>
                  <li className="flex items-center gap-3">⭐ Merchandising exclusivo de regalo.</li>
                </>
              )}
            </ul>

            <div className="mt-8">
              <button 
                onClick={() => window.open('/terms-conditions', '_blank')}
                className="w-full py-3 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white font-black rounded-lg transition-all"
              >
                Conocé más                         
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GenericPay;