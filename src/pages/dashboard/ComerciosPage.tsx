// import React, { useState, useEffect } from 'react';
// import GenericCrud from '@/components/ui/GenericCrud';
// import { useAuth } from '@/hooks/useAuth';
// import { X, AlertTriangle } from 'lucide-react'; 
// import api from '@/api/axios';

// // --- IMPORTACIONES DEL MAPA (LEAFLET) ---
// import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Arreglo nativo para que el ícono del pin cargue bien en React
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// // --- SUB-COMPONENTE: EL MAPA INTERACTIVO ---
// const ClickableMap = ({ lat, lng, onLocationSelect }: { lat: number | string, lng: number | string, onLocationSelect: (lat: number, lng: number) => void }) => {
//   useMapEvents({
//     click(e) {
//       onLocationSelect(e.latlng.lat, e.latlng.lng);
//     },
//   });

//   return (
//     <>
//       <TileLayer
//         url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />
//       {lat && lng && <Marker position={[Number(lat), Number(lng)]} />}
//     </>
//   );
// };

// const initialState = {
//   nombre_comercio: '', cuit: '', rubro: '', descuento_porcentaje: 10,
//   condicion_pago: 'TODOS', calle: '', numero: '', ciudad: 'Rafaela', cp: '',
//   latitud: '', longitud: ''
// };

// const ComerciosPage = () => {
//   const { userProfile } = useAuth();
//   const esAdmin = userProfile?.rol?.toLowerCase() === 'superadmin' || userProfile?.rol?.toLowerCase() === 'administrativo';

//   const [comercios, setComercios] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   // Estados para Modales
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [comercioEditando, setComercioEditando] = useState<any>(null);
//   const [formData, setFormData] = useState(initialState);
  
//   // Nuevo Estado para Modal de Eliminación
//   const [comercioAEliminar, setComercioAEliminar] = useState<any>(null);

//   const rafaelaCenter: [number, number] = [-31.2528, -61.4917];

//   const fetchComercios = async () => {
//     try {
//       const response = await api.get('/comercio-aliado');
//       setComercios(response.data);
//     } catch (error) {
//       console.error("Error cargando comercios:", error);
//     }
//   };

//   useEffect(() => { fetchComercios(); }, []);

//   const datosFiltrados = comercios.filter(c =>
//     c.nombre_comercio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     c.rubro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     c.cuit?.includes(searchTerm) ||
//     c.descuento_porcentaje?.toString().includes(searchTerm) ||
//     c.calle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     c.ciudad?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAdd = () => {
//     setComercioEditando(null); setFormData(initialState); setError(''); setIsModalOpen(true);
//   };

//   const handleEdit = (comercio: any) => {
//     setComercioEditando(comercio);
//     setFormData({
//       nombre_comercio: comercio.nombre_comercio, cuit: comercio.cuit || '', rubro: comercio.rubro || '',
//       descuento_porcentaje: comercio.descuento_porcentaje || 10, condicion_pago: comercio.condicion_pago || 'TODOS',
//       calle: comercio.calle || '', numero: comercio.numero || '', ciudad: comercio.ciudad || 'Rafaela',
//       cp: comercio.cp || '', latitud: comercio.latitud || '', longitud: comercio.longitud || ''
//     });
//     setError(''); setIsModalOpen(true);
//   };

//   // Abre el modal de confirmación 
//   const handleDeleteClick = (comercio: any) => {
//     setComercioAEliminar(comercio);
//   };

//   // Ejecuta la eliminación real
//   const confirmarEliminacion = async () => {
//     if (!comercioAEliminar) return;
//     try {
//       await api.delete(`/comercio-aliado/${comercioAEliminar.id}`);
//       fetchComercios(); 
//       setComercioAEliminar(null); // Cerramos el modal
//     } catch (err) {
//       alert("Hubo un error al intentar eliminar el comercio.");
//     }
//   };

