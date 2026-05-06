import React, { useState, useEffect } from 'react';
import GenericCrud from '@/components/ui/GenericCrud';
import { useAuth } from '@/hooks/useAuth';
import { X, ShieldAlert, CheckCircle, Trash2, Ban } from 'lucide-react';
import api from '@/api/axios';

const CuentasPage = () => {
  const { userProfile } = useAuth();
  
  // OJO: Según tu controller, solo SuperAdmin puede suspender/restaurar
  const esSuperAdmin = userProfile?.rol?.toLowerCase() === 'superadmin';

  const [cuentas, setCuentas] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para el modal de gestión de seguridad
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<any>(null);

  // 1. CARGAR DATOS
  const fetchCuentas = async () => {
    try {
      // ACA DEBERÁS CREAR ESTE ENDPOINT EN TU BACKEND PARA TRAER TODAS LAS CUENTAS
      const response = await api.get('/usuario-auth/all'); 
      setCuentas(response.data.data);
    } catch (error) {
      console.error("Error cargando cuentas:", error);
    }
  };

  useEffect(() => {
    fetchCuentas();
  }, []);

  // 2. BUSCADOR
  const datosFiltrados = cuentas.filter(c =>
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.estado_cuenta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.ultima_ip?.includes(searchTerm)
  );

  // 3. ACCIONES DE LA TABLA
  const handleEdit = (cuenta: any) => {
    setCuentaSeleccionada(cuenta);
    setIsModalOpen(true);
  };

  const handleDelete = async (cuenta: any) => {
    if (window.confirm(`¿PELIGRO: Estás a punto de ELIMINAR permanentemente la cuenta ${cuenta.email}. ¿Continuar?`)) {
      try {
        // ACA DEBERÁS CREAR ESTE ENDPOINT EN TU BACKEND PARA BORRAR POR ID
        await api.delete(`/usuario-auth/${cuenta.id}/admin`);
        fetchCuentas();
      } catch (err) {
        alert("Error al eliminar la cuenta.");
      }
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
  ];

  return (
    <div className="relative h-full">
      <GenericCrud
        title="CUENTAS DE ACCESO" 
        subtitle="Gestión de seguridad, baneos y credenciales del sistema."
        columns={columns} 
        data={datosFiltrados} 
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        // Omitimos onAdd para que no aparezca el botón "Nuevo"
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        canEdit={esSuperAdmin} 
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
            </div>

            {/* BOTONES DE ACCIÓN RÁPIDA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                onClick={() => handleDelete(cuentaSeleccionada)} 
                className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-black"
              >
                <Trash2 size={20} />
                FORZAR BORRADO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CuentasPage;