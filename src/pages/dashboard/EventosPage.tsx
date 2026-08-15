import React, { useState, useEffect } from 'react';
import GenericCrud from '@/components/ui/GenericCrud';
import { useAuth } from '@/hooks/useAuth';
import { X, Calendar as CalendarIcon, Clock } from 'lucide-react'; 
import api from '@/api/axios';
import Calendar from '@/components/ui/Calendar'; 
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';

const initialState = {
  titulo: '', 
  descripcion: '', 
  fecha_evento: '', 
  fecha_evento_fin: '', 
  tipo_evento: 'Carrera', 
  categoria_carrera: 'Otros'
};

const obtenerEstadoDinamico = (fechaStr: string) => {
  if (!fechaStr) return 'PROGRAMADO';
  const fechaEv = new Date(fechaStr).getTime();
  const ahora = new Date().getTime();
  return fechaEv > ahora ? 'PROGRAMADO' : 'FINALIZADO';
};

const EventosPage = () => {
  const { userProfile } = useAuth();
  const esAdmin = ['superadmin', 'administrativo'].includes(userProfile?.rol?.toLowerCase() || '');

  const [eventos, setEventos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const limitePorPagina = 10;
  
  // Estados para Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventoEditando, setEventoEditando] = useState<any>(null);
  const [formData, setFormData] = useState(initialState);
  
  // Estado para Modal de Eliminación
  const [eventoAEliminar, setEventoAEliminar] = useState<any>(null);

  const fetchEventos = async () => {
    try {
      const response = await api.get('/evento');
      setEventos(response.data);
    } catch (error) {
      console.error("Error cargando eventos:", error);
    }
  };

  useEffect(() => { fetchEventos(); }, []);
  useEffect(() => { setPaginaActual(1); }, [searchTerm]);

  const datosFiltrados = eventos.filter(e =>
    e.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.tipo_evento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.categoria_carrera?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indiceUltimoItem = paginaActual * limitePorPagina;
  const indicePrimerItem = indiceUltimoItem - limitePorPagina;
  const eventosPaginados = datosFiltrados.slice(indicePrimerItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(datosFiltrados.length / limitePorPagina);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setEventoEditando(null); setFormData(initialState); setError(''); setIsModalOpen(true);
  };

  const handleEdit = (evento: any) => {
    setEventoEditando(evento);
    const formatearFecha = (fecha: string) => fecha ? new Date(fecha).toISOString().slice(0, 16) : '';

    setFormData({
        titulo: evento.titulo || '', 
        descripcion: evento.descripcion || '', 
        fecha_evento: formatearFecha(evento.fecha_evento),
        fecha_evento_fin: formatearFecha(evento.fecha_evento_fin), 
        tipo_evento: evento.tipo_evento || 'Carrera', 
        categoria_carrera: evento.categoria_carrera || 'Otros'
    });
    setError(''); setIsModalOpen(true);
    };

  const handleDeleteClick = (evento: any) => {
    setEventoAEliminar(evento);
  };

  const confirmarEliminacion = async () => {
    if (!eventoAEliminar) return;
    try {
      await api.delete(`/evento/${eventoAEliminar.id}`);
      fetchEventos(); 
      setEventoAEliminar(null);
      if (eventosPaginados.length === 1 && paginaActual > 1) {
        setPaginaActual(paginaActual - 1);
      }
    } catch (err) {
      alert("Hubo un error al intentar eliminar el evento.");
    }
  };

    const handleGuardar = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setIsLoading(true); 
        setError('');

        const formatearParaBackend = (fechaLocal: string) => {
        if (!fechaLocal) return null;
        return new Date(fechaLocal).toISOString();
        };

        const payload = { 
        ...formData,
        fecha_evento: formatearParaBackend(formData.fecha_evento),
        fecha_evento_fin: formatearParaBackend(formData.fecha_evento_fin)
        };

        try {
            if (eventoEditando) await api.patch(`/evento/${eventoEditando.id}`, payload);
            else await api.post('/evento', payload);
            
            await fetchEventos(); 
            setIsModalOpen(false);
            } catch (err: any) {
            const msg = err.response?.data?.message || 'Error al guardar el evento';
            setError(Array.isArray(msg) ? msg[0] : msg);
            } finally {
            setIsLoading(false);
        }
    };

  const columns = [
    { key: 'titulo', label: 'Evento' },
    { 
      key: 'categoria_carrera', 
      label: 'Tipo / Categoría',
      render: (item: any) => `${item.tipo_evento} - ${item.categoria_carrera || 'General'}`
    },
    { 
      key: 'fecha_evento', 
      label: 'Fecha Inicio',
      render: (item: any) => {
        if (!item.fecha_evento) return <span className="text-slate-400">Sin fecha</span>;
        return (
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
            <CalendarIcon size={14} className="text-institucional-celeste"/>
            {new Date(item.fecha_evento).toLocaleDateString('es-AR')}
          </span>
        )
      }
    },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (item: any) => {
        const estadoVirtual = obtenerEstadoDinamico(item.fecha_evento);
        let color = estadoVirtual === 'PROGRAMADO' 
            ? "bg-blue-500/10 text-blue-500 border-blue-500/20" 
            : "bg-slate-500/10 text-slate-400 border-slate-500/20";
        
        return (
          <span className={`px-2 py-1 rounded text-xs font-black border ${color}`}>
            {estadoVirtual}
          </span>
        )
      }
    }
  ];

  return (
    <div className="relative h-full max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      
      {/* 1. EL NUEVO CALENDARIO INTERACTIVO (Invocado como Componente) */}
      <Calendar eventos={eventos} />

      {/* 2. LA TABLA CRUD TRADICIONAL */}
      <GenericCrud
        title="CALENDARIO DE EVENTOS" subtitle="Administrá las carreras y los eventos del autódromo."
        columns={columns} 
        data={eventosPaginados}
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDeleteClick} canEdit={esAdmin} 
        currentPage={paginaActual}
        totalPages={totalPaginas}
        onPageChange={(page) => setPaginaActual(page)}
      />

      {/* --- MODAL DE FORMULARIO (NUEVO/EDITAR) LIMPIO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm md:pl-64 transition-all duration-300">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white/90 dark:bg-[#08060d]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl relative p-6 animate-in zoom-in-95 duration-300">
            
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-sky-500 transition-colors bg-slate-100 dark:bg-white/5 p-2 rounded-full z-10">
              <X size={20} />
            </button>

            <h1 className="title-fan text-2xl mb-6">
              {eventoEditando ? 'EDITAR EVENTO' : 'NUEVO EVENTO'}
            </h1>

            {error && <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded font-bold">{error}</div>}

            <form onSubmit={handleGuardar} className="space-y-5">
              
              <div>
                <label className="label-fan">Nombre del Evento *</label>
                <input type="text" name="titulo" value={formData.titulo} onChange={handleInputChange} className="input-fan" placeholder="Ej: Turismo Carretera Rafaela 2026" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-fan">Categoría/Tipo</label>
                  <select name="tipo_evento" value={formData.tipo_evento} onChange={handleInputChange} className="input-fan" required>
                    <option value="Carrera">Carrera</option>
                    <option value="Recital">Recital</option>
                    <option value="Pruebas">Pruebas libres</option>
                    <option value="Otros">Otros eventos</option>
                  </select>
                </div>
                {formData.tipo_evento === 'Carrera' && (
                  <div>
                    <label className="label-fan">Categoría de Carrera</label>
                    <select name="categoria_carrera" value={formData.categoria_carrera} onChange={handleInputChange} className="input-fan">
                      <option value="TC">Turismo Carretera</option>
                      <option value="TURISMO PISTA">Turismo Pista</option>
                      <option value="TC PICK UP">TC Pick Up</option>
                      <option value="TC MOURAS">TC Mouras</option>
                      <option value="TC 2000">TC 2000</option>
                      <option value="TURISMO NACIONAL">Turismo Nacional</option>
                      <option value="CARSHOW SANTAFESINO">Carshow Santafesino</option>
                      <option value="TZ SANTAFESINO">TZ Santafesino</option>
                      <option value="CORDOBA PISTA">Córdoba Pista</option>
                      <option value="KARTING">Karting</option>
                      <option value="PICADAS">Picadas</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                )}  
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-fan flex items-center gap-1"><Clock size={14}/> Fecha y Hora Inicio *</label>
                  <input type="datetime-local" name="fecha_evento" value={formData.fecha_evento} onChange={handleInputChange} className="input-fan" required />
                </div>
                <div>
                  <label className="label-fan flex items-center gap-1"><Clock size={14}/> Fecha y Hora Fin</label>
                  <input type="datetime-local" name="fecha_evento_fin" value={formData.fecha_evento_fin} onChange={handleInputChange} className="input-fan" />
                </div>
              </div>

              <div>
                <label className="label-fan">Descripción (Opcional)</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} rows={3} className="input-fan resize-none" placeholder="Detalles de la fecha..." />
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isLoading} className="flex-1 py-3 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-800 dark:text-white rounded-lg transition-colors font-bold">
                  Cancelar
                </button>
                <button type="submit" disabled={isLoading} className="flex-1 py-3 bg-sky-500 hover:bg-cyan-400 text-black rounded-lg transition-colors font-black shadow-[0_0_15px_rgba(14,165,233,0.3)] disabled:opacity-50">
                  {isLoading ? 'Guardando...' : 'Guardar Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE CONFIRMACIÓN DE ELIMINACIÓN --- */}
      <ConfirmDeleteModal
        isOpen={!!eventoAEliminar}
        onClose={() => setEventoAEliminar(null)}
        onConfirm={confirmarEliminacion}
        title="Eliminar Evento"   
        itemName={eventoAEliminar?.titulo || ''}
        warningText="Esta acción no se puede deshacer y borrará el evento del calendario."
      />
    </div>
  );
};

export default EventosPage;