import { useState, useEffect, useRef } from 'react';
import { Camera, Edit2, Save, X, Flag, MapPin, UserIcon } from 'lucide-react';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import FormField from '@/components/ui/FormField';

const MiPerfilPage = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [datosPerfil, setDatosPerfil] = useState<any>(null);
  const [guardando, setGuardando] = useState(false);

  // // Referencia para el input de archivo oculto
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Estado para la previsualización de la foto seleccionada
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    //Datos de tabla Usuario
    email: '',
    nombre: '',
    apellido: '',
    telefono: '',
    fecha_nacimiento: '', genero: '', nacionalidad: '',
    provincia: '', ciudad: '', cp: '',
    calle: '', numero: '', piso: '', depto: '',

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
            email: data.usuario?.email || '',
            apellido: data.usuario?.apellido || '',
            telefono: data.usuario?.telefono || '',
            fecha_nacimiento: data.usuario?.fecha_nacimiento ? new Date(data.usuario.fecha_nacimiento).toISOString().split('T')[0] : '',
            genero: data.usuario?.genero || '',
            nacionalidad: data.usuario?.nacionalidad || '',
            provincia: data.usuario?.provincia || '',
            ciudad: data.usuario?.ciudad || '',
            cp: data.usuario?.cp || '',
            calle: data.usuario?.calle || '',
            numero: data.usuario?.numero || '',
            piso: data.usuario?.piso || '',
            depto: data.usuario?.depto || '',
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

  // --- LÓGICA PARA ELEGIR FOTO ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      // Creamos una URL temporal para mostrarla en pantalla al instante
      setAvatarPreview(URL.createObjectURL(file));
      setIsEditing(true); // Si elige foto, activamos el modo edición automáticamente
    }
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

      // 1. (OPCIONAL) Si hay una foto nueva, deberías mandarla a una ruta especial de NestJS acá.
       let nuevaUrlAvatar = datosPerfil?.perfil_fan?.avatar;
      
      if (avatarFile) {
        const formDataAvatar = new FormData();
        formDataAvatar.append('file', avatarFile);
        const resFoto = await fetch(`http://localhost:3000/perfil-fan/${perfilFanId}/avatar`, {
          method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formDataAvatar
        });
        const dataFoto = await resFoto.json();
        nuevaUrlAvatar = dataFoto.url; // Reemplazamos por la URL final que nos de el backend
      }
      

      // 2. Separamos datos
      const datosUsuario = {
        nombre: formData.nombre, apellido: formData.apellido, telefono: formData.telefono,
        fecha_nacimiento: formData.fecha_nacimiento, genero: formData.genero, nacionalidad: formData.nacionalidad,
        provincia: formData.provincia, ciudad: formData.ciudad, cp: formData.cp,
        calle: formData.calle, numero: formData.numero, piso: formData.piso, depto: formData.depto
      };

      const datosPerfilFan = {
        alias: formData.alias, bio: formData.bio, 
        hincha_marca_tc: formData.hincha_marca_tc, chicana_favorita: formData.chicana_favorita,
        avatar: nuevaUrlAvatar 
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
              {/* Le decimos que muestre el avatarPreview temporal, y si no hay, el de la BD */}
              {(avatarPreview || datosPerfil?.perfil_fan?.avatar) ? (
                <img src={avatarPreview || datosPerfil.perfil_fan.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-white">{datosPerfil?.usuario?.nombre?.charAt(0)}</span>
              )}
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            {/* Botón flotante para cambiar foto (Acá activamos el clic) */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={!isEditing}
              className={`absolute bottom-0 right-0 p-3 rounded-full text-white shadow-lg transition-transform ${isEditing ? 'bg-institucional-celeste hover:scale-110 cursor-pointer' : 'bg-slate-500 opacity-50 cursor-not-allowed'}`}
              title={isEditing ? "Cambiar foto de perfil" : "Habilitá la edición para cambiar la foto"}
            >
              <Camera size={20} />
            </button>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {datosPerfil?.usuario?.nombre} {datosPerfil?.usuario?.apellido}
            </h2>
            <p className="text-institucional-celeste font-semibold mb-2">
              {datosPerfil?.perfil_fan?.es_socio_club ? 'Socio Atlético Rafaela' : 'Fan del Óvalo'}
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
        <div className="gap-6 relative z-10">
          {/* --- SECCIÓN 1: DATOS PERSONALES --- */}
          <div className="p-3 border-t border-slate-200 dark:border-white/10">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white mb-4">
              <UserIcon size={20} className="text-institucional-celeste"/> Datos Personales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField label="DNI (No editable)" value={datosPerfil?.usuario?.dni || ''} disabled={true} />
              <FormField label="Nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} disabled={!isEditing} />
              <FormField label="Apellido" name="apellido" value={formData.apellido} onChange={handleInputChange} disabled={!isEditing} />
              <FormField label="Fecha de Nacimiento" name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleInputChange} disabled={!isEditing} />
              <FormField label="Género" name="genero" value={formData.genero} onChange={handleInputChange} disabled={!isEditing} options={[
                  { value: 'M', label: 'Masculino' },
                  { value: 'F', label: 'Femenino' },
                  { value: 'X', label: 'Otro' }
                ]} />
              <FormField label="Teléfono" name="telefono" value={formData.telefono} onChange={handleInputChange} disabled={!isEditing} />
            </div>
          </div>

          {/* --- SECCIÓN 2: DOMICILIO --- */}
          <div className="p-3 border-t border-slate-200 dark:border-white/10">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white mb-4">
              <MapPin size={20} className="text-institucional-celeste"/> Domicilio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <FormField label="Nacionalidad" name="nacionalidad" value={formData.nacionalidad} onChange={handleInputChange} disabled={!isEditing} />
              <FormField label="Provincia" name="provincia" value={formData.provincia} onChange={handleInputChange} disabled={!isEditing} />
              <FormField label="Ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} disabled={!isEditing} />
              <FormField label="Código Postal" name="cp" value={formData.cp} onChange={handleInputChange} disabled={!isEditing} />
              <div className="md:col-span-2">
                <FormField label="Calle" name="calle" value={formData.calle} onChange={handleInputChange} disabled={!isEditing} />
              </div>
              <FormField label="Número" name="numero" value={formData.numero} onChange={handleInputChange} disabled={!isEditing} />
              <div className="grid grid-cols-2 gap-2">
                <FormField label="Piso" name="piso" value={formData.piso} onChange={handleInputChange} disabled={!isEditing} />
                <FormField label="Depto" name="depto" value={formData.depto} onChange={handleInputChange} disabled={!isEditing} />
              </div>
            </div>
          </div>
        
          {/* --- SECCIÓN 3: PERFIL FAN --- */}
          <div className="p-3 border-t border-slate-200 dark:border-white/10">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white mb-4">
              <Flag size={20} className="text-institucional-celeste"/> Perfil Fan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Alias Fan" name="alias" value={formData.alias} onChange={handleInputChange} disabled={!isEditing} />
              
              <FormField label="Marca de TC preferida" name="hincha_marca_tc" value={formData.hincha_marca_tc} onChange={handleInputChange} disabled={!isEditing} options={[
                  { value: 'Ford', label: 'Ford' }, { value: 'Chevrolet', label: 'Chevrolet' },
                  { value: 'Dodge', label: 'Dodge' }, { value: 'Torino', label: 'Torino' },
                  { value: 'Toyota', label: 'Toyota' }, { value: 'Bmw', label: 'Bmw' },
                  { value: 'Mercedes', label: 'Mercedes' }
                ]} />

              <div className="md:col-span-2">
                <FormField label="Chicana Favorita" name="chicana_favorita" value={formData.chicana_favorita} onChange={handleInputChange} disabled={!isEditing} options={[
                  { value: '1 de adentro', label: '1 de adentro' }, { value: '1 de afuera', label: '1 de afuera' },
                  { value: '2 de adentro', label: '2 de adentro' }, { value: '2 de afuera', label: '2 de afuera' },
                  { value: '3', label: '3' }
                ]} />
              </div>

              <div className="md:col-span-2">
                <FormField label="Biografía (Tu historia en las pistas)" name="bio" value={formData.bio} onChange={handleInputChange} disabled={!isEditing} isTextarea={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiPerfilPage;
