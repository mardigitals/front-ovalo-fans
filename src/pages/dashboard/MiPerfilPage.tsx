import React, { useState, useEffect, useRef } from 'react';
import { Camera, Edit2, Save, X, Flag, MapPin, UserIcon, Check } from 'lucide-react';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import FormField from '@/components/ui/FormField';

const MiPerfilPage = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [datosPerfil, setDatosPerfil] = useState<any>(null);
  const [guardando, setGuardando] = useState(false);
  // Estado para manejar los errores de cada campo individualmente
  const [errores, setErrores] = useState<Record<string, string>>({});
  // Estado para errores generales del servidor
  const [errorGlobal, setErrorGlobal] = useState<string>('');
  // // Referencia para el input de archivo oculto
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Estado para la previsualización de la foto seleccionada
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [provincias, setProvincias] = useState<any[]>([]);
  const [ciudades, setCiudades] = useState<any[]>([]);
  const [paises] = useState<string[]>([
    'Alemania', 'Bolivia', 'Brasil', 'Canadá', 'Chile', 'Colombia', 
    'Costa Rica', 'Ecuador', 'El Salvador', 'España', 'Estados Unidos', 
    'Francia', 'Guatemala', 'Honduras', 'Italia', 'México', 'Nicaragua', 
    'Panamá', 'Paraguay', 'Perú', 'Reino Unido', 'Uruguay', 'Venezuela', 'Otro'
  ]);


  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    //Datos de tabla Usuario
    email: '',
    nombre: '',
    apellido: '',
    telefono: '',
    fecha_nacimiento: '', genero: '', nacionalidad: '', pais: '',
    provincia: '', ciudad: '', cp: '',
    calle: '', numero: '', piso: '', depto: '',

    //Datos de tabla PerfilFan
    alias: '',
    bio: '',
    hincha_marca_tc: '',
    chicana_favorita: '',
  });

  // 1. CARGAR PROVINCIAS (Desde API del Gobierno)
  useEffect(() => {
      const fetchProvincias = async () => {
          try {
              const response = await fetch('https://apis.datos.gob.ar/georef/api/provincias?orden=nombre');
              const data = await response.json();
              setProvincias(data.provincias);
          } catch (error) {
              console.error("Error al cargar provincias:", error);
          }
      };
      fetchProvincias();
  }, []);

  // 2. CARGAR CIUDADES (Solo si es Argentina)
  useEffect(() => {
      // Si no hay provincia elegida, O el país NO es Argentina, cortamos acá.
      if (!formData.provincia || formData.pais !== 'Argentina') {
          setCiudades([]);
          return;
      }
      const fetchCiudades = async () => {
          try {
              const response = await fetch(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${formData.provincia}&max=2000&orden=nombre`);
              const data = await response.json();
              setCiudades(data.localidades);
          } catch (error) {
              console.error("Error al cargar ciudades:", error);
          }
      };
      fetchCiudades();
  }, [formData.provincia, formData.pais]); // <-- Agregamos formData.pais a las dependencias

  
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/usuario-auth/perfil', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setDatosPerfil(data);
        
       
        // Pre-cargamos los datos SIEMPRE, sin importar si es Fan o Staff
        setFormData({
          nombre: data.usuario?.nombre || '',
          email: data.usuario?.email || '',
          apellido: data.usuario?.apellido || '',
          telefono: data.usuario?.telefono || '',
          fecha_nacimiento: data.usuario?.fecha_nacimiento ? new Date(data.usuario.fecha_nacimiento).toISOString().split('T')[0] : '',
          genero: data.usuario?.genero || '',
          nacionalidad: data.usuario?.nacionalidad || '',
          pais: data.usuario?.pais || '',
          provincia: data.usuario?.provincia || '',
          ciudad: data.usuario?.ciudad || '',
          cp: data.usuario?.cp || '',
          calle: data.usuario?.calle || '',
          numero: data.usuario?.numero || '',
          piso: data.usuario?.piso || '',
          depto: data.usuario?.depto || '',
          // Los datos de fan pueden venir nulos si es Staff, usamos ?.
          alias: data.perfil_fan?.alias || '',
          bio: data.perfil_fan?.bio || '',
          hincha_marca_tc: data.perfil_fan?.hincha_marca_tc || '',
          chicana_favorita: data.perfil_fan?.chicana_favorita || '',
        });
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
    setErrores({}); // Limpiamos errores anteriores
    setErrorGlobal(''); // Limpiamos error global anterior

    try {
      const token = localStorage.getItem('token');      
      const usuarioId = datosPerfil?.usuario?.id;
      const perfilFanId = datosPerfil?.perfil_fan?.id;
      const perfilStaffId = datosPerfil?.perfil_staff?.id;
      const rol = datosPerfil?.rol; 
      const esStaff = rol && rol !== 'fan';

      if (!usuarioId || (esStaff && !perfilStaffId) || (!esStaff && !perfilFanId)) {
        setErrorGlobal("Error interno: Faltan IDs para actualizar.");
        setGuardando(false);
        return;
      }

      let nuevaUrlAvatar = datosPerfil?.perfil_fan?.avatar || datosPerfil?.usuario?.avatar;
      
      if (avatarFile && perfilFanId) {
        const formDataAvatar = new FormData();
        formDataAvatar.append('file', avatarFile);
        const resFoto = await fetch(`http://localhost:3000/perfil-fan/${perfilFanId}/avatar`, {
          method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formDataAvatar
        });
        const dataFoto = await resFoto.json();
        nuevaUrlAvatar = dataFoto.url; 
      }

      const datosUsuario = {
        nombre: formData.nombre, apellido: formData.apellido, telefono: formData.telefono,
        fecha_nacimiento: formData.fecha_nacimiento || datosPerfil?.usuario?.fecha_nacimiento, genero: formData.genero, nacionalidad: formData.nacionalidad || datosPerfil?.usuario?.nacionalidad,
        pais: formData.pais, provincia: formData.provincia, ciudad: formData.ciudad, cp: formData.cp,
        calle: formData.calle, numero: formData.numero, piso: formData.piso, depto: formData.depto
      };

      if (esStaff) {
        // --- LOGICA ADMIN / PRENSA ---
        const resUsuario = await fetch(`http://localhost:3000/usuario/${usuarioId}`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify(datosUsuario)
        });

        if (resUsuario.ok) {
          setDatosPerfil((prev: any) => ({
            ...prev,
            usuario: { ...prev.usuario, ...datosUsuario }
          }));
          setIsEditing(false);
        } else {
          // ACÁ ATRAPAMOS EL ERROR 400 DE NESTJS
          const errorUsr = await resUsuario.json();
          if (errorUsr.errores) {
            setErrores(errorUsr.errores);
            setErrorGlobal('Por favor, revisá los campos marcados en rojo.');
          } else {
            setErrorGlobal(errorUsr.message || 'Error al actualizar el perfil.');
          }
        }

      } else {
        // --- LOGICA FAN ---
        const datosPerfilFan = {
          alias: formData.alias, 
          bio: formData.bio, 
          hincha_marca_tc: formData.hincha_marca_tc, 
          chicana_favorita: formData.chicana_favorita,
          avatar: nuevaUrlAvatar 
        };

        const [resUsuario, resPerfil] = await Promise.all([
          fetch(`http://localhost:3000/usuario/${usuarioId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(datosUsuario)
          }),
          fetch(`http://localhost:3000/perfil-fan/${perfilFanId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(datosPerfilFan)
          })
        ]);

        if (resUsuario.ok && resPerfil.ok) {
          setDatosPerfil((prev: any) => ({
            ...prev,
            usuario: { ...prev.usuario, ...datosUsuario },
            perfil_fan: { ...prev.perfil_fan, ...datosPerfilFan }
          }));
          setIsEditing(false);
        } else {
           // ACÁ ATRAPAMOS LOS ERRORES SI FALLA EL FAN (Puede fallar Usuario o PerfilFan)
           let erroresCombinados = {};
           
           if (!resUsuario.ok) {
              const errUsr = await resUsuario.json();
              if (errUsr.errores) erroresCombinados = { ...erroresCombinados, ...errUsr.errores };
           }
           if (!resPerfil.ok) {
              const errPerf = await resPerfil.json();
              if (errPerf.errores) erroresCombinados = { ...erroresCombinados, ...errPerf.errores };
           }

           if (Object.keys(erroresCombinados).length > 0) {
              setErrores(erroresCombinados);
              setErrorGlobal('Por favor, revisá los campos marcados en rojo.');
           } else {
              setErrorGlobal('Hubo un problema al guardar tus datos.');
           }
        }
      }

    } catch (error) {
      // El catch solo atrapa si el servidor está apagado o no hay internet
      console.error("Error de red:", error);
      setErrorGlobal("Error de conexión. Intentá nuevamente más tarde.");
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
              {datosPerfil?.rol === 'fan' ? 'Fan del Óvalo' : ''}
              {datosPerfil?.rol !== 'fan' ? 'Staff del Ovalo' : ''}
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
                <button onClick={() => setIsEditing(false)} disabled={guardando} className="p-2 text-slate-500 hover:text-red-500 transition-colors disabled:opacity-50">
                  <X size={24} />
                </button>
                <button onClick={guardarCambios} disabled={guardando} className="flex items-center gap-2 bg-institucional-celeste text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-70">
                  <Save size={18} /> {guardando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-red-500 font-bold text-center">{errorGlobal}</p>
        {/* Formulario de Datos */}
        <div className="gap-6 relative z-10">
          {/* --- SECCIÓN 1: DATOS PERSONALES --- */}
          <div className="p-3 border-t border-slate-200 dark:border-white/10">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white mb-4">
              <UserIcon size={20} className="text-institucional-celeste"/> Datos Personales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField label="DNI (No editable)" value={datosPerfil?.usuario?.dni || ''} disabled={true} />
              <FormField label="Nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} disabled={!isEditing} error={errores.nombre} />
              <FormField label="Apellido" name="apellido" value={formData.apellido} onChange={handleInputChange} disabled={!isEditing} error={errores.apellido} />
              <FormField type="date" label= "Fecha de Nacimiento" name="fecha_nacimiento" value={formData.fecha_nacimiento}  onChange={handleInputChange} disabled={!isEditing} />
              <FormField label="Género" name="genero" value={formData.genero} onChange={handleInputChange} disabled={!isEditing} options={[
                  { value: 'M', label: 'Masculino' },
                  { value: 'F', label: 'Femenino' },
                  { value: 'X', label: 'Otro' }
                ]} />
              <FormField label="Teléfono" name="telefono" value={formData.telefono} onChange={handleInputChange} disabled={!isEditing} error={errores.telefono} />
            </div>
          </div>

          {/* --- SECCIÓN 2: DOMICILIO --- */}
          <div className="p-3 border-t border-slate-200 dark:border-white/10">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white mb-4">
              <MapPin size={20} className="text-institucional-celeste"/> Domicilio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <FormField label="Nacionalidad" name="nacionalidad" value={formData.nacionalidad} onChange={handleInputChange} disabled={!isEditing} error={errores.nacionalidad} />
              {/* --- RENDERIZADO DE PAÍS --- */}
              {isEditing ? (
                <div className="md:col-span-1">
                  <label className="label-fan block mb-1 text-sm font-semibold">País</label>
                  <select
                    name="pais"
                    value={formData.pais} 
                    onChange={(e) => {
                      handleInputChange(e);
                      setFormData((prev) => ({ ...prev, provincia: '', ciudad: '' }));
                    }}
                    className="input-fan w-full"
                  >
                    <option value="Argentina">Argentina</option>
                    <option disabled>──────────</option>
                    {paises.map((pais) => (
                      <option key={pais} value={pais}>{pais}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <FormField label="País" name="pais" value={formData.pais || datosPerfil?.usuario?.pais || ''} disabled={true} />
              )}

              {/* --- RENDERIZADO CONDICIONAL DE PROVINCIA Y CIUDAD --- */}
              {formData.pais === 'Argentina' ? (
                <>
                  {/* ARGENTINA: SELECT CON API */}
                  {isEditing ? (
                    <>
                      <div className="md:col-span-1">
                        <label className="label-fan block mb-1 text-sm font-semibold">Provincia</label>
                        <select name="provincia" required value={formData.provincia} onChange={(e) => { handleInputChange(e); setFormData(prev => ({ ...prev, ciudad: '' })); }} className="input-fan w-full">
                          <option value="">Seleccioná...</option>
                          {provincias.map(prov => (
                            <option key={prov.id} value={prov.nombre}>{prov.nombre}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-1">
                        <label className="label-fan block mb-1 text-sm font-semibold">Ciudad / Localidad</label>
                        <select name="ciudad" required value={formData.ciudad} onChange={handleInputChange} className="input-fan w-full disabled:opacity-50 disabled:cursor-not-allowed" disabled={!formData.provincia || ciudades.length === 0}>
                          <option value="">{formData.provincia ? 'Seleccioná tu ciudad...' : 'Primero elegí una provincia'}</option>
                          {ciudades.map(ciudad => (
                            <option key={ciudad.id} value={ciudad.nombre}>{ciudad.nombre}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <FormField label="Provincia" name="provincia" value={formData.provincia} disabled={true} />
                      <FormField label="Ciudad" name="ciudad" value={formData.ciudad} disabled={true} />
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* RESTO DEL MUNDO: INPUTS LIBRES */}
                  {isEditing ? (
                    <>
                      <div className="md:col-span-1">
                        <label className="label-fan block mb-1 text-sm font-semibold">Estado / Provincia</label>
                        <input type="text" name="provincia" required placeholder="Ej: Indiana" value={formData.provincia} onChange={handleInputChange} className="input-fan w-full" pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+" title="Solo letras" />
                      </div>
                      <div className="md:col-span-1">
                        <label className="label-fan block mb-1 text-sm font-semibold">Ciudad / Localidad</label>
                        <input type="text" name="ciudad" required placeholder="Ej: Indianapolis" value={formData.ciudad} onChange={handleInputChange} className="input-fan w-full" pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+" title="Solo letras" />
                      </div>
                    </>
                  ) : (
                    <>
                      <FormField label="Estado / Provincia" name="provincia" value={formData.provincia} disabled={true} error={errores.provincia} />
                      <FormField label="Ciudad" name="ciudad" value={formData.ciudad} disabled={true} error={errores.ciudad} />
                    </>
                  )}
                </>
              )}
              <FormField label="Código Postal" name="cp" value={formData.cp} onChange={handleInputChange} disabled={!isEditing} error={errores.cp} />
              <div className="md:col-span-2">
                <FormField label="Calle" name="calle" value={formData.calle} onChange={handleInputChange} disabled={!isEditing} error={errores.calle} />
              </div>
              <FormField label="Número" name="numero" value={formData.numero} onChange={handleInputChange} disabled={!isEditing} error={errores.numero} />
              <div className="grid grid-cols-2 gap-2">
                <FormField label="Piso" name="piso" value={formData.piso} onChange={handleInputChange} disabled={!isEditing} error={errores.piso} />
                <FormField label="Depto" name="depto" value={formData.depto} onChange={handleInputChange} disabled={!isEditing} error={errores.depto} />
              </div>
            </div>
          </div>
        
          {/* --- SECCIÓN 3: PERFIL FAN / STAFF--- */}
          {datosPerfil?.rol !== 'fan' && (

            <div className="p-3 border-t border-slate-200 dark:border-white/10">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white mb-4">
                <Flag size={20} className="text-institucional-celeste"/> Perfil Staff / Prensa / Admin
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField label="Rol staff (No editable)" value={datosPerfil?.rol || ''} disabled={true} />
              </div>
            </div>  
          )}

          {datosPerfil?.rol === 'fan' && (
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
          )}

          {/* Botón 2 Editar/Guardar */}
          <div className="sm:ml-auto justify-end flex mt-6">
            {!isEditing ? (
              <button disabled={true} className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white px-4 py-2 rounded-xl transition-colors">
                <Check size={18} /> Perfil actualizado
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(false)} disabled={guardando} className="p-2 text-slate-500 hover:text-red-500 transition-colors disabled:opacity-50">
                  <X size={24} />
                </button>
                <button onClick={guardarCambios} disabled={guardando} className="flex items-center gap-2 bg-institucional-celeste text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-70">
                  <Save size={18} /> {guardando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiPerfilPage;

      
   