//   const handleGuardar = async (e: React.FormEvent) => {
//     e.preventDefault(); setIsLoading(true); setError('');
//     const payload = {
//       ...formData,
//       descuento_porcentaje: formData.descuento_porcentaje ? Number(formData.descuento_porcentaje) : undefined,
//       latitud: formData.latitud ? String(formData.latitud) : undefined,
//       longitud: formData.longitud ? String(formData.longitud) : undefined,
//     };

//     try {
//       if (comercioEditando) await api.patch(`/comercio-aliado/${comercioEditando.id}`, payload);
//       else await api.post('/comercio-aliado', payload);
      
//       await fetchComercios(); setIsModalOpen(false);
//     } catch (err: any) {
//       const msg = err.response?.data?.message || 'Error al guardar el comercio';
//       setError(Array.isArray(msg) ? msg[0] : msg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const columns = [
//     { key: 'nombre_comercio', label: 'Comercio' },
//     { key: 'cuit', label: 'CUIT' },
//     { key: 'rubro', label: 'Rubro' },
//     { key: 'calle', label: 'Dirección', render: (item: any) => `${item.calle} ${item.numero || ''}`.trim() },
//     { 
//       key: 'descuento_porcentaje', 
//       label: 'Descuento',
//       render: (item: any) => (
//         <span className="bg-institucional-celeste/20 text-institucional-celeste px-2 py-1 rounded text-xs font-black">
//           {item.descuento_porcentaje}%
//         </span>
//       )
//     },
//     { 
//       key: 'condicion_pago', 
//       label: 'Condición Pago',
//       render: (item: any) => (
//         <span className="text-xs font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 px-2 py-1 rounded">
//           {item.condicion_pago.replace(/_/g, ' ')}
//         </span>
//       )
//     },
//   ];

//   return (
//     <div className="relative h-full">
//       <GenericCrud
//         title="COMERCIOS ADHERIDOS" subtitle="Gestioná la red de locales con beneficios para los fans."
//         columns={columns} data={datosFiltrados} searchTerm={searchTerm}
//         onSearchChange={(e) => setSearchTerm(e.target.value)}
//         onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDeleteClick} canEdit={esAdmin} 
//       />

//       {/* --- MODAL DE FORMULARIO (NUEVO/EDITAR) --- */}
//       {isModalOpen && (
//         // El z-[999] y md:pl-64 aseguran que tape la sidebar y se centre perfecto en el contenido
//         <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm md:pl-64 transition-all duration-300">
//           <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/90 dark:bg-[#08060d]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl relative p-6 animate-in zoom-in-95 duration-300">
            
//             <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-sky-500 transition-colors bg-slate-100 dark:bg-white/5 p-2 rounded-full z-10">
//               <X size={20} />
//             </button>

//             <h1 className="title-fan text-2xl ">
//               {comercioEditando ? 'EDITAR COMERCIO' : 'NUEVO COMERCIO'}
//             </h1>

//             {error && <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded font-bold">{error}</div>}

//             <form onSubmit={handleGuardar} className="space-y-6">
              
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* COLUMNA IZQUIERDA: DATOS DE TEXTO */}
//                 <div className="space-y-4">
//                   <div><label className="label-fan">Nombre del Comercio *</label><input type="text" name="nombre_comercio" value={formData.nombre_comercio} onChange={handleInputChange} className="input-fan" required /></div>
                  
//                   <div className="grid grid-cols-2 gap-4">
//                     <div><label className="label-fan">CUIT *</label><input type="text" name="cuit" value={formData.cuit} onChange={handleInputChange} className="input-fan" required /></div>
//                     <div><label className="label-fan">Rubro</label><input type="text" name="rubro" value={formData.rubro} onChange={handleInputChange} className="input-fan" /></div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div><label className="label-fan">Descuento (%)</label><input type="number" name="descuento_porcentaje" value={formData.descuento_porcentaje} onChange={handleInputChange} className="input-fan" /></div>
//                     <div>
//                       <label className="label-fan">Condición de Pago *</label>
//                       <select name="condicion_pago" value={formData.condicion_pago} onChange={handleInputChange} className="input-fan" required>
//                         <option value="SOLO_EFECTIVO">Solo Efectivo</option><option value="CON_TARJETA">Con Tarjeta</option><option value="CON_TRANSFERENCIA">Con Transferencia</option><option value="EFECTIVO_TRANSFERENCIA">Efectivo / Transfer</option><option value="TODOS">Todos los medios</option>
//                       </select>
//                     </div>
//                   </div>

