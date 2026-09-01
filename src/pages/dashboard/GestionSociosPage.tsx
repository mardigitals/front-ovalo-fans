import { useState, useEffect } from 'react';
import { Search, Users, Receipt, Calendar, CreditCard, X, ShieldAlert, Loader2 } from 'lucide-react';
import api from '@/api/axios'; // Ajustá la ruta de tu instancia de axios

type EstadoSuscripcion = 'Activo' | 'Vencido' | 'Cancelado' | 'Pendiente';

const GestionSociosPage = () => {
  const [activeTab, setActiveTab] = useState<EstadoSuscripcion>('Activo');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [socios, setSocios] = useState<any[]>([]);
  const [isLoadingSocios, setIsLoadingSocios] = useState(true);
  
  const [socioSeleccionado, setSocioSeleccionado] = useState<any | null>(null);
  const [pagosSocio, setPagosSocio] = useState<any[]>([]);
  const [isLoadingPagos, setIsLoadingPagos] = useState(false);

  // 1. CARGA INICIAL DE SOCIOS
  useEffect(() => {
    const fetchSocios = async () => {
      setIsLoadingSocios(true);
      try {
        const response = await api.get('/suscripcion/admin?limite=1000'); 
        setSocios(response.data.data || []);
      } catch (error) {
        console.error("Error al cargar los socios:", error);
      } finally {
        setIsLoadingSocios(false);
      }
    };
    fetchSocios();
  }, []);

  // 2. CARGA DE PAGOS AL ABRIR EL MODAL
  const handleAbrirHistorial = async (socio: any) => {
    setSocioSeleccionado(socio);
    setIsLoadingPagos(true);
    setPagosSocio([]);

    try {
      const response = await api.get(`/pagos/suscripcion/${socio.id}`);
      setPagosSocio(response.data || []);
    } catch (error) {
      console.error("Error al cargar el historial de pagos:", error);
    } finally {
      setIsLoadingPagos(false);
    }
  };

  // 3. LÓGICA DE FILTRADO (Por pestaña y por buscador)
  const filtrados = socios.filter(s => {
    const coincideEstado = s.estado === activeTab;
    const nombre = s.perfilFan?.usuario?.nombre || s.perfilFan?.alias || '';
    const email = s.perfilFan?.usuario?.email || ''; // Asumiendo que tenés el email vinculado
    
    const coincideBusqueda = 
      nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
      email.toLowerCase().includes(searchTerm.toLowerCase());

    return coincideEstado && coincideBusqueda;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto h-full space-y-6">
      
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-800 dark:text-white title-fan flex items-center gap-3">
            <Users className="text-sky-500" size={32} />
            Gestión de <span className="text-sky-500">Socios</span>
          </h1>
          <p className="text-slate-500 mt-1">Monitoreá el estado de las membresías y el historial de pagos.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:border-sky-500 text-slate-800 dark:text-white transition-all shadow-sm" 
          />
        </div>
      </div>

      {/* TABS DE ESTADOS */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-white/10 overflow-x-auto pb-px">
        {['Activo', 'Vencido', 'Pendiente', 'Cancelado'].map((estado) => (
          <button
            key={estado}
            onClick={() => setActiveTab(estado as EstadoSuscripcion)}
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-all whitespace-nowrap border-b-2 ${
              activeTab === estado 
                ? 'border-sky-500 text-sky-600 dark:text-sky-400' 
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {estado}s
          </button>
        ))}
      </div>

      {/* TABLA DE SOCIOS */}
      <div className="bg-white dark:bg-[#0a0f16] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm min-h-[400px] relative">
        
        {isLoadingSocios ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-sky-500">
             <Loader2 className="animate-spin mb-4" size={40} />
             <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Cargando grilla...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                  <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider">Socio</th>
                  <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider">Membresía</th>
                  <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider">Período</th>
                  <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider text-right">Pagos</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(socio => {
                  const nombreSocio = socio.perfilFan?.usuario?.nombre ? `${socio.perfilFan.usuario.nombre} ${socio.perfilFan.usuario.apellido}` : socio.perfilFan?.alias || 'Socio Desconocido';
                  
                  return (
                    <tr key={socio.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 dark:text-white capitalize">{nombreSocio}</span>
                          {/* El DNI sirve como validación rápida para el administrativo */}
                          <span className="text-xs text-slate-500">DNI: {socio.perfilFan?.usuario?.dni || '-'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 rounded-lg text-xs font-bold uppercase tracking-wide">
                          {socio.membresia?.nombre || 'Plan N/A'}
                        </span>
                      </td>
                      <td className="p-4">
                        {socio.fecha_inicio ? (
                          <div className="flex flex-col text-sm text-slate-600 dark:text-slate-300">
                            <span className="flex items-center gap-1"><Calendar size={12} className="text-slate-400"/> {new Date(socio.fecha_inicio).toLocaleDateString('es-AR')}</span>
                            <span className="flex items-center gap-1 opacity-70">
                              <span className="text-[10px] uppercase font-bold text-slate-400 ml-1">Vence:</span> 
                              {new Date(socio.fecha_fin).toLocaleDateString('es-AR')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Esperando pago...</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleAbrirHistorial(socio)}
                          className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-500/10 border border-slate-200 dark:border-white/10 rounded-xl transition-all shadow-sm"
                          title="Ver Historial de Pagos"
                        >
                          <Receipt size={20} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {filtrados.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-500">
                      No se encontraron socios en estado <span className="font-bold uppercase text-slate-400">{activeTab}</span>.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DE HISTORIAL DE PAGOS */}
      {socioSeleccionado && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm md:pl-64">
          <div className="w-full max-w-2xl bg-white dark:bg-[#08060d] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl relative flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-start">
              <div>
                <h2 className="title-fan text-2xl uppercase text-slate-800 dark:text-white flex items-center gap-2">
                  <CreditCard className="text-sky-500" /> Historial Financiero
                </h2>
                <p className="text-slate-500 mt-1 font-medium capitalize">
                  {socioSeleccionado.perfilFan?.usuario?.nombre} {socioSeleccionado.perfilFan?.usuario?.apellido}
                </p>
              </div>
              <button onClick={() => setSocioSeleccionado(null)} className="text-slate-400 hover:text-red-500 p-1 transition-colors bg-slate-100 dark:bg-white/5 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {socioSeleccionado.estado === 'Vencido' && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex gap-3 text-red-600 dark:text-red-400 text-sm font-medium">
                  <ShieldAlert size={20} className="shrink-0" />
                  Este socio tiene su membresía vencida. El acceso a beneficios está suspendido.
                </div>
              )}

              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Registro de Transacciones</h3>
              
              <div className="space-y-3">
                {isLoadingPagos ? (
                  <div className="text-center py-8 text-sky-500"><Loader2 className="animate-spin mx-auto" size={32} /></div>
                ) : pagosSocio.length > 0 ? (
                  pagosSocio.map(pago => (
                    <div key={pago.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white text-lg">${Number(pago.monto).toLocaleString('es-AR')}</p>
                        <p className="text-xs text-slate-500 uppercase">{pago.metodo_pago} • Ref: #{pago.id_transaccion_mp}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md text-[10px] font-black uppercase tracking-wider">Aprobado</span>
                        <p className="text-xs text-slate-500 mt-1 font-medium">{new Date(pago.fecha_pago).toLocaleDateString('es-AR')}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl text-slate-500 text-sm font-medium">
                    No se registran pagos para esta suscripción.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GestionSociosPage;