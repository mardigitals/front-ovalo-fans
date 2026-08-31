import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus, Shield, Briefcase, Mail, Pencil, Trash2, RefreshCcw } from 'lucide-react'; 
import api from '@/api/axios';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'; 

const GestionStaffPage = () => {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [error, setError] = useState('');
  
  const [staffAEliminar, setStaffAEliminar] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    rol_staff_id: 2, 
    area: '',
    cargo: ''
  });

  const fetchStaff = async () => {
    try {
      const response = await api.get('/perfil-staff/admin');
      setStaffList(response.data);
    } catch (error) {
      console.error("Error cargando el staff:", error);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'rol_staff_id' ? Number(value) : value }));
  };

  const handleAbrirModal = (staff?: any) => {
    if (staff) {
      setEditandoId(staff.id);
      // Al editar, solo preparamos rol, area y cargo.
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        rol_staff_id: staff.rolStaff?.id || 2,
        area: staff.area || '',
        cargo: staff.cargo || ''
      });
    } else {
      setEditandoId(null);
      setFormData({ nombre: '', apellido: '', email: '', rol_staff_id: 2, area: '', cargo: '' });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (editandoId) {
        // Al editar solo mandamos los datos del puesto
        await api.patch(`/perfil-staff/admin/${editandoId}`, {
          rol_staff_id: formData.rol_staff_id,
          area: formData.area,
          cargo: formData.cargo
        });
      } else {
        // Al crear mandamos el payload completo unificado que hicimos en el DTO
        await api.post('/perfil-staff/admin', formData);
      }
      await fetchStaff();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el perfil de staff');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmarEliminacion = async () => {
    if (!staffAEliminar) return;
    try {
      await api.delete(`/perfil-staff/admin/${staffAEliminar.id}`);
      await fetchStaff(); 
      setStaffAEliminar(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Hubo un error al intentar dar de baja.");
    }
  };

  const handleRestaurar = async (id: number) => {
    try {
      await api.patch(`/perfil-staff/admin/${id}/restore`);
      await fetchStaff();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error al restaurar el perfil.");
    }
  };

  const filtrados = staffList.filter(s => {
    const nombreCompleto = `${s.usuario?.nombre} ${s.usuario?.apellido}`.toLowerCase();
    return nombreCompleto.includes(searchTerm.toLowerCase()) || 
           s.area?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto h-full">
      
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-800 dark:text-white title-fan">
            Gestión de <span className="text-sky-500">Staff</span>
          </h1>
          <p className="text-slate-500 mt-1">Administrá los accesos y roles del equipo del autódromo.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o área..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:border-sky-500 text-slate-800 dark:text-white" 
            />
          </div>
          <button onClick={() => handleAbrirModal()} className="flex items-center gap-2 px-6 py-2 bg-sky-500 hover:bg-sky-400 text-black font-black uppercase tracking-wide rounded-xl transition-colors whitespace-nowrap shadow-md">
            <UserPlus size={18} /> Nuevo Integrante
          </button>
        </div>
      </div>

      {/* TABLA DE STAFF */}
      <div className="bg-white dark:bg-[#0a0f16] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
              <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider">Usuario</th>
              <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider">Rol en Sistema</th>
              <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider">Área / Cargo</th>
              <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider">Estado</th>
              <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(staff => {
              const estaDeBaja = !!staff.eliminado_en;
              return (
                <tr key={staff.id} className={`border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${estaDeBaja ? 'opacity-60 bg-slate-50/50 dark:bg-white/5' : ''}`}>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className={`font-bold ${estaDeBaja ? 'text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                        {staff.usuario?.nombre} {staff.usuario?.apellido}
                      </span>
                      {/* Como separamos el auth, en el front lo ideal es mostrar el email del auth si lo traemos, 
                          pero por ahora lo omitimos si no viaja en el relation, o lo podés agregar a la query */}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-lg text-xs font-bold uppercase tracking-wide ${estaDeBaja ? 'bg-slate-200/50 text-slate-500 border-slate-300 dark:bg-slate-800/50 dark:border-slate-700' : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20'}`}>
                      <Shield size={14} /> {staff.rolStaff?.nombre_rol || 'Desconocido'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${estaDeBaja ? 'text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>{staff.area}</span>
                      <span className="text-xs text-slate-500">{staff.cargo}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {estaDeBaja ? (
                      <span className="px-2 py-1 bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 rounded-md text-xs font-bold uppercase">De Baja</span>
                    ) : (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-md text-xs font-bold uppercase">Activo</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleAbrirModal(staff)} 
                        disabled={estaDeBaja}
                        className="p-2 text-slate-400 hover:text-sky-500 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-sky-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Editar Puesto"
                      >
                        <Pencil size={18} />
                      </button>
                      
                      {estaDeBaja ? (
                        <button 
                          onClick={() => handleRestaurar(staff.id)} 
                          className="p-2 text-emerald-500 hover:text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/10 transition-all"
                          title="Restaurar (Reactivar)"
                        >
                          <RefreshCcw size={18} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => setStaffAEliminar(staff)} 
                          className="p-2 text-slate-400 hover:text-red-500 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-red-500/10 transition-all"
                          title="Dar de Baja"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No se encontraron registros de staff.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DE ALTA/EDICIÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm md:pl-64">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#08060d] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl relative p-6 md:p-8 animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-red-500 p-2"><X size={24} /></button>
            
            <h2 className="title-fan text-2xl uppercase mb-6 flex items-center gap-3 text-slate-800 dark:text-white">
              <Briefcase className="text-sky-500" /> {editandoId ? 'Actualizar Puesto' : 'Alta de Nuevo Staff'}
            </h2>

            {error && <div className="mb-4 bg-red-500/10 text-red-500 p-3 rounded font-bold text-sm border border-red-500/20">{error}</div>}

            <form onSubmit={handleGuardar} className="space-y-6">
              
              {/* DATOS PERSONALES (Solo visibles al crear) */}
              {!editandoId && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                  <h3 className="col-span-1 md:col-span-2 text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest border-b border-slate-200 dark:border-white/10 pb-2">Datos de Cuenta</h3>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Nombre</label>
                    <input type="text" name="nombre" required={!editandoId} value={formData.nombre} onChange={handleInputChange} className="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 text-slate-800 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Apellido</label>
                    <input type="text" name="apellido" required={!editandoId} value={formData.apellido} onChange={handleInputChange} className="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 text-slate-800 dark:text-white" />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Correo Electrónico (Login)</label>
                    <input type="email" name="email" required={!editandoId} value={formData.email} onChange={handleInputChange} placeholder="ejemplo@autodromorafaela.com" className="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 text-slate-800 dark:text-white" />
                    <p className="text-xs text-sky-600 dark:text-sky-400 mt-2 font-medium flex items-center gap-1">
                      <Mail size={12}/> Se enviará un correo con la contraseña temporal de acceso.
                    </p>
                  </div>
                </div>
              )}

              {/* DATOS DE PUESTO Y ROL (Común para crear y editar) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Nivel de Acceso en el Sistema</label>
                  <select name="rol_staff_id" value={formData.rol_staff_id} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 text-slate-800 dark:text-white cursor-pointer">
                    <option value={1}>SuperAdmin (Acceso Total)</option>
                    <option value={2}>Administrativo (Socios y Membresías)</option>
                    <option value={3}>Prensa (Noticias y Galerías)</option>
                    <option value={4}>Comercio (Chequeos para %)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Área Institucional</label>
                  <input type="text" name="area" required value={formData.area} onChange={handleInputChange} placeholder="Ej: Comunicación" className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 text-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Cargo Específico</label>
                  <input type="text" name="cargo" required value={formData.cargo} onChange={handleInputChange} placeholder="Ej: Redactor Web" className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 text-slate-800 dark:text-white" />
                </div>
              </div>

              {/* BOTONES */}
              <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isLoading} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" disabled={isLoading} className="px-8 py-3 bg-sky-500 hover:bg-sky-400 text-black font-black uppercase tracking-wide rounded-lg disabled:opacity-50 shadow-lg transition-colors">
                  {isLoading ? 'Procesando...' : editandoId ? 'Guardar Cambios' : 'Dar de Alta y Enviar Mail'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE BAJA */}
      <ConfirmDeleteModal 
        isOpen={!!staffAEliminar} 
        onClose={() => setStaffAEliminar(null)} 
        onConfirm={confirmarEliminacion} 
        title="¿Dar de baja al Staff?" 
        itemName={`${staffAEliminar?.usuario?.nombre} ${staffAEliminar?.usuario?.apellido}`} 
        warningText="El usuario perderá el acceso al panel de control inmediatamente. Podrás reactivarlo más adelante si lo deseas."
      />

    </div>
  );
};

export default GestionStaffPage;