//                   <h4 className="subtitle-fan text-sm border-b border-slate-200 dark:border-white/10 pb-1 mt-4">Dirección</h4>
//                   <div className="grid grid-cols-3 gap-2">
//                     <div className="col-span-2"><input type="text" name="calle" value={formData.calle} onChange={handleInputChange} placeholder="Calle *" className="input-fan" required /></div>
//                     <div><input type="text" name="numero" value={formData.numero} onChange={handleInputChange} placeholder="Nro *" className="input-fan" required /></div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-2">
//                     <div><input type="text" name="ciudad" value={formData.ciudad} onChange={handleInputChange} placeholder="Ciudad *" className="input-fan" required /></div>
//                     <div><input type="text" name="cp" value={formData.cp} onChange={handleInputChange} placeholder="CP *" className="input-fan" required /></div>
//                   </div>
//                 </div>

//                 {/* COLUMNA DERECHA: EL MAPA INTERACTIVO */}
//                 <div className="flex flex-col space-y-2">
//                   <label className="label-fan">Ubicación en el Mapa <span className="text-[10px] text-sky-500 normal-case ml-2">(Hacé click para fijar el pin)</span></label>
                  
//                   <div className="flex-1 min-h-[300px] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 z-0 relative">
//                     <MapContainer 
//                       center={formData.latitud ? [Number(formData.latitud), Number(formData.longitud)] : rafaelaCenter} 
//                       zoom={14} 
//                       style={{ height: '100%', width: '100%' }}
//                     >
//                       <ClickableMap 
//                         lat={formData.latitud} 
//                         lng={formData.longitud} 
//                         onLocationSelect={(lat, lng) => setFormData(prev => ({ ...prev, latitud: lat.toString(), longitud: lng.toString() }))} 
//                       />
//                     </MapContainer>
//                   </div>

//                   <div className="flex justify-between text-[10px] text-slate-500 font-mono">
//                     <span>Lat: {formData.latitud || 'Pendiente'}</span>
//                     <span>Lng: {formData.longitud || 'Pendiente'}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex gap-3">
//                 <button type="button" onClick={() => setIsModalOpen(false)} disabled={isLoading} className="flex-1 py-3 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-800 dark:text-white rounded-lg transition-colors font-bold">
//                   Cancelar
//                 </button>
//                 <button type="submit" disabled={isLoading} className="flex-1 py-3 bg-sky-500 hover:bg-cyan-400 text-black rounded-lg transition-colors font-black shadow-[0_0_15px_rgba(14,165,233,0.3)] disabled:opacity-50">
//                   {isLoading ? 'Guardando...' : 'Guardar Comercio'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* --- MODAL DE CONFIRMACIÓN DE ELIMINACIÓN --- */}
//       {comercioAEliminar && (
//         <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm md:pl-64 transition-all duration-300">
//           <div className="w-full max-w-md bg-white/90 dark:bg-[#08060d]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-300">
            
//             <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500">
//               <AlertTriangle size={32} />
//             </div>
            
//             <h3 className="title-fan text-2xl mb-2 text-slate-800 dark:text-white">¿Eliminar Comercio?</h3>
//             <p className="text-slate-500 dark:text-slate-400 mb-6">
//               Estás a punto de eliminar <strong>"{comercioAEliminar.nombre_comercio}"</strong>. Esta acción no se puede deshacer.
//             </p>
            
