import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, FileText, Image as ImageIcon, CheckCircle, Search, Trash2, Pencil } from 'lucide-react';
import api from '@/api/axios';

const GestionNoticiasPage = () => {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [archivoPortada, setArchivoPortada] = useState<File | null>(null);
  const [error, setError] = useState('');
  
  // 🔥 NUEVO: Estado para manejar qué noticia estamos por eliminar
  const [noticiaAEliminar, setNoticiaAEliminar] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion_breve: '',
    cuerpo: '',
    es_destacado: false,
    url_recurso: '' 
  });

  const fetchNoticias = async () => {
    try {
      const response = await api.get('/contenido-multimedia');
      const soloNoticias = response.data.filter((c: any) => c.tipo === 'noticia' && c.cuerpo);
      setNoticias(soloNoticias);
    } catch (error) {
      console.error("Error cargando noticias:", error);
    }
  };

  useEffect(() => { fetchNoticias(); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAbrirModal = (noticia?: any) => {
    if (noticia) {
      setEditandoId(noticia.id);
      setFormData({
        titulo: noticia.titulo || '',
        descripcion_breve: noticia.descripcion_breve || '',
        cuerpo: noticia.cuerpo || '',
        es_destacado: Boolean(noticia.es_destacado),
        url_recurso: noticia.url_recurso || ''
      });
    } else {
      setEditandoId(null);
      setFormData({ titulo: '', descripcion_breve: '', cuerpo: '', es_destacado: false, url_recurso: '' });
    }
    setArchivoPortada(null);
    setError('');
    setIsModalOpen(true);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const payload = new FormData();
    payload.append('titulo', formData.titulo);
    payload.append('descripcion_breve', formData.descripcion_breve);
    payload.append('cuerpo', formData.cuerpo);
    payload.append('tipo', 'noticia'); 
    payload.append('nivel_acceso_requerido', '0'); 
    payload.append('es_destacado', formData.es_destacado ? '1' : '0');

    if (archivoPortada) {
      payload.append(editandoId ? 'archivo' : 'archivos', archivoPortada); 
    }

    try {
      if (editandoId) {
        await api.patch(`/contenido-multimedia/${editandoId}`, payload);
      } else {
        await api.post('/contenido-multimedia', payload);
      }
      await fetchNoticias();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar la noticia');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 NUEVO: Función para eliminar en el backend
  const confirmarEliminacion = async () => {
    if (!noticiaAEliminar) return;
    try {
      await api.delete(`/contenido-multimedia/${noticiaAEliminar.id}`);
      await fetchNoticias(); 
      setNoticiaAEliminar(null); // Cerramos el modal
    } catch (err: any) {
      alert(err.response?.data?.message || "Hubo un error al intentar eliminar la noticia.");
    }
  };

  const filtradas = noticias.filter(n => n.titulo?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto h-full">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-800 dark:text-white title-fan">
            Redacción de <span className="text-sky-500">Noticias</span>
          </h1>
          <p className="text-slate-500 mt-1">Creá y publicá comunicados institucionales en el portal.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar noticia..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:border-sky-500 text-slate-800 dark:text-white" 
            />
          </div>
          <button onClick={() => handleAbrirModal()} className="px-6 py-2 bg-sky-500 hover:bg-sky-400 text-black font-black uppercase tracking-wide rounded-xl transition-colors whitespace-nowrap shadow-md">
            + Nueva Noticia
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0a0f16] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
              <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider">Noticia</th>
              <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider">Vistas</th>
              {/* 🔥 NUEVO ENCABEZADO DE AUTOR */}
              <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider">Autor</th>
              <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map(noticia => (
              <tr key={noticia.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <img src={noticia.url_recurso} alt="Portada" className="w-16 h-12 object-cover rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white line-clamp-1">{noticia.titulo}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{noticia.descripcion_breve}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-slate-100 dark:bg-black/50 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold">{noticia.vistas}</span>
                </td>
                {/* 🔥 NUEVA CELDA QUE MUESTRA EL AUTOR */}
                <td className="p-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {noticia.autor ? `${noticia.autor.nombre} ${noticia.autor.apellido}` : 'Staff Óvalo'}
                </td>
                <td className="p-4 text-right">
                  {/* BOTONES DE ACCIÓN MINIMALISTAS */}
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleAbrirModal(noticia)} 
                      className="p-2 text-slate-400 hover:text-sky-500 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-sky-500/10 transition-all"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => setNoticiaAEliminar(noticia)} 
                      className="p-2 text-slate-400 hover:text-red-500 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-red-500/10 transition-all"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtradas.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">No se encontraron noticias.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL REDACTOR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm md:pl-64">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#08060d] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl relative p-6 md:p-8 animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-red-500 p-2"><X size={24} /></button>
            
            <h2 className="title-fan text-2xl uppercase mb-6 flex items-center gap-3 text-slate-800 dark:text-white">
              <FileText className="text-sky-500" /> {editandoId ? 'Editar Noticia' : 'Redactar Nueva Noticia'}
            </h2>

            {error && <div className="mb-4 bg-red-500/10 text-red-500 p-3 rounded font-bold text-sm border border-red-500/20">{error}</div>}

            <form onSubmit={handleGuardar} className="space-y-6">
              
              {/* TÍTULO */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Titular Principal</label>
                <input type="text" name="titulo" required value={formData.titulo} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 font-bold text-lg text-slate-800 dark:text-white" placeholder="Ej: Rafaela se prepara para el TC..." />
              </div>

              {/* FOTO Y BAJADA (Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><ImageIcon size={14}/> Foto de Portada</label>
                  <div className="p-4 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-xl text-center bg-slate-50 dark:bg-black/30 hover:border-sky-500 transition-colors relative cursor-pointer group h-[120px] flex items-center justify-center">
                    <input type="file" accept="image/*" onChange={(e) => setArchivoPortada(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    {archivoPortada ? (
                       <div className="text-sky-500 font-bold text-sm flex flex-col items-center gap-2"><CheckCircle size={24}/> {archivoPortada.name}</div>
                    ) : formData.url_recurso ? (
                       <img src={formData.url_recurso} alt="preview" className="h-20 w-auto rounded-lg object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    ) : (
                       <div className="text-slate-400 text-sm font-medium">Clic acá para subir foto <br/><span className="text-xs opacity-70 font-normal">(Recomendado: 1920x1080px)</span></div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Bajada (Descripción Breve)</label>
                  <textarea name="descripcion_breve" required maxLength={250} value={formData.descripcion_breve} onChange={handleInputChange} rows={4} className="w-full h-[120px] bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 resize-none text-sm text-slate-800 dark:text-white leading-relaxed" placeholder="Un resumen corto de 2 o 3 líneas que acompañará al título en la tarjeta..."></textarea>
                </div>
              </div>

              {/* CUERPO DE LA NOTICIA */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Cuerpo Completo de la Noticia</label>
                <textarea name="cuerpo" required value={formData.cuerpo} onChange={handleInputChange} rows={12} className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-4 outline-none focus:border-sky-500 text-slate-800 dark:text-slate-200 leading-relaxed" placeholder="Escribí acá todo el desarrollo de la noticia..."></textarea>
              </div>

              {/* DESTACAR */}
              <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl w-fit">
                <input type="checkbox" name="es_destacado" id="destacado_news" checked={formData.es_destacado} onChange={handleInputChange} className="w-5 h-5 rounded text-sky-500" />
                <label htmlFor="destacado_news" className="text-sm font-bold text-slate-700 dark:text-slate-300 select-none cursor-pointer">Marcar como Noticia <span className="text-amber-500 uppercase">Destacada</span></label>
              </div>

              {/* BOTONES */}
              <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isLoading} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" disabled={isLoading} className="px-8 py-3 bg-sky-500 hover:bg-sky-400 text-black font-black uppercase tracking-wide rounded-lg disabled:opacity-50 shadow-lg transition-colors">
                  {isLoading ? 'Publicando...' : 'Publicar Noticia'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 🔥 MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {noticiaAEliminar && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm md:pl-64">
          <div className="w-full max-w-md bg-white dark:bg-[#08060d] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500">
              <AlertTriangle size={32} />
            </div>
            <h3 className="title-fan text-2xl mb-2 text-slate-800 dark:text-white uppercase tracking-tight">¿Eliminar Noticia?</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Estás a punto de eliminar <strong>"{noticiaAEliminar.titulo}"</strong>. Esta acción no se puede deshacer y borrará la noticia del portal público.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setNoticiaAEliminar(null)} 
                className="flex-1 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white rounded-xl transition-colors font-bold"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarEliminacion} 
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-black uppercase tracking-wide shadow-lg shadow-red-500/30"
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

export default GestionNoticiasPage;