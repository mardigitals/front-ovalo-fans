import { useState, useEffect } from 'react';
import { Camera, Edit2, Save, X, Flag } from 'lucide-react';
import FullScreenLoader from '@/components/ui/FullScreenLoader';

const MiPerfilPage = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [datosPerfil, setDatosPerfil] = useState<any>(null);
  const [guardando, setGuardando] = useState(false);

  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    //Datos de tabla Usuario
    nombre: '',
    apellido: '',
    telefono: '',
    //Datos de tabla PerfilFan
    alias: '',
    bio: '',
    hincha_marca_tc: '',
    chicana_favorita: '',
  });

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/usuario-auth/perfil', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setDatosPerfil(data);
        
        // Pre-cargamos los datos del Fan en el formulario
        if (data.perfil_fan) {
          setFormData({
            nombre: data.usuario?.nombre || '',
            apellido: data.usuario?.apellido || '',
            telefono: data.usuario?.telefono || '',
            alias: data.perfil_fan.alias || '',
            bio: data.perfil_fan.bio || '',
            hincha_marca_tc: data.perfil_fan.hincha_marca_tc || '',
            chicana_favorita: data.perfil_fan.chicana_favorita || '',
          });
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const guardarCambios = async () => {
    setGuardando(true);
    try {
      const token = localStorage.getItem('token');
      
      // 1. Rescatamos los IDs exactos de la memoria (los trajimos en el GET inicial)
      const usuarioId = datosPerfil?.usuario?.id;
      const perfilFanId = datosPerfil?.perfil_fan?.id;

      if (!usuarioId || !perfilFanId) {
        console.error("Bandera negra: Faltan los IDs para actualizar.");
        setGuardando(false);
        return;
      }

      // 2. Separamos datos
      const datosUsuario = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono
      };

      const datosPerfilFan = {
        alias: formData.alias,
        bio: formData.bio,
        hincha_marca_tc: formData.hincha_marca_tc,
        chicana_favorita: formData.chicana_favorita
      };

      // 3. Disparamos las DOS peticiones en paralelo usando tus controladores
      const [resUsuario, resPerfil] = await Promise.all([
        fetch(`http://localhost:3000/usuario/${usuarioId}`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify(datosUsuario)
        }),
        fetch(`http://localhost:3000/perfil-fan/${perfilFanId}`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify(datosPerfilFan)
        })
      ]);

      // 4. Chequeamos que las dos hayan cruzado la meta bien
      if (resUsuario.ok && resPerfil.ok) {
        console.log("¡Ambas tablas actualizadas con éxito!");
        
        // Actualizamos los datos visuales al instante
        setDatosPerfil((prev: any) => ({
          ...prev,
          usuario: { ...prev.usuario, ...datosUsuario },
          perfil_fan: { ...prev.perfil_fan, ...datosPerfilFan }
        }));
        
        setIsEditing(false);
      } else {
        console.error("Hubo un error al guardar en una de las rutas", resUsuario.status, resPerfil.status);
      }
    } catch (error) {
      console.error("Error de red al guardar:", error);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <FullScreenLoader />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white uppercase tracking-tighter">Mi Perfil</h1>

      <div className="bg-white dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        
        {/* Cabecera del Perfil (Avatar y Nombre) */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 relative z-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-institucional-celeste bg-slate-800 flex items-center justify-center">
              {datosPerfil?.perfil_fan?.avatar ? (
                <img src={datosPerfil.perfil_fan.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-white">{datosPerfil?.usuario?.nombre?.charAt(0)}</span>
              )}
            </div>
            {/* Botón flotante para cambiar foto */}
            <button className="absolute bottom-0 right-0 bg-institucional-celeste p-3 rounded-full text-white hover:scale-110 transition-transform shadow-lg cursor-pointer">
              <Camera size={20} />
            </button>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {datosPerfil?.usuario?.nombre} {datosPerfil?.usuario?.apellido}
            </h2>
            <p className="text-institucional-celeste font-semibold mb-2">
              {datosPerfil?.perfil_fan?.es_socio_club ? 'Socio Club Atlético Rafaela' : 'Fan del Óvalo'}
            </p>
          </div>

          {/* Botón Editar/Guardar */}
          <div className="sm:ml-auto">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white px-4 py-2 rounded-xl transition-colors">
                <Edit2 size={18} /> Editar Perfil
              </button>
            ) : (
              <div className="flex gap-2">
                {/* Le agregamos el disabled y una opacidad cuando está guardando */}
                <button onClick={() => setIsEditing(false)} disabled={guardando} className="p-2 text-slate-500 hover:text-red-500 transition-colors disabled:opacity-50">
                  <X size={24} />
                </button>
                {/* Le agregamos el disabled y cambiamos el texto dinámicamente */}
                <button onClick={guardarCambios} disabled={guardando} className="flex items-center gap-2 bg-institucional-celeste text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-70">
                  <Save size={18} /> {guardando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Formulario de Datos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          
          {/* Fila 1: DNI (Bloqueado) y Teléfono */}
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">DNI (No editable)</label>
            <input type="text" disabled value={datosPerfil?.usuario?.dni || ''} className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-500 dark:text-slate-400 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Teléfono</label>
            <input type="text" name="telefono" disabled={!isEditing} value={formData.telefono} onChange={handleInputChange} className={`w-full bg-slate-50 dark:bg-black/20 border rounded-xl px-4 py-3 text-slate-800 dark:text-white transition-colors ${isEditing ? 'border-institucional-celeste focus:ring-2 focus:ring-institucional-celeste/20' : 'border-slate-200 dark:border-white/10 opacity-70'}`} />
          </div>

          {/* Fila 2: Nombre y Apellido */}
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Nombre</label>
            <input type="text" name="nombre" disabled={!isEditing} value={formData.nombre} onChange={handleInputChange} className={`w-full bg-slate-50 dark:bg-black/20 border rounded-xl px-4 py-3 text-slate-800 dark:text-white transition-colors ${isEditing ? 'border-institucional-celeste focus:ring-2 focus:ring-institucional-celeste/20' : 'border-slate-200 dark:border-white/10 opacity-70'}`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Apellido</label>
            <input type="text" name="apellido" disabled={!isEditing} value={formData.apellido} onChange={handleInputChange} className={`w-full bg-slate-50 dark:bg-black/20 border rounded-xl px-4 py-3 text-slate-800 dark:text-white transition-colors ${isEditing ? 'border-institucional-celeste focus:ring-2 focus:ring-institucional-celeste/20' : 'border-slate-200 dark:border-white/10 opacity-70'}`} />
          </div>
          
          {/* Fila 3: Alias y Bio */}
          {/* <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Alias / Apodo</label>
            <input type="text" name="alias" disabled={!isEditing} value={formData.alias} onChange={handleInputChange} className={`w-full bg-slate-50 dark:bg-black/20 border rounded-xl px-4 py-3 text-slate-800 dark:text-white transition-colors ${isEditing ? 'border-institucional-celeste focus:ring-2 focus:ring-institucional-celeste/20' : 'border-slate-200 dark:border-white/10 opacity-70'}`} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Biografía (Tu historia en las pistas)</label>
            <textarea name="bio" disabled={!isEditing} rows={3} value={formData.bio} onChange={handleInputChange} className={`w-full bg-slate-50 dark:bg-black/20 border rounded-xl px-4 py-3 text-slate-800 dark:text-white transition-colors ${isEditing ? 'border-institucional-celeste focus:ring-2 focus:ring-institucional-celeste/20' : 'border-slate-200 dark:border-white/10 opacity-70'}`} />
          </div> */}

          {/* Fila 4: Hincha de qué marca de TC y Chicana Favorita */}
          {/* <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Marca de TC</label>
            <select name="hincha_marca_tc" disabled={!isEditing} value={formData.hincha_marca_tc} onChange={handleInputChange} className={`w-full bg-slate-50 dark:bg-black/20 border rounded-xl px-4 py-3 text-slate-800 dark:text-white transition-colors ${isEditing ? 'border-institucional-celeste focus:ring-2 focus:ring-institucional-celeste/20' : 'border-slate-200 dark:border-white/10 opacity-70'}`}>
              <option value="">Seleccionar...</option>
              <option value="Ford">Ford</option>
              <option value="Chevrolet">Chevrolet</option>
              <option value="Dodge">Dodge</option>
              <option value="Torino">Torino</option>
              <option value="Toyota">Toyota</option>
              <option value="Bmw">Bmw</option>
              <option value="Mercedes">Mercedes</option>
            </select>
          </div> */}
          {/* --- SECCIÓN 3: PERFIL PISTERO --- */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white mb-4"><Flag size={20} className="text-institucional-celeste"/> Perfil Pistero</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Alias / Apodo</label>
                <input type="text" name="alias" disabled={!isEditing} value={formData.alias} onChange={handleInputChange} className={`w-full bg-slate-50 dark:bg-black/20 border rounded-xl px-4 py-2 text-slate-800 dark:text-white transition-colors ${isEditing ? 'border-institucional-celeste focus:ring-2' : 'border-slate-200 dark:border-white/10 opacity-70'}`} />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Escudería (Marca de TC)</label>
                <select name="hincha_marca_tc" disabled={!isEditing} value={formData.hincha_marca_tc} onChange={handleInputChange} className={`w-full bg-slate-50 dark:bg-black/20 border rounded-xl px-4 py-2 text-slate-800 dark:text-white transition-colors ${isEditing ? 'border-institucional-celeste focus:ring-2' : 'border-slate-200 dark:border-white/10 opacity-70'}`}>
                  <option value="">Seleccionar...</option>
                  <option value="Ford">Ford</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Dodge">Dodge</option>
                  <option value="Torino">Torino</option>
                  <option value="Toyota">Toyota</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Chicana Favorita (Autódromo Rafaela)</label>
                <input type="text" name="chicana_favorita" disabled={!isEditing} value={formData.chicana_favorita} placeholder="Ej: La 2 de afuera..." onChange={handleInputChange} className={`w-full bg-slate-50 dark:bg-black/20 border rounded-xl px-4 py-2 text-slate-800 dark:text-white transition-colors ${isEditing ? 'border-institucional-celeste focus:ring-2' : 'border-slate-200 dark:border-white/10 opacity-70'}`} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Biografía (Tu historia en las pistas)</label>
                <textarea name="bio" disabled={!isEditing} rows={3} value={formData.bio} onChange={handleInputChange} className={`w-full bg-slate-50 dark:bg-black/20 border rounded-xl px-4 py-2 text-slate-800 dark:text-white transition-colors ${isEditing ? 'border-institucional-celeste focus:ring-2' : 'border-slate-200 dark:border-white/10 opacity-70'}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiPerfilPage;