//             <div className="flex gap-3">
//               <button 
//                 onClick={() => setComercioAEliminar(null)} 
//                 className="flex-1 py-3 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-800 dark:text-white rounded-lg transition-colors font-bold"
//               >
//                 Cancelar
//               </button>
//               <button 
//                 onClick={confirmarEliminacion} 
//                 className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-black shadow-[0_0_15px_rgba(239,68,68,0.4)]"
//               >
//                 Sí, Eliminar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default ComerciosPage;
import React, { useState, useEffect } from 'react';
import GenericCrud from '@/components/ui/GenericCrud';
import { useAuth } from '@/hooks/useAuth';
import { X, AlertTriangle } from 'lucide-react'; 
import api from '@/api/axios';

// --- IMPORTACIONES DEL MAPA (LEAFLET) ---
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Arreglo nativo para que el ícono del pin cargue bien en React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- SUB-COMPONENTE: EL MAPA INTERACTIVO ---
const ClickableMap = ({ lat, lng, onLocationSelect }: { lat: number | string, lng: number | string, onLocationSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {lat && lng && <Marker position={[Number(lat), Number(lng)]} />}
    </>
  );
};

const initialState = {
  nombre_comercio: '', cuit: '', rubro: '', descuento_porcentaje: 10,
  condicion_pago: 'TODOS', calle: '', numero: '', ciudad: 'Rafaela', cp: '',
  latitud: '', longitud: ''
};

