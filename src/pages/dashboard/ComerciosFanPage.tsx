import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { Store, MapPin, Tag, Search } from 'lucide-react'; 

// --- IMPORTACIONES DEL MAPA (LEAFLET) ---
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Arreglo nativo para el ícono del pin
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ComerciosFanPage = () => {
  const [comercios, setComercios] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Centro por defecto: Autódromo/Rafaela
  const rafaelaCenter: [number, number] = [-31.2528, -61.4917];

  useEffect(() => {
    const fetchComercios = async () => {
      try {
        const response = await api.get('/comercio-aliado');
        // Filtramos para asegurarnos de no mostrar comercios inactivos (si tuvieras ese estado)
        setComercios(response.data);
      } catch (error) {
        console.error("Error cargando comercios:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComercios();
  }, []);

  // Filtrado simple por búsqueda
  const comerciosFiltrados = comercios.filter(c =>
    c.nombre_comercio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.rubro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.calle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-institucional-celeste border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white uppercase tracking-tighter flex items-center gap-2">
            <Store className="text-institucional-celeste" /> Locales Adheridos
          </h1>
          <p className="text-slate-500">
            Descubrí todos los comercios donde tenés beneficios exclusivos por ser Fan.
          </p>
        </div>
      </div>

      {/* MAPA INTERACTIVO CON TODOS LOS PINES */}
      <div className="bg-white dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-lg">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <MapPin size={16} className="text-red-500" /> Mapa de Beneficios
        </h2>
        <div className="h-[400px] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-white/5 relative z-0">
          <MapContainer 
            center={rafaelaCenter} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            
            {/* Renderizamos un pin por cada comercio filtrado que tenga coordenadas */}
            {comerciosFiltrados.map((comercio) => {
              if (comercio.latitud && comercio.longitud) {
                return (
                  <Marker 
                    key={comercio.id} 
                    position={[Number(comercio.latitud), Number(comercio.longitud)]}
                  >
                    {/* El Popup es la tarjetita que se abre al tocar el pin */}
                    <Popup className="rounded-xl">
                      <div className="text-center p-1">
                        <strong className="block text-slate-800 text-sm uppercase mb-1">{comercio.nombre_comercio}</strong>
                        <span className="bg-institucional-celeste text-white font-black px-2 py-0.5 rounded text-xs">
                          {comercio.descuento_porcentaje}% OFF
                        </span>
                        <p className="text-xs text-slate-500 mt-2">{comercio.calle} {comercio.numero}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })}
          </MapContainer>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por comercio, rubro o calle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full bg-white dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl py-3 focus:ring-2 focus:ring-institucional-celeste focus:border-transparent transition-all outline-none"
        />
      </div>

      {/* GRILLA DE TARJETAS (LISTADO) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comerciosFiltrados.length > 0 ? (
          comerciosFiltrados.map((comercio) => (
            <div key={comercio.id} className="bg-white dark:bg-[#161024] border border-slate-200 dark:border-white/5 rounded-2xl p-5 hover:border-institucional-celeste/50 transition-colors shadow-sm group">
              <div className="flex justify-between items-start mb-4">
                <div className="m-1">
                  <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-institucional-celeste transition-colors">
                    {comercio.nombre_comercio}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium uppercase mt-1">{comercio.rubro || 'Comercio Adherido'}</p>
                </div>
                <div className="bg-institucional-celeste/10 text-institucional-celeste border border-institucional-celeste/20 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-inner">
                  <Tag size={14} />
                  <span className="font-black text-sm">{comercio.descuento_porcentaje}%</span>
                </div>
              </div>

              <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-white/5 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-slate-400" />
                  <span>{comercio.calle} {comercio.numero}, {comercio.ciudad}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
            <p className="text-slate-500 font-medium">No se encontraron comercios con esa búsqueda.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ComerciosFanPage;