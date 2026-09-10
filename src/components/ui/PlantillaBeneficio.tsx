import { useState, useEffect } from 'react';
import { ChevronLeft, Info, CheckCircle, Clock, AlertCircle, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/api/axios';

interface PlantillaBeneficioProps {
  titulo: string;
  descripcion: string;
  tipoBeneficio: string;
  icono: React.ElementType;
  reglas: string[];
  colorBase?: string;
  bgBase?: string;
  requiereEvento?: boolean; // <-- NUEVA PROP
  tipoEventoFiltro?: string; // Ej: 'TC'
}

const PlantillaBeneficio = ({ 
  titulo, 
  descripcion, 
  tipoBeneficio, 
  icono: Icono, 
  reglas,
  colorBase = 'text-sky-500',
  bgBase = 'bg-sky-500/10',
  requiereEvento = false, // Por defecto es falso
  tipoEventoFiltro = ''
}: PlantillaBeneficioProps) => {
  const [historial, setHistorial] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para el evento
  const [eventosDisponibles, setEventosDisponibles] = useState<any[]>([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<string>('');
  const [errorBackend, setErrorBackend] = useState<string | null>(null);

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      // 1. Cargamos el historial de este beneficio
      const resHistorial = await api.get('/uso-beneficio/mis-usos');
      const misUsos = resHistorial.data.filter((u: any) => u.tipo_beneficio === tipoBeneficio);
      setHistorial(misUsos);

      // 2. Si el beneficio requiere evento, cargamos los eventos disponibles
      if (requiereEvento) {
        // Asumiendo que tenés este endpoint. Si tenés uno general de eventos, usá ese.
        const urlEventos = tipoEventoFiltro === 'TC' 
            ? '/evento/tc-disponibles' 
            : '/evento'; 
            
        const resEventos = await api.get(urlEventos);
        setEventosDisponibles(resEventos.data);
      }

    } catch (error) {
      console.error('Error al cargar datos', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [tipoBeneficio]);

  const handleSolicitar = async () => {
    if (requiereEvento && !eventoSeleccionado) {
      setErrorBackend('Por favor, seleccioná un evento para continuar.');
      return;
    }

    setIsSubmitting(true);
    setErrorBackend(null);
    try {
      await api.post('/uso-beneficio', {
        tipo_beneficio: tipoBeneficio,
        evento_id: requiereEvento ? Number(eventoSeleccionado) : undefined
      });
      await cargarDatos();
    } catch (error: any) {
      setErrorBackend(error.response?.data?.message || 'Error al solicitar el beneficio.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const solicitudPendiente = historial.find(h => h.estado === 'Pendiente');

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in duration-500">
      
      {/* BOTÓN VOLVER */}
      <Link to="/dashboard/beneficios" className="inline-flex items-center gap-2 text-slate-500 hover:text-institucional-celeste transition-colors font-bold uppercase text-xs tracking-widest">
        <ChevronLeft size={16} /> Volver a Beneficios
      </Link>

      {/* CABECERA */}
      <div className="bg-white dark:bg-[#161024] border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className={`p-4 rounded-2xl ${bgBase} ${colorBase} flex-shrink-0 z-10`}>
          <Icono size={48} strokeWidth={1.5} />
        </div>
        <div className="z-10 flex-grow">
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">
            {titulo}
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            {descripcion}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#0a0f16] border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
            <h3 className="text-lg font-black uppercase tracking-wider text-slate-800 dark:text-white mb-6">
              Estado de tu Beneficio
            </h3>

            {isLoading ? (
              <div className="animate-pulse flex space-x-4">
                <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
              </div>
            ) : solicitudPendiente ? (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex flex-col items-center text-center gap-4">
                <Clock className="text-amber-500" size={48} />
                <div>
                  <h4 className="text-xl font-bold text-amber-500 uppercase tracking-widest">Solicitud en Proceso</h4>
                  <p className="text-slate-400 mt-2 text-sm">
                    Solicitaste este beneficio el {new Date(solicitudPendiente.fecha_solicitud).toLocaleDateString('es-AR')}. 
                    El Staff está procesando tu pedido.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border-4 border-emerald-500/20 mb-6">
                  <CheckCircle className="text-emerald-500" size={36} />
                </div>
                <h4 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">Beneficio Disponible</h4>
                <p className="text-slate-500 mb-8">Cumples con los requisitos. Estás listo para solicitarlo.</p>
                
                {/* 🏁 SELECTOR DE EVENTOS SI ES REQUERIDO 🏁 */}
                {requiereEvento && (
                   <div className="w-full max-w-md mb-8">
                     <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 text-left">
                       Seleccioná el Evento
                     </label>
                     {eventosDisponibles.length > 0 ? (
                       <select 
                         className="w-full bg-slate-50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:border-institucional-celeste focus:ring-2 outline-none transition-colors"
                         value={eventoSeleccionado}
                         onChange={(e) => setEventoSeleccionado(e.target.value)}
                       >
                         <option value="" disabled>Elegí una fecha...</option>
                         {eventosDisponibles.map(evento => (
                           <option key={evento.id} value={evento.id}>
                             {evento.titulo} ({new Date(evento.fecha_evento).toLocaleDateString('es-AR')})
                           </option>
                         ))}
                       </select>
                     ) : (
                       <div className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 p-3 rounded-xl">
                         No hay eventos disponibles próximos.
                       </div>
                     )}
                   </div>
                )}

                {errorBackend && (
                   <div className="bg-red-500/10 border-l-4 border-red-500 text-red-600 dark:text-red-400 p-4 rounded-r-xl mb-6 w-full text-left flex items-start gap-3">
                     <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
                     <span className="text-sm font-medium leading-tight">{errorBackend}</span>
                   </div>
                )}
                
                <button 
                  onClick={handleSolicitar}
                  disabled={isSubmitting || (requiereEvento && eventosDisponibles.length === 0)}
                  className={`w-full md:w-auto px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-lg hover:-translate-y-1 ${
                    isSubmitting || (requiereEvento && eventosDisponibles.length === 0)
                      ? 'bg-slate-500 text-white opacity-50 cursor-not-allowed' 
                      : 'bg-institucional-celeste hover:bg-sky-400 text-white shadow-sky-500/30'
                  }`}
                >
                  {isSubmitting ? 'Procesando...' : 'Solicitar Beneficio Ahora'}
                </button>
              </div>
            )}
          </div>

          {/* HISTORIAL LOG (Se mantiene igual) */}
          {historial.length > 0 && (
            <div className="bg-white dark:bg-[#161024] border border-slate-200 dark:border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-xs mb-4 pb-4 border-b border-slate-200 dark:border-white/10">
                <History size={16} /> Historial de Uso
              </div>
              <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                {historial.map((uso) => (
                  <div key={uso.id} className="flex justify-between items-center bg-slate-50 dark:bg-[#0a0f16] p-4 rounded-xl border border-slate-100 dark:border-white/5">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">
                        {new Date(uso.fecha_solicitud).toLocaleDateString('es-AR')}
                      </p>
                      {uso.evento && <p className="text-xs text-institucional-celeste font-bold">{uso.evento.nombre}</p>}
                    </div>
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                      uso.estado === 'Completado' ? 'bg-emerald-500/10 text-emerald-500' :
                      uso.estado === 'Rechazado' ? 'bg-red-500/10 text-red-500' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>
                      {uso.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: REGLAS (Se mantiene igual) */}
        <div className="md:col-span-1">
          <div className="bg-slate-50 dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sticky top-24">
            <div className="flex items-center gap-2 text-institucional-celeste mb-4">
              <Info size={20} />
              <h3 className="font-bold uppercase tracking-wider text-sm">Reglas de Uso</h3>
            </div>
            <ul className="space-y-4">
              {reglas.map((regla, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-institucional-celeste mt-1.5 flex-shrink-0"></div>
                  <p>{regla}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlantillaBeneficio;