import { useState, useEffect } from 'react';
import GenericCrud from '@/components/ui/GenericCrud';
import { useAuth } from '@/hooks/useAuth';
import { X, ShieldAlert, CheckCircle, Trash2, Ban, AlertTriangle } from 'lucide-react';
import api from '@/api/axios';

const CuentasPage = () => {
    const { userProfile } = useAuth();
    
    //solo SuperAdmin puede suspender/restaurar
    const esSuperAdmin = userProfile?.rol?.toLowerCase() === 'superadmin';

    const [cuentas, setCuentas] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    
    // Estado para el modal de gestión de seguridad
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cuentaSeleccionada, setCuentaSeleccionada] = useState<any>(null);

    const [cuentaAEliminar, setCuentaAEliminar] = useState<any>(null);
    
    const fetchCuentas = async (page = 1, search = '') => {
        try {
            // Le pasamos ambas cosas al backend
            const response = await api.get(`/usuario-auth/all?pagina=${page}&buscar=${search}`); 
            setCuentas(response.data.data);
            setPaginaActual(Number(response.data.pagina));
            setTotalPaginas(Number(response.data.totalPaginas));
        } catch (error) {
            console.error("Error cargando cuentas:", error);
        }
    };

    // EFECTO 1: Cuando cambia la PÁGINA (Paginación normal)
    useEffect(() => {
        fetchCuentas(paginaActual, searchTerm);
    }, [paginaActual]);

    // EFECTO 2: Cuando cambia el BUSCADOR (con Debounce)
    useEffect(() => {
        // Esperamos medio segundo antes de buscar, para no saturar el servidor
        const delayDebounceFn = setTimeout(() => {
            if (paginaActual !== 1) {
                setPaginaActual(1); // Si busca algo nuevo, lo devolvemos a la pag 1
            } else {
                fetchCuentas(1, searchTerm);
            }
        }, 500);

        // Si el usuario sigue tipeando, limpiamos el temporizador anterior
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);
    // 3. ACCIONES DE LA TABLA
    const handleEdit = (cuenta: any) => {
        setCuentaSeleccionada(cuenta);
        setIsModalOpen(true);
    };

    // Abre el modal de confirmación 
    const handleDeleteClick = (cuenta: any) => {
        setCuentaAEliminar(cuenta);
    };

    const confirmarEliminacion = async () => {
        if (!cuentaAEliminar) return;
        try {
        await api.delete(`/usuario-auth/${cuentaAEliminar.id}`);
        fetchCuentas(); 
        setCuentaAEliminar(null); // Cerramos el modal
        } catch (err) {
        alert("Hubo un error al intentar eliminar la cuenta.");
        }
    };

    // 4. ACCIONES DE SEGURIDAD (SUSPENDER / RESTAURAR)
    const cambiarEstadoCuenta = async (accion: 'suspend' | 'restart') => {
        setIsLoading(true);
        try {
        await api.patch(`/usuario-auth/${cuentaSeleccionada.id}/${accion}`);
        await fetchCuentas();
        setIsModalOpen(false); // Cerramos el modal tras el éxito
        } catch (error) {
        alert(`Error al intentar ${accion === 'suspend' ? 'suspender' : 'restaurar'} la cuenta.`);
        } finally {
        setIsLoading(false);
        }
    };

    // 5. CONFIGURACIÓN DE COLUMNAS
    const columns = [
        { key: 'email', label: 'Email' },
        { 
        key: 'estado_cuenta', 
        label: 'Estado',
        render: (item: any) => {
            // Primero nos fijamos si está eliminado (soft delete)
            if (item.eliminado_en) {
                return (
                    <span className="px-3 py-1 rounded text-xs font-black border uppercase tracking-wider bg-slate-500/20 text-slate-400 border-slate-500/30">
                    ELIMINADO
                    </span>
                );
            }

            // Si no está eliminado, vemos su estado normal
            let colorClass = '';
            switch(item.estado_cuenta) {
            case 'Activo': colorClass = 'bg-green-500/20 text-green-500 border-green-500/30'; break;
            case 'Bloqueado': colorClass = 'bg-red-500/20 text-red-500 border-red-500/30'; break;
            case 'Pendiente': colorClass = 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'; break;
            default: colorClass = 'bg-slate-500/20 text-slate-500';
            }
            return (
            <span className={`px-3 py-1 rounded text-xs font-black border uppercase tracking-wider ${colorClass}`}>
                {item.estado_cuenta}
            </span>
            );
        }
        },
        { 
        key: 'ultimo_login', 
        label: 'Última Conexión',
        render: (item: any) => item.ultimo_login ? new Date(item.ultimo_login).toLocaleString('es-AR') : 'Nunca'
        },
        { key: 'ultima_ip', label: 'Última IP', render: (item: any) => item.ultima_ip || '-' },
        { key: 'navegador_dispositivo', label: 'Navegador/Dispositivo', render: (item: any) => item.navegador_dispositivo || '-' }
    ];

    return (
        <div className="relative h-full">
        <GenericCrud
            title="CUENTAS DE USUARIOS" 
            subtitle="Gestión de seguridad y credenciales del sistema."
            columns={columns} 
            data={cuentas} 
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            // Omitimos onAdd para que no aparezca el botón "Nuevo"
            onEdit={handleEdit} 
            onDelete={handleDeleteClick} 
            disableDeleteFn={(item) => !!item.eliminado_en}
            canEdit={esSuperAdmin} 
            currentPage={paginaActual}
            totalPages={totalPaginas}
            onPageChange={(page) => setPaginaActual(page)}
        />

        {/* --- MODAL DE CONTROL DE SEGURIDAD --- */}
        {isModalOpen && cuentaSeleccionada && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm md:pl-64 transition-all duration-300">
            <div className="w-full max-w-lg bg-white/90 dark:bg-[#08060d]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl relative p-6 animate-in zoom-in-95 duration-300">
                
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-sky-500 transition-colors bg-slate-100 dark:bg-white/5 p-2 rounded-full z-10">
                <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
                <ShieldAlert className="text-sky-500" size={28} />
                <h1 className="title-fan text-2xl text-slate-800 dark:text-white">
                    AUDITORÍA DE CUENTA
                </h1>
                </div>

                <div className="space-y-4 text-sm mb-8">
                <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                    <span className="text-slate-500 font-bold uppercase">Email:</span>
                    <span className="text-slate-800 dark:text-white font-mono">{cuentaSeleccionada.email}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                    <span className="text-slate-500 font-bold uppercase">Estado Actual:</span>
                    <span className={`font-black uppercase ${cuentaSeleccionada.estado_cuenta === 'Activo' ? 'text-green-500' : 'text-red-500'}`}>
                    {cuentaSeleccionada.estado_cuenta}
                    </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                    <span className="text-slate-500 font-bold uppercase">Factor Doble (2FA):</span>
                    <span className="text-slate-800 dark:text-white">{cuentaSeleccionada.dos_factores_activado ? 'Activado' : 'Desactivado'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                    <span className="text-slate-500 font-bold uppercase">Navegador:</span>
                    <span className="text-slate-800 dark:text-white truncate max-w-[200px]" title={cuentaSeleccionada.navegador_dispositivo}>
                    {cuentaSeleccionada.navegador_dispositivo || 'Desconocido'}
                    </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                    <span className="text-slate-500 font-bold uppercase">Última IP:</span>
                    <span className="text-slate-800 dark:text-white truncate max-w-[200px]" title={cuentaSeleccionada.ultima_ip}>
                    {cuentaSeleccionada.ultima_ip || 'Desconocida'}
                    </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                    <span className="text-slate-500 font-bold uppercase">Eliminación:</span>
                    <span className="text-slate-800 dark:text-white truncate max-w-[200px]" title={cuentaSeleccionada.eliminado_en}>
                    {cuentaSeleccionada.eliminado_en || 'No eliminada'}
                    </span>
                </div>
                </div>

              {/* BOTONES DE ACCIÓN RÁPIDA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Si la cuenta está eliminada lógicamente, solo ofrecemos restaurarla */}
              {cuentaSeleccionada.eliminado_en ? (
                <button 
                  onClick={() => cambiarEstadoCuenta('restart')} 
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 py-3 bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 border border-sky-500/50 rounded-lg transition-colors font-black sm:col-span-2"
                >
                  <CheckCircle size={20} />
                  {isLoading ? 'PROCESANDO...' : 'RESTAURAR CUENTA ELIMINADA'}
                </button>
              ) : (
                /* Si NO está eliminada, mostramos los botones normales */
                <>
                  {cuentaSeleccionada.estado_cuenta === 'Bloqueado' ? (
                    <button 
                      onClick={() => cambiarEstadoCuenta('restart')} 
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 py-3 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/50 rounded-lg transition-colors font-black"
                    >
                      <CheckCircle size={20} />
                      {isLoading ? 'PROCESANDO...' : 'RESTAURAR ACCESO'}
                    </button>
                  ) : (
                    <button 
                      onClick={() => cambiarEstadoCuenta('suspend')} 
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 rounded-lg transition-colors font-black"
                    >
                      <Ban size={20} />
                      {isLoading ? 'PROCESANDO...' : 'SUSPENDER CUENTA'}
                    </button>
                  )}

                  <button 
                    onClick={() => { setIsModalOpen(false); handleDeleteClick(cuentaSeleccionada); }} 
                    className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-black"
                  >
                    <Trash2 size={20} />
                    ELIMINAR
                  </button>
                </>
              )}
            </div>
            </div>
            </div>
        )}
        {/* --- MODAL DE CONFIRMACIÓN DE ELIMINACIÓN --- */}
        {cuentaAEliminar && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm md:pl-64 transition-all duration-300">
            <div className="w-full max-w-md bg-white/90 dark:bg-[#08060d]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-300">
                
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500">
                <AlertTriangle size={32} />
                </div>
                
                <h3 className="title-fan text-2xl mb-2 text-slate-800 dark:text-white">¿Eliminar Cuenta?</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                Estás a punto de eliminar <strong>"{cuentaAEliminar.email}"</strong>. ¿Desea continuar?
                </p>
                
                <div className="flex gap-3">
                <button 
                    onClick={() => setCuentaAEliminar(null)} 
                    className="flex-1 py-3 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-800 dark:text-white rounded-lg transition-colors font-bold"
                >
                    Cancelar
                </button>
                <button 
                    onClick={confirmarEliminacion} 
                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-black shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                >
                    Sí, Eliminar
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
};

export default CuentasPage;