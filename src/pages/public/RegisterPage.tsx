import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/api/axios';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authId, setAuthId] = useState<number | null>(null);

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

    const handleRegisterFree = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const registerResponse = await api.post('/usuario-auth/register', { email, contrasena: password });
            setAuthId(registerResponse.data.id); 

            const loginResponse = await api.post('/usuario-auth/login', { email, contrasena: password });
            const token = loginResponse.data.access_token;
            
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setStep(2); 
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Error al crear la cuenta';
            setError(Array.isArray(msg) ? msg[0] : msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterFan = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const usuarioPayload = {
                usuario_auth_id: authId, nombre: formData.nombre, apellido: formData.apellido,
                dni: formData.dni, fecha_nacimiento: formData.fecha_nacimiento, genero: formData.genero,
                telefono: formData.telefono, calle: formData.calle, numero: formData.numero,
                piso: formData.piso || undefined, depto: formData.depto || undefined, cp: formData.cp,
                ciudad: formData.ciudad, provincia: formData.provincia, pais: formData.pais
            };

            const perfilFanPayload = {
                alias: formData.alias, es_socio_club: formData.es_socio_club,
                hincha_marca_tc: formData.hincha_marca_tc, chicana_favorita: formData.chicana_favorita,
            };

            await api.post('/usuario', usuarioPayload);
            const loginResponse = await api.post('/usuario-auth/login', { email, contrasena: password });
            const newToken = loginResponse.data.access_token;
            
            localStorage.setItem('token', newToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            await api.post('/perfil-fan', perfilFanPayload, {
                headers: { Authorization: `Bearer ${newToken}` } 
            });

            navigate('/dashboard');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Error al guardar tu perfil de Fan';
            setError(Array.isArray(msg) ? msg[0] : msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Quitamos colores fijos del fondo principal
        <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12">
            
            {/* Tarjeta con soporte Claro/Oscuro */}
            <div className={`w-full ${step === 1 ? 'max-w-md' : 'max-w-4xl'} p-8 bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl dark:shadow-sky-500/20 transition-all duration-500`}>
                
                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded text-center font-bold">
                        {error}
                    </div>
                )}

                {/* --- UI PASO 1 --- */}
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                        <div>
                            {/* Usamos title-fan y text-fan */}
                            <h2 className="title-fan text-center text-4xl">Crear Cuenta</h2>
                            <p className="mt-2 text-center text-fan text-sm">Paso 1: Datos de acceso</p>
                        </div>
                        
                        <form onSubmit={handleRegisterFree} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="label-fan">Correo electrónico</label>
                                    <input type="email" required placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input-fan" />
                                </div>
                                <div>
                                    <label className="label-fan">Contraseña</label>
                                    <input type="password" required placeholder="Mín. 8, Mayúscula y Especial" value={password} onChange={(e) => setPassword(e.target.value)} className="input-fan" />
                                </div>
                            </div>
                            <button type="submit" disabled={isLoading} 
                                className="w-full py-3 px-4 font-black rounded-lg text-slate-900 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 transition-all uppercase tracking-widest">
                                {isLoading ? 'Registrando...' : 'Siguiente'}
                            </button>
                        </form>
                        <div className="bg-institucional-celeste/5 border-l-4 border-institucional-celeste p-4 mt-6">
                            <p className="text-sm italic text-fan">
                            * Al registrarte, aceptas nuestros <Link to="/terms-conditions" ><strong>Términos y Condiciones</strong></Link> y nuestras <Link to="/privacy-policy" ><strong>Políticas de Privacidad</strong></Link>.
                            </p>
                        </div>
                        <p className="text-center text-slate-500 text-sm">
                            ¿Ya tienes cuenta? <Link to="/login" className="text-sky-500 hover:text-sky-400 font-black tracking-wide ml-1">INICIA SESIÓN</Link>
                        </p>
                    </div>
                )}

                {/* --- UI PASO 2 --- */}
                {step === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="text-center space-y-2">
                            <h2 className="title-fan text-center text-3xl md:text-5xl">
                                ¿Quieres convertirte en un Fan?
                            </h2>
                            <p className="text-fan">Completa tu perfil para acceder a beneficios exclusivos.</p>
                        </div>

                        <form onSubmit={handleRegisterFan} className="space-y-8">
                            
                            {/* Sección Datos Personales */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                                <h3 className="subtitle-fan md:col-span-2 border-b border-slate-200 dark:border-white/10 pb-2">Datos Personales</h3>
                                
                                <div><label className="label-fan">Nombre</label><input type="text" name="nombre" required placeholder="Ej: Francisco" value={formData.nombre} onChange={handleInputChange} className="input-fan" /></div>
                                <div><label className="label-fan">Apellido</label><input type="text" name="apellido" required placeholder="Ej: Paravano" value={formData.apellido} onChange={handleInputChange} className="input-fan" /></div>
                                <div><label className="label-fan">DNI</label><input type="text" name="dni" required placeholder="Sin puntos" value={formData.dni} onChange={handleInputChange} className="input-fan" /></div>
                                <div><label className="label-fan">Fecha de Nacimiento</label><input type="date" name="fecha_nacimiento" required value={formData.fecha_nacimiento} onChange={handleInputChange} className="input-fan [&::-webkit-calendar-picker-indicator]:dark:filter [&::-webkit-calendar-picker-indicator]:dark:invert" /></div>
                                <div>
                                    <label className="label-fan">Género</label>
                                    <select name="genero" value={formData.genero} onChange={handleInputChange} className="input-fan">
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                        <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                                    </select>
                                </div>
                                <div><label className="label-fan">Teléfono</label><input type="tel" name="telefono" required placeholder="Ej: 3492-15..." value={formData.telefono} onChange={handleInputChange} className="input-fan" /></div>
                            </div>

                            {/* Sección Domicilio */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
                                <h3 className="subtitle-fan md:col-span-3 border-b border-slate-200 dark:border-white/10 pb-2 mt-4">Domicilio</h3>
                                
                                <div className="md:col-span-2"><label className="label-fan">Calle</label><input type="text" name="calle" required placeholder="Ej: Bv. Lehmann" value={formData.calle} onChange={handleInputChange} className="input-fan" /></div>
                                <div><label className="label-fan">Número</label><input type="text" name="numero" required placeholder="Ej: 1234" value={formData.numero} onChange={handleInputChange} className="input-fan" /></div>
                                <div><label className="label-fan">Piso</label><input type="text" name="piso" placeholder="Opcional" value={formData.piso} onChange={handleInputChange} className="input-fan" /></div>
                                <div><label className="label-fan">Depto</label><input type="text" name="depto" placeholder="Opcional" value={formData.depto} onChange={handleInputChange} className="input-fan" /></div>
                                <div><label className="label-fan">Código Postal</label><input type="text" name="cp" required placeholder="Ej: 2300" value={formData.cp} onChange={handleInputChange} className="input-fan" /></div>
                                <div className="md:col-span-1"><label className="label-fan">Ciudad</label><input type="text" name="ciudad" required placeholder="Ej: Rafaela" value={formData.ciudad} onChange={handleInputChange} className="input-fan" /></div>
                                <div className="md:col-span-2"><label className="label-fan">Provincia</label><input type="text" name="provincia" required placeholder="Ej: Santa Fe" value={formData.provincia} onChange={handleInputChange} className="input-fan" /></div>
                            </div>

                            {/* Sección Perfil Fan */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 bg-slate-100 dark:bg-white/[0.02] p-6 rounded-xl border border-slate-200 dark:border-white/5">
                                <h3 className="subtitle-fan md:col-span-2 flex items-center gap-2">🏁 Tu ADN Tuerca</h3>
                                
                                <div><label className="label-fan">Alias / Apodo</label><input type="text" name="alias" required placeholder="Ej: ElRayo" value={formData.alias} onChange={handleInputChange} maxLength={20} className="input-fan" /></div>
                                
                                {/* Checkbox adaptado a Light/Dark */}
                                <div className="flex items-center space-x-3 bg-white dark:bg-black/50 px-4 mt-[18px] rounded-md border border-slate-300 dark:border-white/10 h-[50px]">
                                    <input type="checkbox" id="es_socio" name="es_socio_club" checked={formData.es_socio_club} onChange={handleInputChange} className="w-5 h-5 accent-sky-500" />
                                    <label htmlFor="es_socio" className="text-sm font-medium cursor-pointer text-slate-700 dark:text-slate-300">Soy socio del club</label>
                                </div>

                                <div>
                                    <label className="label-fan">Marca TC</label>
                                    <select name="hincha_marca_tc" value={formData.hincha_marca_tc} onChange={handleInputChange} className="input-fan">
                                        {['Ford', 'Chevrolet', 'Torino', 'Dodge', 'Toyota', 'Mercedes', 'Bmw'].map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="label-fan">Chicana Favorita</label>
                                    <select name="chicana_favorita" value={formData.chicana_favorita} onChange={handleInputChange} className="input-fan">
                                        {['1 de adentro', '1 de afuera', '2 de adentro', '2 de afuera', '3'].map(c => <option key={c} value={c}>{c}</option>)}
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
        </div>
    );
};

export default RegisterPage;