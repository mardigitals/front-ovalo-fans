import React, { useState, useEffect } from 'react';
import GenericCrud from '@/components/ui/GenericCrud';
import { useAuth } from '@/hooks/useAuth';
import { X, AlertTriangle, Upload, Link as LinkIcon, HardDrive, FolderOpen, FileImage, ChevronDown } from 'lucide-react'; 
import api from '@/api/axios';

const initialState = {
  titulo: '',
  tipo: 'imagen',
  url_recurso: '',
  nivel_acceso_requerido: 0,
  es_destacado: false,
  carpeta: '', 
};

const GestionContenidoPage = () => {
  const { userProfile } = useAuth();
  
  const rolUsuario = userProfile?.rol?.toLowerCase();
  const esStaffAutorizado = rolUsuario === 'superadmin' || rolUsuario === 'prensa';

  const [contenidos, setContenidos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 🔥 ESTADOS PARA MULTICARGA
  const [archivosFisicos, setArchivosFisicos] = useState<File[]>([]);
  // Modos: 'archivos' (sueltos), 'carpeta' (masivo), 'enlace' (drive/web)
  const [modoCarga, setModoCarga] = useState<'archivos' | 'carpeta' | 'enlace'>('archivos');
  
  const [paginaActual, setPaginaActual] = useState(1);
  const limitePorPagina = 10;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contenidoEditando, setContenidoEditando] = useState<any>(null);
  const [formData, setFormData] = useState(initialState);
  const [contenidoAEliminar, setContenidoAEliminar] = useState<any>(null);

  const fetchContenidos = async () => {
    try {
      const response = await api.get('/contenido-multimedia');
      setContenidos(response.data);
    } catch (error) {
      console.error("Error cargando contenidos:", error);
    }
  };

  useEffect(() => { fetchContenidos(); }, []);
  useEffect(() => { setPaginaActual(1); }, [searchTerm]);

  const datosFiltrados = contenidos.filter(c =>
    c.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.carpeta?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indiceUltimoItem = paginaActual * limitePorPagina;
  const indicePrimerItem = indiceUltimoItem - limitePorPagina;
  const contenidosPaginados = datosFiltrados.slice(indicePrimerItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(datosFiltrados.length / limitePorPagina);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'tipo' && value === 'noticia') {
      setModoCarga('enlace');
    } else if (name === 'tipo' && formData.tipo === 'noticia') {
      setModoCarga('archivos'); // Vuelve a archivos por defecto al cambiar a foto/video
    }

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // 🔥 HANDLER QUE ACEPTA 1 O MÁS ARCHIVOS
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivosFisicos(Array.from(e.target.files));
    } else {
      setArchivosFisicos([]);
    }
  };

  const handleAdd = () => {
    setContenidoEditando(null); 
    setFormData(initialState); 
    setArchivosFisicos([]); 
    setModoCarga('archivos'); 
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
      carpeta: contenido.carpeta || '',
    });
    setArchivosFisicos([]); 
    setModoCarga(contenido.tipo === 'noticia' ? 'enlace' : 'archivos'); 
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

    const payload = new FormData();
    payload.append('titulo', formData.titulo);
    payload.append('tipo', formData.tipo);
    payload.append('nivel_acceso_requerido', String(formData.nivel_acceso_requerido));
    payload.append('es_destacado', formData.es_destacado ? '1' : '0');
    if (formData.carpeta) payload.append('carpeta', formData.carpeta);

    // LÓGICA DE ENVÍO DE ARCHIVOS O ENLACES
    if (formData.tipo === 'noticia' || modoCarga === 'enlace') {
      if (formData.url_recurso) payload.append('url_recurso', formData.url_recurso);
    } 
    else if (archivosFisicos.length > 0) {
      if (contenidoEditando) {
        // En Patch (Editar) mandamos un solo archivo con la llave 'archivo'
        payload.append('archivo', archivosFisicos[0]); 
      } else {
        // En Post (Crear) mandamos el array con la llave 'archivos'
        archivosFisicos.forEach(file => {
          payload.append('archivos', file);
        });
      }
    } 
    else if (contenidoEditando && formData.url_recurso) {
      payload.append('url_recurso', formData.url_recurso);
    }

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
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { key: 'titulo', label: 'Título' },
    { key: 'carpeta', label: 'Carpeta', render: (item: any) => item.carpeta ? <span className="text-xs text-sky-500 font-bold bg-sky-500/10 px-2 py-1 rounded">{item.carpeta}</span> : '-' },
    { key: 'tipo', label: 'Tipo', render: (item: any) => <span className="uppercase text-xs font-bold text-slate-500">{item.tipo}</span> },
    { key: 'nivel_acceso_requerido', label: 'Acceso', render: (item: any) => <span className={`px-2 py-1 rounded text-xs font-black ${item.nivel_acceso_requerido === 1 ? 'bg-amber-500/20 text-amber-500' : 'bg-green-500/20 text-green-500'}`}>{item.nivel_acceso_requerido === 1 ? 'VIP (P1/P2)' : 'PÚBLICO'}</span> },
    { key: 'es_destacado', label: 'Destacado', render: (item: any) => item.es_destacado ? <span className="text-amber-500 font-bold text-lg">★</span> : <span className="text-slate-400">-</span> },
    { key: 'autor', label: 'Autor', render: (item: any) => <span className="text-sm text-slate-400">{item.autor?.nombre} {item.autor?.apellido}</span> },
  ];

  return (
    <div className="relative h-full">
      <GenericCrud
        title="GESTIÓN MULTIMEDIA" subtitle="Administrá las fotos, videos y noticias de la galería del club."
        columns={columns} data={contenidosPaginados} searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)} onAdd={handleAdd} onEdit={handleEdit} 
        onDelete={handleDeleteClick} canEdit={esStaffAutorizado} currentPage={paginaActual}
        totalPages={totalPaginas} onPageChange={(page) => setPaginaActual(page)}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm md:pl-64 transition-all duration-300">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white/90 dark:bg-[#08060d]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl relative p-6 animate-in zoom-in-95 duration-300">
            
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-sky-500 transition-colors bg-slate-100 dark:bg-white/5 p-2 rounded-full z-10">
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="bg-sky-500/10 p-3 rounded-xl text-sky-500"><Upload size={24} /></div>
              <div><h2 className="title-fan text-2xl text-slate-800 dark:text-white uppercase tracking-tight">{contenidoEditando ? 'Editar Contenido' : 'Subir Contenido'}</h2></div>
            </div>

            {error && <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded font-bold">{error}</div>}

            <form onSubmit={handleGuardar} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Título del material</label>
                  <input type="text" name="titulo" required={archivosFisicos.length <= 1} value={formData.titulo} onChange={handleInputChange} placeholder="Ej: Cámara a bordo TC..." className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition-all" />
                  {archivosFisicos.length > 1 && <p className="text-[10px] text-sky-500 mt-1">*Se usará el nombre original de cada archivo como título.</p>}
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><FolderOpen size={14}/> Carpeta (Opcional)</label>
                  <input type="text" name="carpeta" value={formData.carpeta} onChange={handleInputChange} placeholder="Ej: 500 Millas 1926" className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Formato</label>
                  <div className="relative">
                    <select name="tipo" value={formData.tipo} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition-all appearance-none">
                      <option value="imagen">Imagen (Foto)</option>
                      <option value="noticia">Noticia (Texto/Link)</option>
                      <option value="video">Video</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Nivel de Acceso</label>
                  <div className="relative">
                    <select name="nivel_acceso_requerido" value={formData.nivel_acceso_requerido} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition-all appearance-none">
                      <option value="0">Contenido Público</option>
                      <option value="1">Exclusivo VIP (P1 / P2)</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            

              {/*  ZONA DE CARGA DINÁMICA */}
              {formData.tipo === 'noticia' ? (
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><LinkIcon size={14} /> URL de la Noticia</label>
                  <input type="url" name="url_recurso" required value={formData.url_recurso} onChange={handleInputChange} placeholder="https://diario.com/noticia" className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition-all" />
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10">
                  {/* SELECTOR DE MODO */}
                  {!contenidoEditando && (
                    <div className="flex gap-2 mb-4 p-1 bg-slate-200 dark:bg-black/40 rounded-lg overflow-hidden">
                      <button type="button" onClick={() => {setModoCarga('archivos'); setArchivosFisicos([]);}} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${modoCarga === 'archivos' ? 'bg-sky-500 text-white shadow' : 'text-slate-500 hover:text-slate-700 dark:hover:text-white'}`}><FileImage size={14}/> Archivos Sueltos</button>
                      <button type="button" onClick={() => {setModoCarga('carpeta'); setArchivosFisicos([]);}} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${modoCarga === 'carpeta' ? 'bg-sky-500 text-white shadow' : 'text-slate-500 hover:text-slate-700 dark:hover:text-white'}`}><FolderOpen size={14}/> Carpeta Masiva</button>
                      <button type="button" onClick={() => setModoCarga('enlace')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${modoCarga === 'enlace' ? 'bg-sky-500 text-white shadow' : 'text-slate-500 hover:text-slate-700 dark:hover:text-white'}`}><LinkIcon size={14}/> Enlace YouTube/Drive</button>
                    </div>
                  )}

                  {/* INPUTS SEGÚN MODO */}
                  {modoCarga === 'enlace' ? (
                    <input type="url" name="url_recurso" required={!contenidoEditando} value={formData.url_recurso} onChange={handleInputChange} placeholder="https://example.com/..." className="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition-all" />
                  ) : (
                    <>
                      <input 
                        type="file" 
                        multiple={modoCarga === 'archivos'}
                        // @ts-ignore: webkitdirectory es un atributo especial no estándar pero 100% funcional
                        webkitdirectory={modoCarga === 'carpeta' ? "true" : undefined}
                        accept={formData.tipo === 'video' ? 'video/*' : 'image/*'}
                        onChange={handleFileChange}
                        required={!contenidoEditando && !formData.url_recurso} 
                        className="w-full text-slate-800 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-sky-500/10 file:text-sky-500 hover:file:bg-sky-500/20" 
                      />
                      {contenidoEditando && !archivosFisicos.length && formData.url_recurso && (
                        <p className="text-[10px] text-amber-500 mt-3 font-bold uppercase tracking-wide flex items-center gap-1">
                          <HardDrive size={12} /> Ya hay un recurso guardado.
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {/*  VISTA PREVIA MEJORADA PARA MASIVOS */}
              {(archivosFisicos.length > 0 || (contenidoEditando && formData.url_recurso) || (modoCarga === 'enlace' && formData.url_recurso)) && (
                <div className="p-4 bg-slate-100 dark:bg-black/30 rounded-xl border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center mt-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 w-full text-left">
                    {archivosFisicos.length > 1 ? `Archivos Seleccionados (${archivosFisicos.length})` : 'Vista Previa'}
                  </label>
                  
                  {archivosFisicos.length > 1 ? (
                    <div className="w-full text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <FolderOpen size={20} className="text-sky-500" />
                      Has seleccionado <strong>{archivosFisicos.length}</strong> archivos para subir a la carpeta.
                    </div>
                  ) : formData.tipo === 'imagen' && (modoCarga !== 'enlace' || formData.url_recurso.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null) ? (
                    <img src={archivosFisicos[0] ? URL.createObjectURL(archivosFisicos[0]) : formData.url_recurso} alt="Vista previa" className="max-h-40 w-auto object-cover rounded-lg shadow-md" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Vista+No+Disponible')} />
                  ) : formData.tipo === 'video' && (modoCarga !== 'enlace' || formData.url_recurso.match(/\.(mp4|webm|ogg)$/i) != null) ? (
                    <video src={archivosFisicos[0] ? URL.createObjectURL(archivosFisicos[0]) : formData.url_recurso} controls className="max-h-40 w-auto rounded-lg shadow-md" />
                  ) : (
                    <a href={formData.url_recurso} target="_blank" rel="noopener noreferrer" className="text-sky-500 font-bold flex items-center gap-2 text-sm bg-sky-500/10 px-4 py-2 rounded-lg">
                      <LinkIcon size={16} /> Abrir enlace externo
                    </a>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <input type="checkbox" name="es_destacado" id="destacado" checked={formData.es_destacado} onChange={handleInputChange} className="w-5 h-5 rounded text-sky-500 bg-black/50 border-white/20 focus:ring-sky-500 focus:ring-offset-black" />
                <label htmlFor="destacado" className="text-sm font-medium text-slate-700 dark:text-slate-300 select-none">Marcar como <span className="font-bold text-amber-500 uppercase tracking-wider">Destacado</span></label>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isLoading} className="flex-1 py-3 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-800 dark:text-white rounded-lg transition-colors font-bold">Cancelar</button>
                <button type="submit" disabled={isLoading} className="flex-1 py-3 bg-sky-500 hover:bg-cyan-400 text-black rounded-lg transition-colors font-black shadow-[0_0_15px_rgba(14,165,233,0.3)] disabled:opacity-50">
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR ELIMINAR */}
      {contenidoAEliminar && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm md:pl-64 transition-all duration-300">
          <div className="w-full max-w-md bg-white/90 dark:bg-[#08060d]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500">
              <AlertTriangle size={32} />
            </div>
            <h3 className="title-fan text-2xl mb-2 text-slate-800 dark:text-white">¿Eliminar Contenido?</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Estás a punto de eliminar <strong>"{contenidoAEliminar.titulo}"</strong>. Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setContenidoAEliminar(null)} className="flex-1 py-3 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-800 dark:text-white rounded-lg transition-colors font-bold">Cancelar</button>
              <button onClick={confirmarEliminacion} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-black shadow-[0_0_15px_rgba(239,68,68,0.4)]">Sí, Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionContenidoPage;