const ComerciosPage = () => {
  const { userProfile } = useAuth();
  const esAdmin = userProfile?.rol?.toLowerCase() === 'superadmin' || userProfile?.rol?.toLowerCase() === 'administrativo';

  const [comercios, setComercios] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // --- ESTADOS DE PAGINACIÓN FRONTEND ---
  const [paginaActual, setPaginaActual] = useState(1);
  const limitePorPagina = 10; // Podés cambiar a 5 si querés que cambie de página más rápido
  
  // Estados para Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comercioEditando, setComercioEditando] = useState<any>(null);
  const [formData, setFormData] = useState(initialState);
  
  // Nuevo Estado para Modal de Eliminación
  const [comercioAEliminar, setComercioAEliminar] = useState<any>(null);

  const rafaelaCenter: [number, number] = [-31.2528, -61.4917];

  const fetchComercios = async () => {
    try {
      const response = await api.get('/comercio-aliado');
      setComercios(response.data);
    } catch (error) {
      console.error("Error cargando comercios:", error);
    }
  };

  useEffect(() => { fetchComercios(); }, []);

  // Resetear a la página 1 cada vez que el usuario busca algo
  useEffect(() => {
    setPaginaActual(1);
  }, [searchTerm]);

  // 1. Primero Filtramos todos los registros
  const datosFiltrados = comercios.filter(c =>
    c.nombre_comercio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.rubro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cuit?.includes(searchTerm) ||
    c.descuento_porcentaje?.toString().includes(searchTerm) ||
    c.calle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.ciudad?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Después aplicamos la matemática de Paginación sobre los filtrados
  const indiceUltimoItem = paginaActual * limitePorPagina;
  const indicePrimerItem = indiceUltimoItem - limitePorPagina;
  const comerciosPaginados = datosFiltrados.slice(indicePrimerItem, indiceUltimoItem); // "Cortamos" el array
  const totalPaginas = Math.ceil(datosFiltrados.length / limitePorPagina);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setComercioEditando(null); setFormData(initialState); setError(''); setIsModalOpen(true);
  };

  const handleEdit = (comercio: any) => {
    setComercioEditando(comercio);
    setFormData({
      nombre_comercio: comercio.nombre_comercio, cuit: comercio.cuit || '', rubro: comercio.rubro || '',
      descuento_porcentaje: comercio.descuento_porcentaje || 10, condicion_pago: comercio.condicion_pago || 'TODOS',
      calle: comercio.calle || '', numero: comercio.numero || '', ciudad: comercio.ciudad || 'Rafaela',
      cp: comercio.cp || '', latitud: comercio.latitud || '', longitud: comercio.longitud || ''
    });
    setError(''); setIsModalOpen(true);
  };

  // Abre el modal de confirmación 
  const handleDeleteClick = (comercio: any) => {
    setComercioAEliminar(comercio);
  };

  // Ejecuta la eliminación real
  const confirmarEliminacion = async () => {
    if (!comercioAEliminar) return;
    try {
      await api.delete(`/comercio-aliado/${comercioAEliminar.id}`);
      fetchComercios(); 
      setComercioAEliminar(null); // Cerramos el modal
      
      // Si borramos el último de una página, retrocedemos
      if (comerciosPaginados.length === 1 && paginaActual > 1) {
        setPaginaActual(paginaActual - 1);
      }
    } catch (err) {
      alert("Hubo un error al intentar eliminar el comercio.");
    }
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true); setError('');
    const payload = {
      ...formData,
      descuento_porcentaje: formData.descuento_porcentaje ? Number(formData.descuento_porcentaje) : undefined,
      latitud: formData.latitud ? String(formData.latitud) : undefined,
      longitud: formData.longitud ? String(formData.longitud) : undefined,
    };

    try {
      if (comercioEditando) await api.patch(`/comercio-aliado/${comercioEditando.id}`, payload);
      else await api.post('/comercio-aliado', payload);
      
      await fetchComercios(); setIsModalOpen(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al guardar el comercio';
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { key: 'nombre_comercio', label: 'Comercio' },
    { key: 'cuit', label: 'CUIT' },
    { key: 'rubro', label: 'Rubro' },
    { key: 'calle', label: 'Dirección', render: (item: any) => `${item.calle} ${item.numero || ''}`.trim() },
    { 
      key: 'descuento_porcentaje', 
      label: 'Descuento',
      render: (item: any) => (
        <span className="bg-institucional-celeste/20 text-institucional-celeste px-2 py-1 rounded text-xs font-black">
          {item.descuento_porcentaje}%
        </span>
      )
    },
    { 
      key: 'condicion_pago', 
      label: 'Condición Pago',
      render: (item: any) => (
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 px-2 py-1 rounded">
          {item.condicion_pago.replace(/_/g, ' ')}
        </span>
      )
    },
  ];

  return (
    <div className="relative h-full">
      <GenericCrud
        title="COMERCIOS ADHERIDOS" subtitle="Gestioná la red de locales con beneficios para los fans."
        columns={columns} 
        data={comerciosPaginados} // <-- Le mandamos solo la porción de la página actual
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDeleteClick} canEdit={esAdmin} 
        // --- PROPS DE PAGINACIÓN ---
        currentPage={paginaActual}
        totalPages={totalPaginas}
        onPageChange={(page) => setPaginaActual(page)}
      />

      {/* --- MODAL DE FORMULARIO (NUEVO/EDITAR) --- */}
      {isModalOpen && (
        // El z-[999] y md:pl-64 aseguran que tape la sidebar y se centre perfecto en el contenido
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm md:pl-64 transition-all duration-300">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/90 dark:bg-[#08060d]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl relative p-6 animate-in zoom-in-95 duration-300">
            
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-sky-500 transition-colors bg-slate-100 dark:bg-white/5 p-2 rounded-full z-10">
              <X size={20} />
            </button>

            <h1 className="title-fan text-2xl ">
              {comercioEditando ? 'EDITAR COMERCIO' : 'NUEVO COMERCIO'}
            </h1>

            {error && <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded font-bold">{error}</div>}

            <form onSubmit={handleGuardar} className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* COLUMNA IZQUIERDA: DATOS DE TEXTO */}
                <div className="space-y-4">
                  <div><label className="label-fan">Nombre del Comercio *</label><input type="text" name="nombre_comercio" value={formData.nombre_comercio} onChange={handleInputChange} className="input-fan" required /></div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="label-fan">CUIT *</label><input type="text" name="cuit" value={formData.cuit} onChange={handleInputChange} className="input-fan" required /></div>
                    <div><label className="label-fan">Rubro</label><input type="text" name="rubro" value={formData.rubro} onChange={handleInputChange} className="input-fan" /></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="label-fan">Descuento (%)</label><input type="number" name="descuento_porcentaje" value={formData.descuento_porcentaje} onChange={handleInputChange} className="input-fan" /></div>
                    <div>
                      <label className="label-fan">Condición de Pago *</label>
                      <select name="condicion_pago" value={formData.condicion_pago} onChange={handleInputChange} className="input-fan" required>
                        <option value="SOLO_EFECTIVO">Solo Efectivo</option><option value="CON_TARJETA">Con Tarjeta</option><option value="CON_TRANSFERENCIA">Con Transferencia</option><option value="EFECTIVO_TRANSFERENCIA">Efectivo / Transfer</option><option value="TODOS">Todos los medios</option>
                      </select>
                    </div>
                  </div>

                  <h4 className="subtitle-fan text-sm border-b border-slate-200 dark:border-white/10 pb-1 mt-4">Dirección</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2"><input type="text" name="calle" value={formData.calle} onChange={handleInputChange} placeholder="Calle *" className="input-fan" required /></div>
                    <div><input type="text" name="numero" value={formData.numero} onChange={handleInputChange} placeholder="Nro *" className="input-fan" required /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><input type="text" name="ciudad" value={formData.ciudad} onChange={handleInputChange} placeholder="Ciudad *" className="input-fan" required /></div>
                    <div><input type="text" name="cp" value={formData.cp} onChange={handleInputChange} placeholder="CP *" className="input-fan" required /></div>
                  </div>
                </div>

                {/* COLUMNA DERECHA: EL MAPA INTERACTIVO */}
                <div className="flex flex-col space-y-2">
                  <label className="label-fan">Ubicación en el Mapa <span className="text-[10px] text-sky-500 normal-case ml-2">(Hacé click para fijar el pin)</span></label>
                  
                  <div className="flex-1 min-h-[300px] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 z-0 relative">
                    <MapContainer 
                      center={formData.latitud ? [Number(formData.latitud), Number(formData.longitud)] : rafaelaCenter} 
                      zoom={14} 
                      style={{ height: '100%', width: '100%' }}
                    >
                      <ClickableMap 
                        lat={formData.latitud} 
                        lng={formData.longitud} 
                        onLocationSelect={(lat, lng) => setFormData(prev => ({ ...prev, latitud: lat.toString(), longitud: lng.toString() }))} 
                      />
                    </MapContainer>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Lat: {formData.latitud || 'Pendiente'}</span>
                    <span>Lng: {formData.longitud || 'Pendiente'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isLoading} className="flex-1 py-3 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-800 dark:text-white rounded-lg transition-colors font-bold">
                  Cancelar
                </button>
                <button type="submit" disabled={isLoading} className="flex-1 py-3 bg-sky-500 hover:bg-cyan-400 text-black rounded-lg transition-colors font-black shadow-[0_0_15px_rgba(14,165,233,0.3)] disabled:opacity-50">
                  {isLoading ? 'Guardando...' : 'Guardar Comercio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE CONFIRMACIÓN DE ELIMINACIÓN --- */}
      {comercioAEliminar && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm md:pl-64 transition-all duration-300">
          <div className="w-full max-w-md bg-white/90 dark:bg-[#08060d]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-300">
            
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500">
              <AlertTriangle size={32} />
            </div>
            
            <h3 className="title-fan text-2xl mb-2 text-slate-800 dark:text-white">¿Eliminar Comercio?</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Estás a punto de eliminar <strong>"{comercioAEliminar.nombre_comercio}"</strong>. Esta acción no se puede deshacer.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setComercioAEliminar(null)} 
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

export default ComerciosPage;