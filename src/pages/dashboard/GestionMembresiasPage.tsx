import React, { useState, useEffect } from 'react';
import { X, Plus, Edit3, Trash2, RefreshCcw, Tag, DollarSign, AlignLeft, Award } from 'lucide-react';
import api from '@/api/axios';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'; 

const GestionMembresiasPage = () => {
  const [membresias, setMembresias] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [error, setError] = useState('');
  
  const [membresiaAEliminar, setMembresiaAEliminar] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    precio_mensual: '',
    precio_anual: '',
    descripcion_beneficios: ''
  });

  const fetchMembresias = async () => {
    try {
      const response = await api.get('/membresia');
      setMembresias(response.data);
    } catch (error) {
      console.error("Error cargando membresías:", error);
    }
  };

  useEffect(() => {
    fetchMembresias();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAbrirModal = (membresia?: any) => {
    if (membresia) {
      setEditandoId(membresia.id);
      setFormData({
        nombre: membresia.nombre,
        precio_mensual: membresia.precio_mensual.toString(),
        precio_anual: membresia.precio_anual.toString(),
        descripcion_beneficios: membresia.descripcion_beneficios || ''
      });
    } else {
      setEditandoId(null);
      setFormData({ nombre: '', precio_mensual: '', precio_anual: '', descripcion_beneficios: '' });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Convertimos strings a números antes de mandar al backend
    const payload = {
      nombre: formData.nombre,
      precio_mensual: parseFloat(formData.precio_mensual),
      precio_anual: parseFloat(formData.precio_anual),
      descripcion_beneficios: formData.descripcion_beneficios
    };

    try {
      if (editandoId) {
        await api.patch(`/membresia/${editandoId}`, payload);
      } else {
        await api.post('/membresia', payload);
      }
      await fetchMembresias();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar la membresía');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmarEliminacion = async () => {
    if (!membresiaAEliminar) return;
    try {
      await api.delete(`/membresia/${membresiaAEliminar.id}`);
      await fetchMembresias(); 
      setMembresiaAEliminar(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Hubo un error al intentar dar de baja.");
    }
  };

  const handleRestaurar = async (id: number) => {
    try {
      await api.patch(`/membresia/${id}/restore`);
      await fetchMembresias();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error al reactivar la membresía.");
    }
  };

  // Función de utilidad para mostrar plata de forma prolija
  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(precio);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto h-full">
      
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-800 dark:text-white title-fan">
            Gestión de <span className="text-sky-500">Membresías</span>
          </h1>
          <p className="text-slate-500 mt-1">Configurá las categorías, precios y beneficios de Óvalo Fans.</p>
        </div>
        <button onClick={() => handleAbrirModal()} className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-400 text-black font-black uppercase tracking-wide rounded-xl transition-colors whitespace-nowrap shadow-md">
          <Plus size={20} strokeWidth={3} /> Nueva Membresía
        </button>
      </div>

      {/* GRILLA DE TARJETAS DE MEMBRESÍA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {membresias.map(membresia => {
          const estaDeBaja = !!membresia.eliminado_en;
          
          return (
            <div key={membresia.id} className={`flex flex-col bg-white dark:bg-[#0a0f16] border rounded-2xl overflow-hidden shadow-sm transition-all ${estaDeBaja ? 'border-slate-200 dark:border-white/5 opacity-75 bg-slate-50 dark:bg-white/5' : 'border-slate-200 dark:border-white/10 hover:border-sky-500/50'}`}>
              
              {/* Encabezado de la Tarjeta */}
              <div className="p-6 border-b border-slate-100 dark:border-white/5 relative">
                {estaDeBaja && (
                  <span className="absolute top-4 right-4 px-2 py-1 bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 rounded-md text-[10px] font-black uppercase tracking-widest">
                    De Baja
                  </span>
                )}
                <div className="w-12 h-12 bg-sky-500/10 text-sky-500 rounded-xl flex items-center justify-center mb-4">
                  <Award size={24} />
                </div>
                <h3 className={`text-xl font-black uppercase tracking-tight ${estaDeBaja ? 'text-slate-500' : 'text-slate-800 dark:text-white'}`}>
                  {membresia.nombre}
                </h3>
              </div>

              {/* Cuerpo: Precios y Beneficios */}
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mensual</span>
                  <span className="font-black text-slate-800 dark:text-white">{formatearPrecio(membresia.precio_mensual)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Anual</span>
                  <span className="font-black text-sky-600 dark:text-sky-400">{formatearPrecio(membresia.precio_anual)}</span>
                </div>

                <div className="mt-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <AlignLeft size={14} /> Beneficios
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line line-clamp-4">
                    {membresia.descripcion_beneficios || 'Sin descripción de beneficios.'}
                  </p>
                </div>
              </div>

              {/* Pie: Acciones */}
              <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex justify-end gap-2">
                <button 
                  onClick={() => handleAbrirModal(membresia)} 
                  disabled={estaDeBaja}
                  className="px-4 py-2 flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-sky-500 hover:bg-sky-500/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Edit3 size={16} /> Editar
                </button>

                {estaDeBaja ? (
                  <button 
                    onClick={() => handleRestaurar(membresia.id)} 
                    className="px-4 py-2 flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                  >
                    <RefreshCcw size={16} /> Reactivar
                  </button>
                ) : (
                  <button 
                    onClick={() => setMembresiaAEliminar(membresia)} 
                    className="px-4 py-2 flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} /> Baja
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {membresias.length === 0 && !isLoading && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl text-slate-500 font-medium">
            No hay categorías de membresía configuradas.
          </div>
        )}
      </div>

      {/* MODAL CREAR / EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm md:pl-64">
          <div className="w-full max-w-lg bg-white dark:bg-[#08060d] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl relative p-6 md:p-8 animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-red-500 p-2 transition-colors"><X size={24} /></button>
            
            <h2 className="title-fan text-2xl uppercase mb-6 flex items-center gap-3 text-slate-800 dark:text-white">
              <Award className="text-sky-500" /> {editandoId ? 'Actualizar Membresía' : 'Nueva Membresía'}
            </h2>

            {error && <div className="mb-6 bg-red-500/10 text-red-500 p-4 rounded-xl font-bold text-sm border border-red-500/20">{error}</div>}

            <form onSubmit={handleGuardar} className="space-y-5">
              
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1"><Tag size={14} /> Nombre de la Categoría</label>
                <input 
                  type="text" 
                  name="nombre" 
                  required 
                  value={formData.nombre} 
                  onChange={handleInputChange} 
                  placeholder="Ej: P1 FAN" 
                  className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 text-slate-800 dark:text-white font-bold" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1"><DollarSign size={14} /> Precio Mensual</label>
                  <input 
                    type="number" 
                    step="0.01"
                    name="precio_mensual" 
                    required 
                    value={formData.precio_mensual} 
                    onChange={handleInputChange} 
                    className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 text-slate-800 dark:text-white font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-2 flex items-center gap-1"><DollarSign size={14} /> Precio Anual</label>
                  <input 
                    type="number" 
                    step="0.01"
                    name="precio_anual" 
                    required 
                    value={formData.precio_anual} 
                    onChange={handleInputChange} 
                    className="w-full bg-sky-50 dark:bg-sky-500/5 border border-sky-200 dark:border-sky-500/20 rounded-xl px-4 py-3 outline-none focus:border-sky-500 text-slate-800 dark:text-white font-bold" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1"><AlignLeft size={14} /> Descripción y Beneficios</label>
                <textarea 
                  name="descripcion_beneficios" 
                  required 
                  rows={4}
                  value={formData.descripcion_beneficios} 
                  onChange={handleInputChange} 
                  placeholder="• VIP de boxes...&#10;• Ingreso preferencial..." 
                  className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 text-slate-800 dark:text-white resize-none" 
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isLoading} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" disabled={isLoading} className="px-8 py-3 bg-sky-500 hover:bg-sky-400 text-black font-black uppercase tracking-wide rounded-xl disabled:opacity-50 shadow-lg shadow-sky-500/20 transition-colors">
                  {isLoading ? 'Guardando...' : 'Guardar Membresía'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE BAJA */}
      <ConfirmDeleteModal 
        isOpen={!!membresiaAEliminar} 
        onClose={() => setMembresiaAEliminar(null)} 
        onConfirm={confirmarEliminacion} 
        title="¿Dar de baja Membresía?" 
        itemName={membresiaAEliminar?.nombre || ''} 
        warningText="Ya no estará disponible para nuevos socios, pero se mantendrá el registro histórico en el sistema."
      />

    </div>
  );
};

export default GestionMembresiasPage;