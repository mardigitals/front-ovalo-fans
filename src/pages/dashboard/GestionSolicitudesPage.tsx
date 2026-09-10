import { useState, useEffect } from 'react';
import { 
  ClipboardList, CheckCircle, XCircle, Clock, Search, 
  Eye, Mic, CarFront, MapPin, Gift, AlertCircle, Loader2,
  Zap, Crown, Wrench, Ticket, Database
} from 'lucide-react';
import api from '@/api/axios';
import NotificationBadge from '@/components/ui/NotificationBadge';

type TipoSolicitudManual = 'PACECAR_RESCATE' | 'SALA_PRENSA' | 'VISITAS_GUIADAS' | 'PLACA_RECTA' | 'REGALO_SUPERFAN';

const TABS_MANUALES: { id: TipoSolicitudManual; label: string }[] = [
  { id: 'PACECAR_RESCATE', label: 'Rescates' },
  { id: 'SALA_PRENSA', label: 'Sala Prensa' },
  { id: 'VISITAS_GUIADAS', label: 'Visitas Guiadas' },
  { id: 'PLACA_RECTA', label: 'Placas' },
  { id: 'REGALO_SUPERFAN', label: 'Regalos' },
];

const GestionSolicitudesPage = () => {
  const [activeTab, setActiveTab] = useState<TipoSolicitudManual>('PACECAR_RESCATE');
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [logGeneral, setLogGeneral] = useState<any[]>([]);
  const [metricas, setMetricas] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [conteosPendientes, setConteosPendientes] = useState<Record<string, number>>({});

  // Estados del Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'Completado' | 'Rechazado' | null>(null);
  const [modalId, setModalId] = useState<number | null>(null);
  const [modalNotas, setModalNotas] = useState('');
  const [modalContacto, setModalContacto] = useState('');
  const [modalFechaUso, setModalFechaUso] = useState('');

  const fetchDatos = async () => {
    setIsLoading(true);
    try {
      const [resSolicitudes, resMetricas, resLog, resTodosPendientes] = await Promise.all([
        api.get('/uso-beneficio', { params: { tipo_beneficio: activeTab, estado: 'Pendiente', limite: 50 } }),
        api.get('/uso-beneficio/metricas'),
        api.get('/uso-beneficio', { params: { limite: 100 } }),
        api.get('/uso-beneficio', { params: { estado: 'Pendiente', limite: 500 } }) 
      ]);
      
      setSolicitudes(resSolicitudes.data.data || []);
      setMetricas(resMetricas.data || {});
      setLogGeneral(resLog.data.data || []);

      // Agrupamos y contamos cuántos hay de cada tipo
      const conteos = (resTodosPendientes.data.data || []).reduce((acc: any, curr: any) => {
        acc[curr.tipo_beneficio] = (acc[curr.tipo_beneficio] || 0) + 1;
        return acc;
      }, {});
      setConteosPendientes(conteos);

    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, [activeTab]);

  // Abre el modal y setea la configuración de lo que vamos a hacer
  const abrirModal = (id: number, accion: 'Completado' | 'Rechazado') => {
    setModalId(id);
    setModalAction(accion);
    setModalNotas('');
    setModalContacto('');
    setModalFechaUso('');
    setModalOpen(true);
  };

  // Se ejecuta al confirmar adentro del modal
  const procesarCambioEstado = async () => {
    if (!modalId || !modalAction) return;

    setModalOpen(false); 
    setIsProcessing(modalId);
    
    let notasFinales = modalNotas.trim();
    if (notasFinales === '') {
      notasFinales = modalAction === 'Completado' ? 'Aprobado desde panel' : 'No cumple con los requisitos de cupo o antigüedad actuales.';
    }

    try {
      await api.patch(`/uso-beneficio/${modalId}/estado`, { 
        estado: modalAction, 
        notas_staff: notasFinales,
        contacto_coordinador: modalContacto.trim(),
        fecha_uso: modalFechaUso ? new Date(modalFechaUso).toISOString() : undefined 
      });
      fetchDatos(); 
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Hubo un error al procesar la solicitud.');
    } finally {
      setIsProcessing(null);
      setModalId(null);
      setModalAction(null);
    }
  };

  const filtradas = solicitudes.filter(sol => 
    sol.fan.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sol.fan.dni.includes(searchTerm)
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-10 h-full animate-in fade-in duration-300 pb-20 relative">
      
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-800 dark:text-white title-fan flex items-center gap-3">
            <ClipboardList className="text-institucional-celeste" size={32} />
            Gestión de <span className="text-institucional-celeste">Beneficios</span>
          </h1>
          <p className="text-slate-500 mt-1">Aprobá solicitudes pendientes y monitoreá el uso de la pista.</p>
        </div>
      </div>

      {/* BLOQUES DE MÉTRICAS */}
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Beneficios Manuales Otorgados</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-50 dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 p-5 rounded-2xl flex flex-col items-center text-center gap-2 transition-all hover:border-sky-500/30">
              <div className="bg-sky-500/10 p-3 rounded-full text-sky-500"><CarFront size={20} /></div>
              <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">{metricas['PACECAR_RESCATE'] || 0}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rescates</p>
            </div>
            <div className="bg-slate-50 dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 p-5 rounded-2xl flex flex-col items-center text-center gap-2 transition-all hover:border-emerald-500/30">
              <div className="bg-emerald-500/10 p-3 rounded-full text-emerald-500"><Mic size={20} /></div>
              <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">{metricas['SALA_PRENSA'] || 0}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sala Prensa</p>
            </div>
            <div className="bg-slate-50 dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 p-5 rounded-2xl flex flex-col items-center text-center gap-2 transition-all hover:border-amber-500/30">
              <div className="bg-amber-500/10 p-3 rounded-full text-amber-500"><Eye size={20} /></div>
              <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">{metricas['VISITAS_GUIADAS'] || 0}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">V. Guiadas</p>
            </div>
            <div className="bg-slate-50 dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 p-5 rounded-2xl flex flex-col items-center text-center gap-2 transition-all hover:border-purple-500/30">
              <div className="bg-purple-500/10 p-3 rounded-full text-purple-500"><MapPin size={20} /></div>
              <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">{metricas['PLACA_RECTA'] || 0}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Placas</p>
            </div>
            <div className="bg-slate-50 dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 p-5 rounded-2xl flex flex-col items-center text-center gap-2 transition-all hover:border-rose-500/30">
              <div className="bg-rose-500/10 p-3 rounded-full text-rose-500"><Gift size={20} /></div>
              <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">{metricas['REGALO_SUPERFAN'] || 0}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Regalos</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Accesos Directos y Descuentos (Automático)</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-50 dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 p-5 rounded-2xl flex flex-col items-center text-center gap-2 transition-all hover:border-institucional-celeste/30">
              <div className="bg-institucional-celeste/10 p-3 rounded-full text-institucional-celeste"><Zap size={20} /></div>
              <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">{metricas['FAST_ACCESS'] || 0}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fast Access</p>
            </div>
            <div className="bg-slate-50 dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 p-5 rounded-2xl flex flex-col items-center text-center gap-2 transition-all hover:border-yellow-500/30">
              <div className="bg-yellow-500/10 p-3 rounded-full text-yellow-500"><Crown size={20} /></div>
              <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">{metricas['VIP_BOXES'] || 0}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Boxes VIP</p>
            </div>
            <div className="bg-slate-50 dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 p-5 rounded-2xl flex flex-col items-center text-center gap-2 transition-all hover:border-orange-500/30">
              <div className="bg-orange-500/10 p-3 rounded-full text-orange-500"><Wrench size={20} /></div>
              <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">{metricas['DESC_PRUEBAS'] || 0}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pruebas</p>
            </div>
            <div className="bg-slate-50 dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 p-5 rounded-2xl flex flex-col items-center text-center gap-2 transition-all hover:border-red-500/30">
              <div className="bg-red-500/10 p-3 rounded-full text-red-500"><Ticket size={20} /></div>
              <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">{metricas['DESC_CARRERAS'] || 0}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Desc. Carreras</p>
            </div>
            <div className="bg-slate-50 dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 p-5 rounded-2xl flex flex-col items-center text-center gap-2 transition-all hover:border-indigo-500/30">
              <div className="bg-indigo-500/10 p-3 rounded-full text-indigo-500"><Ticket size={20} /></div>
              <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">{metricas['DESC_RECITALES'] || 0}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Desc. Recitales</p>
            </div>
          </div>
        </div>
      </div>

      {/* BANDEJA DE ENTRADA */}
      <div className="bg-white dark:bg-[#0a0f16] border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50 dark:bg-white/5">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold uppercase tracking-wider">
            <Clock className="text-amber-500" size={20} />
            Bandeja de Pendientes
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar DNI o Socio..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 rounded-xl outline-none text-sm text-slate-800 dark:text-white focus:border-institucional-celeste transition-colors"
            />
          </div>
        </div>

        <div className="flex overflow-x-auto border-b border-slate-200 dark:border-white/10 custom-scrollbar">
          {TABS_MANUALES.map(tab => {
            const cantidad = conteosPendientes[tab.id] || 0;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-4 text-sm font-black uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'border-institucional-celeste text-institucional-celeste bg-institucional-celeste/5' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tab.label}
                
                {/* LA BURBUJA EN LA PESTAÑA */}
                <NotificationBadge count={cantidad} />
                
              </button>
            )
          })}
        </div>

        <div className="min-h-[300px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-institucional-celeste bg-white/50 dark:bg-[#0a0f16]/50 backdrop-blur-sm z-10">
              <Loader2 className="animate-spin mb-4" size={32} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-xs font-black uppercase text-slate-400 tracking-wider">
                    <th className="p-4 pl-6">Socio Fan</th>
                    <th className="p-4">Fecha Solicitud</th>
                    <th className="p-4">Detalles</th>
                    <th className="p-4 pr-6 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filtradas.length > 0 ? (
                    filtradas.map(sol => (
                      <tr key={sol.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="font-bold text-slate-800 dark:text-white capitalize">{sol.fan.nombre_completo}</div>
                          <div className="text-xs text-slate-500 mt-0.5">DNI: {sol.fan.dni}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {new Date(sol.fecha_solicitud).toLocaleDateString('es-AR')}
                          </div>
                        </td>
                        <td className="p-4">
                          {sol.evento ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                              {sol.evento.nombre}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium italic">General</span>
                          )}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => abrirModal(sol.id, 'Completado')} disabled={isProcessing === sol.id} className="p-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors disabled:opacity-50" title="Aprobar Solicitud">
                              {isProcessing === sol.id ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                            </button>
                            <button onClick={() => abrirModal(sol.id, 'Rechazado')} disabled={isProcessing === sol.id} className="p-2 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors disabled:opacity-50" title="Rechazar Solicitud">
                              <XCircle size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-slate-500">
                        <AlertCircle className="mx-auto mb-3 opacity-50" size={32} />
                        No hay solicitudes pendientes de <span className="font-bold">{TABS_MANUALES.find(t => t.id === activeTab)?.label}</span>.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* LOG DE BENEFICIOS GLOBAL */}
      <div className="bg-white dark:bg-[#0a0f16] border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl mb-12">
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center gap-3 bg-slate-50 dark:bg-white/5">
          <Database className="text-slate-400" size={24} />
          <div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">Log General de Beneficios</h2>
            <p className="text-xs text-slate-500">Registro histórico general del autódromo.</p>
          </div>
        </div>

        
        <div className="overflow-x-auto max-h-[500px] custom-scrollbar pb-4">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead className="bg-slate-100 dark:bg-[#161024] sticky top-0 z-10 shadow-sm">
              <tr className="font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                <th className="p-3 pl-6 border-b border-slate-200 dark:border-white/10">ID</th>
                <th className="p-3 border-b border-slate-200 dark:border-white/10">Socio / Email</th>
                <th className="p-3 border-b border-slate-200 dark:border-white/10">Tipo Beneficio</th>
                <th className="p-3 border-b border-slate-200 dark:border-white/10">Categoría</th>
                <th className="p-3 border-b border-slate-200 dark:border-white/10">Estado</th>
                <th className="p-3 border-b border-slate-200 dark:border-white/10">Fecha Solicitud</th>
                <th className="p-3 border-b border-slate-200 dark:border-white/10">Fecha Uso</th>
                <th className="p-3 border-b border-slate-200 dark:border-white/10">Notas Staff</th>
              </tr>
            </thead>
            <tbody>
              {logGeneral.length > 0 ? (
                logGeneral.map((log) => (
                  <tr key={log.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-3 pl-6 font-mono text-slate-500">{log.id}</td>
                    
                    {/* 👈 ACÁ ESTÁ LA MEJORA VISUAL PARA NOMBRE Y EMAIL */}
                    <td className="p-3">
                      <div className="font-bold text-slate-700 dark:text-slate-300">
                        {log.fan?.nombre_completo || 'N/A'}
                      </div>
                      {log.fan?.email && (
                        <div className="text-[10px] text-slate-500">{log.fan.email}</div>
                      )}
                    </td>

                    <td className="p-3 font-bold text-institucional-celeste">{log.tipo_beneficio}</td>
                    <td className="p-3">{log.categoria || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-md font-bold uppercase text-[10px] ${
                        log.estado === 'Completado' ? 'bg-emerald-500/10 text-emerald-500' :
                        log.estado === 'Rechazado' ? 'bg-red-500/10 text-red-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {log.estado}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{new Date(log.fecha_solicitud).toLocaleString('es-AR')}</td>
                    <td className="p-3 text-slate-500">{log.fecha_uso ? new Date(log.fecha_uso).toLocaleString('es-AR') : 'NULL'}</td>
                    <td className="p-3 text-slate-500 max-w-[200px] truncate" title={log.notas_staff}>{log.notas_staff || 'NULL'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">No hay registros en la base de datos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE RESOLUCIÓN (FLOTANTE) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#161024] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in-95 duration-200">
            
            {/* Header Modal */}
            <div className={`p-6 border-b border-slate-200 dark:border-white/10 flex items-center gap-3 ${modalAction === 'Completado' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
              {modalAction === 'Completado' ? <CheckCircle size={28} /> : <XCircle size={28} />}
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">
                  {modalAction === 'Completado' ? 'Aprobar Solicitud' : 'Rechazar Solicitud'}
                </h3>
                <p className="text-xs font-medium opacity-80">El socio recibirá un email con estos detalles.</p>
              </div>
            </div>

            {/* Body Modal */}
            <div className="p-6 space-y-4">
              {/* Mostramos el input de contacto SOLO si estamos aprobando */}
              {modalAction === 'Completado' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* INPUT FECHA PROGRAMADA */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                      Fecha y Hora Programada
                    </label>
                    <input 
                      type="datetime-local"
                      value={modalFechaUso}
                      onChange={(e) => setModalFechaUso(e.target.value)}
                      className="w-full p-4 bg-slate-50 dark:bg-[#0a0f16] border border-slate-200 dark:border-white/10 rounded-xl outline-none text-sm text-slate-800 dark:text-white focus:border-institucional-celeste transition-colors"
                    />
                  </div>

                  {/* INPUT CONTACTO */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                      Contacto del Coordinador
                    </label>
                    <input 
                      type="text"
                      value={modalContacto}
                      onChange={(e) => setModalContacto(e.target.value)}
                      placeholder="Ej: +54 9 3492 123456 (Franco) o correo@..."
                      className="w-full p-4 bg-slate-50 dark:bg-[#0a0f16] border border-slate-200 dark:border-white/10 rounded-xl outline-none text-sm text-slate-800 dark:text-white focus:border-institucional-celeste transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                  {modalAction === 'Completado' ? 'Instrucciones / Coordenadas' : 'Motivo del Rechazo'}
                </label>
                <textarea 
                  rows={4}
                  value={modalNotas}
                  onChange={(e) => setModalNotas(e.target.value)}
                  placeholder={modalAction === 'Completado' 
                    ? 'Ej: Presentarse a las 10:00 hs en la Torre de Control. Preguntar por Franco.' 
                    : 'Ej: No cumples con la antigüedad mínima requerida para este beneficio.'}
                  className="w-full p-4 bg-slate-50 dark:bg-[#0a0f16] border border-slate-200 dark:border-white/10 rounded-xl outline-none text-sm text-slate-800 dark:text-white focus:border-institucional-celeste transition-colors resize-none"
                ></textarea>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex justify-end gap-3">
              <button 
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={procesarCambioEstado}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-colors shadow-lg ${
                  modalAction === 'Completado' 
                    ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30' 
                    : 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
                }`}
              >
                Confirmar y Enviar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default GestionSolicitudesPage;