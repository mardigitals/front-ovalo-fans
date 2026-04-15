import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // ESTADO PASO 1: Auth
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authId, setAuthId] = useState<number | null>(null);

    // ESTADO PASO 2: Usuario y Perfil Fan
    const [formData, setFormData] = useState({
        nombre: '', apellido: '', dni: '', fecha_nacimiento: '', genero: 'M',
        telefono: '', calle: '', numero: '', piso: '', depto: '',
        cp: '', ciudad: '', provincia: '', pais: 'Argentina',
        alias: '', es_socio_club: false, hincha_marca_tc: 'Ford', chicana_favorita: '1 de adentro'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
        }));
    };

    // --- SUBMIT PASO 1 ---
    const handleRegisterFree = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
        // 1. Crear el usuario base (Registro)
        const registerResponse = await api.post('/usuario-auth/register', { 
            email, 
            contrasena: password 
        });
        
        // Guardamos el ID que devolvió tu 'create' del backend
        setAuthId(registerResponse.data.id); 

        // 2.  Hacemos Auto-Login al instante para obtener el Token
        const loginResponse = await api.post('/usuario-auth/login', { 
            email, 
            contrasena: password 
        });

        // 3. Ahora SÍ tenemos el token real
        const token = loginResponse.data.access_token;
        
        // 4. Guardamos el Token y configuramos Axios para el Paso 2
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // 5. Pasamos al formulario de Fan
        setStep(2); 
        
        } catch (err: any) {
        const msg = err.response?.data?.message || 'Error al crear la cuenta';
        setError(Array.isArray(msg) ? msg[0] : msg);
        } finally {
        setIsLoading(false);
        }
    };

    // --- SUBMIT PASO 2 ---
    const handleRegisterFan = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
        const usuarioPayload = {
            usuario_auth_id: authId,
            nombre: formData.nombre,
            apellido: formData.apellido,
            dni: formData.dni,
            fecha_nacimiento: formData.fecha_nacimiento,
            genero: formData.genero,
            telefono: formData.telefono,
            calle: formData.calle,
            numero: formData.numero,
            piso: formData.piso || undefined,
            depto: formData.depto || undefined,
            cp: formData.cp,
            ciudad: formData.ciudad,
            provincia: formData.provincia,
            pais: formData.pais
        };

        const perfilFanPayload = {
            alias: formData.alias,
            es_socio_club: formData.es_socio_club,
            hincha_marca_tc: formData.hincha_marca_tc,
            chicana_favorita: formData.chicana_favorita,
        };

        // 1. PRIMERO creamos el Usuario base
        await api.post('/usuario', usuarioPayload);

        // 2. EL TRUCO: Volvemos a hacer Auto-Login silencioso
        // Al loguearnos AHORA, el backend detecta que ya existe el Usuario
        // y nos devuelve un nuevo token que SÍ tiene el 'userId' cargado.
        const loginResponse = await api.post('/usuario-auth/login', { 
            email, 
            contrasena: password 
        });
        
        const newToken = loginResponse.data.access_token;
        
        // Actualizamos las llaves maestras
        localStorage.setItem('token', newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        // 3. AHORA SÍ creamos el Perfil Fan con el token fresco y completo
        await api.post('/perfil-fan', perfilFanPayload, {
            headers: { Authorization: `Bearer ${newToken}` } // Lo forzamos por las dudas
        });

        // ¡Éxito total! Rumbo al dashboard
        navigate('/dashboard');

        } catch (err: any) {
        const msg = err.response?.data?.message || 'Error al guardar tu perfil de Fan';
        setError(Array.isArray(msg) ? msg[0] : msg);
        } finally {
        setIsLoading(false);
        }
    };

    return (
    <div className="min-h-screen bg-[#08060d] text-white flex flex-col items-center justify-center p-4 py-12">
      <div className={`w-full ${step === 1 ? 'max-w-md' : 'max-w-4xl'} p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-500`}>
        
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded text-center">
            {error}
          </div>
        )}

        {/* --- UI PASO 1 --- */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-300">
            <div>
              <h2 className="text-center text-4xl font-extrabold text-sky-500 tracking-tight">Crear Cuenta</h2>
              <p className="mt-2 text-center text-sm text-slate-400">Paso 1: Datos de acceso</p>
            </div>
            
            <form onSubmit={handleRegisterFree} className="space-y-6">
              <div className="space-y-3">
                <input type="email" required placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} 
                  className="w-full px-4 py-3 border border-white/10 bg-white/[0.03] rounded-md focus:ring-2 focus:ring-sky-500 outline-none transition-all" />
                <input type="password" required placeholder="Contraseña (Mín. 8, Mayúscula y Especial)" value={password} onChange={(e) => setPassword(e.target.value)} 
                  className="w-full px-4 py-3 border border-white/10 bg-white/[0.03] rounded-md focus:ring-2 focus:ring-sky-500 outline-none transition-all" />
              </div>
              <button type="submit" disabled={isLoading} 
                className="w-full py-3 px-4 font-bold rounded-md text-black bg-slate-300 hover:bg-white transition-all uppercase">
                {isLoading ? 'Registrando...' : 'Siguiente'}
              </button>
            </form>
            
            <p className="text-center text-slate-500 text-sm">
              ¿Ya tienes cuenta? <Link to="/login" className="text-sky-500 hover:text-sky-400 font-bold">Inicia Sesión</Link>
            </p>
          </div>
        )}

        {/* --- UI PASO 2 --- */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-200 tracking-tighter uppercase">
                ¿Quieres convertirte en un verdadero Óvalo Fan?
              </h2>
              <p className="text-slate-400">Completa tu perfil para acceder a beneficios exclusivos.</p>
            </div>

            <form onSubmit={handleRegisterFan} className="space-y-8">
              {/* Sección Datos Personales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                <h3 className="md:col-span-2 text-xl font-bold border-b border-white/10 pb-2 text-sky-500">Datos Personales</h3>
                
                <div>
                  <label htmlFor="nombre" className="label-fan">Nombre</label>
                  <input type="text" id="nombre" name="nombre" required placeholder="Ej: Francisco" value={formData.nombre} onChange={handleInputChange} className="input-fan" />
                </div>
                
                <div>
                  <label htmlFor="apellido" className="label-fan">Apellido</label>
                  <input type="text" id="apellido" name="apellido" required placeholder="Ej: Paravano" value={formData.apellido} onChange={handleInputChange} className="input-fan" />
                </div>
                
                <div>
                  <label htmlFor="dni" className="label-fan">DNI</label>
                  <input type="text" id="dni" name="dni" required placeholder="Sin puntos" value={formData.dni} onChange={handleInputChange} className="input-fan" />
                </div>
                
                <div>
                  <label htmlFor="fecha_nacimiento" className="label-fan">Fecha de Nacimiento</label>
                  <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" required value={formData.fecha_nacimiento} onChange={handleInputChange} className="input-fan text-slate-400 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
                </div>
                
                <div>
                  <label htmlFor="genero" className="label-fan">Género</label>
                  <select id="genero" name="genero" value={formData.genero} onChange={handleInputChange} className="input-fan text-slate-300">
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="telefono" className="label-fan">Teléfono</label>
                  <input type="tel" id="telefono" name="telefono" required placeholder="Ej: 3492-15..." value={formData.telefono} onChange={handleInputChange} className="input-fan" />
                </div>
              </div>

              {/* Sección Domicilio */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
                <h3 className="md:col-span-3 text-xl font-bold border-b border-white/10 pb-2 text-sky-500 mt-4">Domicilio</h3>
                
                <div className="md:col-span-2">
                  <label htmlFor="calle" className="label-fan">Calle</label>
                  <input type="text" id="calle" name="calle" required placeholder="Ej: Bv. Lehmann" value={formData.calle} onChange={handleInputChange} className="input-fan" />
                </div>
                
                <div>
                  <label htmlFor="numero" className="label-fan">Número</label>
                  <input type="text" id="numero" name="numero" required placeholder="Ej: 1234" value={formData.numero} onChange={handleInputChange} className="input-fan" />
                </div>
                
                <div>
                  <label htmlFor="piso" className="label-fan">Piso</label>
                  <input type="text" id="piso" name="piso" placeholder="Opcional" value={formData.piso} onChange={handleInputChange} className="input-fan" />
                </div>
                
                <div>
                  <label htmlFor="depto" className="label-fan">Depto</label>
                  <input type="text" id="depto" name="depto" placeholder="Opcional" value={formData.depto} onChange={handleInputChange} className="input-fan" />
                </div>
                
                <div>
                  <label htmlFor="cp" className="label-fan">Código Postal</label>
                  <input type="text" id="cp" name="cp" required placeholder="Ej: 2300" value={formData.cp} onChange={handleInputChange} className="input-fan" />
                </div>
                
                <div className="md:col-span-1">
                  <label htmlFor="ciudad" className="label-fan">Ciudad</label>
                  <input type="text" id="ciudad" name="ciudad" required placeholder="Ej: Rafaela" value={formData.ciudad} onChange={handleInputChange} className="input-fan" />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="provincia" className="label-fan">Provincia</label>
                  <input type="text" id="provincia" name="provincia" required placeholder="Ej: Santa Fe" value={formData.provincia} onChange={handleInputChange} className="input-fan" />
                </div>
              </div>

              {/* Sección Perfil Fan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 bg-white/[0.02] p-6 rounded-xl border border-white/5">
                <h3 className="md:col-span-2 text-xl font-bold text-sky-500 flex items-center gap-2">
                  🏁 Tu ADN Tuerca
                </h3>
                
                <div>
                  <label htmlFor="alias" className="label-fan">Alias / Apodo</label>
                  <input type="text" id="alias" name="alias" required placeholder="Ej: ElRayo" value={formData.alias} onChange={handleInputChange} maxLength={20} className="input-fan" />
                </div>
                
                <div className="flex items-center space-x-3 bg-black/50 px-4 mt-6 rounded-md border border-white/10 h-[50px]">
                  <input type="checkbox" id="es_socio" name="es_socio_club" checked={formData.es_socio_club} onChange={handleInputChange} className="w-5 h-5 accent-sky-500" />
                  <label htmlFor="es_socio" className="text-sm font-medium cursor-pointer text-slate-300">Soy socio del club</label>
                </div>

                <div>
                  <label htmlFor="hincha_marca_tc" className="label-fan">Marca TC</label>
                  <select id="hincha_marca_tc" name="hincha_marca_tc" value={formData.hincha_marca_tc} onChange={handleInputChange} className="input-fan text-slate-300">
                    {['Ford', 'Chevrolet', 'Torino', 'Dodge', 'Toyota', 'Mercedes', 'Bmw'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="chicana_favorita" className="label-fan">Chicana Favorita</label>
                  <select id="chicana_favorita" name="chicana_favorita" value={formData.chicana_favorita} onChange={handleInputChange} className="input-fan text-slate-300">
                    {['1 de adentro', '1 de afuera', '2 de adentro', '2 de afuera', '3'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" disabled={isLoading} 
                className="w-full py-4 px-6 font-black rounded-lg text-black bg-sky-500 hover:bg-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] transition-all uppercase tracking-widest text-lg mt-8">
                {isLoading ? 'Acelerando...' : 'Completar Perfil Fan'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Clases de utilidad en línea para mantener el código limpio */}
      <style>{`
        .input-fan {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background-color: rgba(255, 255, 255, 0.03);
          border-radius: 0.375rem;
          outline: none;
          transition: all 0.2s;
        }
        .input-fan:focus {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2);
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;