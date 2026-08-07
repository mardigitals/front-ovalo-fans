import React, { useState, useEffect } from 'react';
import GenericCrud from '@/components/ui/GenericCrud';
import { useAuth } from '@/hooks/useAuth';
import { X, AlertTriangle, Upload, Link as LinkIcon } from 'lucide-react'; 
import api from '@/api/axios';

const initialState = {
  titulo: '',
  tipo: 'noticia',
  url_recurso: '',
  nivel_acceso_requerido: 0,
  es_destacado: false,
};

const GestionContenidoPage = () => {
  const { userProfile } = useAuth();
  
  // Validamos si es Admin o Prensa para habilitar edición
  const rolUsuario = userProfile?.rol?.toLowerCase();
  const esStaffAutorizado = rolUsuario === 'superadmin' || rolUsuario === 'prensa';

  const [contenidos, setContenidos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const limitePorPagina = 10;
  
  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contenidoEditando, setContenidoEditando] = useState<any>(null);
  const [formData, setFormData] = useState(initialState);
  const [contenidoAEliminar, setContenidoAEliminar] = useState<any>(null);

  const fetchContenidos = async () => {
    try {
      // Reemplazá la ruta si tu api/axios usa otro prefijo
      const response = await api.get('/contenido-multimedia');
      setContenidos(response.data);
    } catch (error) {
      console.error("Error cargando contenidos:", error);
    }
  };

  useEffect(() => { fetchContenidos(); }, []);

  // Resetear a la página 1 al buscar
  useEffect(() => {
    setPaginaActual(1);
  }, [searchTerm]);

  // 1. Filtrado
  const datosFiltrados = contenidos.filter(c =>
    c.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Paginación
  const indiceUltimoItem = paginaActual * limitePorPagina;
  const indicePrimerItem = indiceUltimoItem - limitePorPagina;
  const contenidosPaginados = datosFiltrados.slice(indicePrimerItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(datosFiltrados.length / limitePorPagina);

  // Handlers del Formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAdd = () => {
    setContenidoEditando(null); 
    setFormData(initialState); 
    setError(''); 
    setIsModalOpen(true);
  };

  const handleEdit = (contenido: any) => {
    setContenidoEditando(contenido);
    setFormData({
      titulo: contenido.titulo || '',
      tipo: contenido.tipo || 'noticia',
      url_recurso: contenido.url_recurso || '',
      nivel_acceso_requerido: contenido.nivel_acceso_requerido || 0,
      es_destacado: Boolean(contenido.es_destacado),
    });
    setError(''); 
    setIsModalOpen(true);
  };

  const handleDeleteClick = (contenido: any) => {
    setContenidoAEliminar(contenido);
  };

  const confirmarEliminacion = async () => {
    if (!contenidoAEliminar) return;
    try {
      await api.delete(`/contenido-multimedia/${contenidoAEliminar.id}`);
      await fetchContenidos(); 
      setContenidoAEliminar(null);
      
      if (contenidosPaginados.length === 1 && paginaActual > 1) {
        setPaginaActual(paginaActual - 1);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Hubo un error al intentar eliminar el contenido.");
    }
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true); 
    setError('');

    const payload = {
      ...formData,
      nivel_acceso_requerido: Number(formData.nivel_acceso_requerido),
    };

    try {
      if (contenidoEditando) {
        await api.patch(`/contenido-multimedia/${contenidoEditando.id}`, payload);
      } else {
        await api.post('/contenido-multimedia', payload);
      }
      
      await fetchContenidos(); 
      setIsModalOpen(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al guardar el contenido';
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Configuración de las columnas para GenericCrud
  const columns = [
    { key: 'titulo', label: 'Título' },
    { 
      key: 'tipo', 
      label: 'Tipo',
      render: (item: any) => (
        <span className="uppercase text-xs font-bold text-slate-500">
          {item.tipo}
        </span>
      )
    },
    { 
      key: 'nivel_acceso_requerido', 
      label: 'Acceso',
      render: (item: any) => (
        <span className={`px-2 py-1 rounded text-xs font-black ${
          item.nivel_acceso_requerido === 1 
            ? 'bg-amber-500/20 text-amber-500' 
            : 'bg-green-500/20 text-green-500'
        }`}>
          {item.nivel_acceso_requerido === 1 ? 'VIP (P1/P2)' : 'PÚBLICO'}
        </span>
      )
    },
    { 
      key: 'es_destacado', 
      label: 'Destacado',
      render: (item: any) => (
        item.es_destacado ? <span className="text-amber-500 font-bold text-lg">★</span> : <span className="text-slate-400">-</span>
      )
    },
    { 
      key: 'autor', 
      label: 'Autor',
      render: (item: any) => (
        <span className="text-sm text-slate-400">
          {item.autor?.nombre} {item.autor?.apellido}
        </span>
      )
    },
  ];

  return (
    <div className="relative h-full">
      <GenericCrud
        title="GESTIÓN MULTIMEDIA" 
        subtitle="Administrá las fotos, videos y noticias de la galería del club."
        columns={columns} 
        data={contenidosPaginados}
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onAdd={handleAdd} 
        onEdit={handleEdit} 
        onDelete={handleDeleteClick} 
        canEdit={esStaffAutorizado} 
        currentPage={paginaActual}
        totalPages={totalPaginas}
        onPageChange={(page) => setPaginaActual(page)}
      />

      {/* --- MODAL DE FORMULARIO (NUEVO/EDITAR) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm md:pl-64 transition-all duration-300">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/90 dark:bg-[#08060d]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl relative p-6 animate-in zoom-in-95 duration-300">
            
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-sky-500 transition-colors bg-slate-100 dark:bg-white/5 p-2 rounded-full z-10">
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="bg-sky-500/10 p-3 rounded-xl text-sky-500">
                <Upload size={24} />
              </div>
              <div>
                <h2 className="title-fan text-2xl text-slate-800 dark:text-white uppercase tracking-tight">
                  {contenidoEditando ? 'Editar Contenido' : 'Subir Contenido'}
                </h2>
              </div>
            </div>

            {error && <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded font-bold">{error}</div>}

            <form onSubmit={handleGuardar} className="space-y-6">
              
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Título del material</label>
                <input
                  type="text"
                  name="titulo"
                  required
                  value={formData.titulo}
                  onChange={handleInputChange}
                  placeholder="Ej: Cámara a bordo TC..."
                  className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Formato</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition-all appearance-none"
                  >
                    <option value="noticia">Noticia (Texto/Link)</option>
                    <option value="imagen">Imagen (Foto)</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Nivel de Acceso</label>
                  <select
                    name="nivel_acceso_requerido"
                    value={formData.nivel_acceso_requerido}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition-all appearance-none"
                  >
                    <option value="0">Contenido Público</option>
                    <option value="1">Exclusivo VIP (P1 / P2)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <LinkIcon size={14} /> URL del Archivo (Temporal)
                </label>
                <input
                  type="url"
                  name="url_recurso"
                  required
                  value={formData.url_recurso}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com/mifoto.jpg"
                  className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <input
                  type="checkbox"
                  name="es_destacado"
                  id="destacado"
                  checked={formData.es_destacado}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded text-sky-500 bg-black/50 border-white/20 focus:ring-sky-500 focus:ring-offset-black"
                />
                <label htmlFor="destacado" className="text-sm font-medium text-slate-700 dark:text-slate-300 select-none">
                  Marcar como <span className="font-bold text-amber-500 uppercase tracking-wider">Destacado</span>
                </label>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isLoading} className="flex-1 py-3 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-800 dark:text-white rounded-lg transition-colors font-bold">
                  Cancelar
                </button>
                <button type="submit" disabled={isLoading} className="flex-1 py-3 bg-sky-500 hover:bg-cyan-400 text-black rounded-lg transition-colors font-black shadow-[0_0_15px_rgba(14,165,233,0.3)] disabled:opacity-50">
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE CONFIRMACIÓN DE ELIMINACIÓN --- */}
      {contenidoAEliminar && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm md:pl-64 transition-all duration-300">
          <div className="w-full max-w-md bg-white/90 dark:bg-[#08060d]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-300">
            
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500">
              <AlertTriangle size={32} />
            </div>
            
            <h3 className="title-fan text-2xl mb-2 text-slate-800 dark:text-white">¿Eliminar Contenido?</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Estás a punto de eliminar <strong>"{contenidoAEliminar.titulo}"</strong>. Esta acción no se puede deshacer.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setContenidoAEliminar(null)} 
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

export default GestionContenidoPage;

// import { useState } from 'react';
// import { Upload, Save, AlertCircle, Link as LinkIcon } from 'lucide-react';

// const CargarContenidoPage = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error', texto: string } | null>(null);

//   // Estado del formulario DTO
//   const [formData, setFormData] = useState({
//     titulo: '',
//     tipo: 'noticia', // Valor por defecto
//     url_recurso: '', // LA TRAMPA: Input de texto por ahora
//     nivel_acceso_requerido: '0', // 0 = Público, 1 = VIP
//     es_destacado: false,
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
    
//     // Manejo especial para el checkbox (es_destacado)
//     if (type === 'checkbox') {
//       const checked = (e.target as HTMLInputElement).checked;
//       setFormData(prev => ({ ...prev, [name]: checked }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMensaje(null);

//     try {
//       const token = localStorage.getItem('token');
      
//       // Parseamos los datos para enviarlos al backend (aseguramos que el nivel sea numérico)
//       const payload = {
//         ...formData,
//         nivel_acceso_requerido: Number(formData.nivel_acceso_requerido),
//       };

//       const res = await fetch('http://localhost:3000/contenido-multimedia', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || 'Error al crear el contenido');
//       }

//       setMensaje({ tipo: 'exito', texto: '¡Contenido subido exitosamente al óvalo!' });
      
//       // Limpiamos el form si fue exitoso
//       setFormData({
//         titulo: '',
//         tipo: 'noticia',
//         url_recurso: '',
//         nivel_acceso_requerido: '0',
//         es_destacado: false,
//       });

//     } catch (error: any) {
//       setMensaje({ tipo: 'error', texto: error.message });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl mt-10">
      
//       <div className="flex items-center gap-3 mb-8 border-b border-slate-200 dark:border-white/10 pb-4">
//         <div className="bg-sky-500/10 p-3 rounded-xl text-sky-500">
//           <Upload size={24} />
//         </div>
//         <div>
//           <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
//             Subir Contenido
//           </h2>
//           <p className="text-sm text-slate-500">Añadir nueva foto, video o noticia a la galería.</p>
//         </div>
//       </div>

//       {mensaje && (
//         <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 font-medium ${
//           mensaje.tipo === 'exito' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
//         }`}>
//           <AlertCircle size={20} />
//           {mensaje.texto}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
        
//         {/* TÍTULO */}
//         <div>
//           <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Título del material</label>
//           <input
//             type="text"
//             name="titulo"
//             required
//             value={formData.titulo}
//             onChange={handleChange}
//             placeholder="Ej: Cámara a bordo TC..."
//             className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* TIPO */}
//           <div>
//             <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Formato</label>
//             <select
//               name="tipo"
//               value={formData.tipo}
//               onChange={handleChange}
//               className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition-all appearance-none"
//             >
//               <option value="noticia">Noticia (Texto/Link)</option>
//               <option value="imagen">Imagen (Foto)</option>
//               <option value="video">Video</option>
//             </select>
//           </div>

//           {/* NIVEL REQUERIDO (Actualizado a 0 o 1) */}
//           <div>
//             <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Nivel de Acceso</label>
//             <select
//               name="nivel_acceso_requerido"
//               value={formData.nivel_acceso_requerido}
//               onChange={handleChange}
//               className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition-all appearance-none"
//             >
//               <option value="0">Contenido Público</option>
//               <option value="1">Exclusivo VIP (P1 / P2)</option>
//             </select>
//           </div>
//         </div>

//         {/* LA TRAMPA: URL DEL RECURSO */}
//         <div>
//           <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
//             <LinkIcon size={14} /> URL del Archivo (Temporal)
//           </label>
//           <input
//             type="url"
//             name="url_recurso"
//             required
//             value={formData.url_recurso}
//             onChange={handleChange}
//             placeholder="https://ejemplo.com/mifoto.jpg"
//             className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
//           />
//           <p className="text-xs text-slate-400 mt-2">
//             *Pegá un link directo a una imagen. Más adelante reemplazaremos esto por la subida a Cloudinary.
//           </p>
//         </div>

//         {/* ES DESTACADO */}
//         <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
//           <input
//             type="checkbox"
//             name="es_destacado"
//             id="destacado"
//             checked={formData.es_destacado}
//             onChange={handleChange}
//             className="w-5 h-5 rounded text-sky-500 bg-black/50 border-white/20 focus:ring-sky-500 focus:ring-offset-black"
//           />
//           <label htmlFor="destacado" className="text-sm font-medium text-slate-700 dark:text-slate-300 select-none">
//             Marcar como <span className="font-bold text-amber-500 uppercase tracking-wider">Destacado</span>
//           </label>
//         </div>

//         {/* BOTÓN SUBMIT */}
//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full flex items-center justify-center gap-2 py-4 bg-sky-500 hover:bg-sky-400 text-white font-black uppercase tracking-widest rounded-xl transition-colors disabled:opacity-50"
//         >
//           {isLoading ? 'Guardando en boxes...' : (
//             <>
//               <Save size={20} /> Publicar Contenido
//             </>
//           )}
//         </button>

//       </form>
//     </div>
//   );
// };

// export default CargarContenidoPage;