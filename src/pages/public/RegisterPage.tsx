import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import GenericPay from '@/components/ui/GenericPay';

const RegisterPage = () => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const navigate = useNavigate();

    // Estado único unificado que incluye Auth, Usuario y Perfil Fan
    const [formData, setFormData] = useState({
        email: '',
        contrasena: '',
        confirmPassword: '',
        nombre: '', 
        apellido: '', 
        dni: '', 
        fecha_nacimiento: '', 
        genero: 'M',
        nacionalidad: 'Argentina', 
        telefono: '', 
        calle: '', 
        numero: '', 
        piso: '', 
        depto: '',
        cp: '', 
        ciudad: '', 
        provincia: '', 
        pais: 'Argentina',
        alias: '', 
        es_socio_club: false, 
        hincha_marca_tc: 'Ford', 
        chicana_favorita: '1 de adentro'
    });

    const [membresias, setMembresias] = useState<any[]>([]);
    const [provincias, setProvincias] = useState<any[]>([]);
    const [ciudades, setCiudades] = useState<any[]>([]);
    const [paises] = useState<string[]>([
        'Alemania', 'Bolivia', 'Brasil', 'Canadá', 'Chile', 'Colombia', 
        'Costa Rica', 'Ecuador', 'El Salvador', 'España', 'Estados Unidos', 
        'Francia', 'Guatemala', 'Honduras', 'Italia', 'México', 'Nicaragua', 
        'Panamá', 'Paraguay', 'Perú', 'Reino Unido', 'Uruguay', 'Venezuela', 'Otro'
    ]);

    // Cargar membresías para el Paso 3
    useEffect(() => {
        const cargarMembresias = async () => {
            try {
                const response = await api.get('/membresia');
                setMembresias(response.data);
            } catch (error) {
                console.error("Error al cargar planes:", error);
            }
        };
        cargarMembresias();
    }, []);

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
    }, [formData.provincia, formData.pais]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Limpiar error individual al escribir
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Paso 1: Validación local de contraseñas y avance visual
    const handleNextStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.contrasena !== formData.confirmPassword) {
            setFieldErrors({ confirmPassword: 'Las contraseñas no coinciden. Verificalas antes de acelerar.' });
            return;
        }
        setFieldErrors({});
        setStep(2);
    };

    // Paso 2: Envío unificado atómico al backend (/usuario-auth/register-full)
    const handleCompleteRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setFieldErrors({});

        try {
            // 1. Registro atómico completo (Crea Auth, Usuario y Perfil Fan de una vez)
            await api.post('/usuario-auth/register-full', formData);

            // 2. Autenticarnos automáticamente para obtener el token JWT
            const loginResponse = await api.post('/usuario-auth/login', { 
                email: formData.email, 
                contrasena: formData.contrasena 
            });
            const token = loginResponse.data.access_token;
            
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // 3. Verificamos si el usuario quedó bonificado como socio de Atlético de Rafaela
            // Consultamos el perfil actual o evaluamos la respuesta si el backend lo devuelve
            const perfilRes = await api.get('/perfil-fan/me').catch(() => null);

            if (perfilRes?.data?.bonificado_socio_ar) {
                alert('¡Socio de Atlético de Rafaela verificado! Tenés tu membresía P3 FAN bonificada al 100%. ¡Bienvenido a pista!');
                navigate('/dashboard/resumen');
                return;
            }

            if (perfilRes?.data?.aviso_socio) {
                setError(perfilRes.data.aviso_socio);
            }

            // 4. Si no está bonificado, pasamos directo al Paso 3 (Pagos)
            setStep(3);

        } catch (err: any) {
            console.error("Error en registro completo:", err);
            
            // Si el backend devuelve errores de validación de los DTOs por campo
            if (err.response?.data?.errores) {
                setFieldErrors(err.response.data.errores);
                // Si el error viene de credenciales del paso 1, podemos devolverlo al paso 1
                if (err.response.data.errores.email || err.response.data.errores.contrasena) {
                    setStep(1);
                }
            } else {
                const msg = err.response?.data?.message || 'Error al procesar el registro completo';
                setError(Array.isArray(msg) ? msg[0] : msg);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Paso 3: Proceso de pago con Mercado Pago
    const handlePayment = async (membresiaId: number) => {
        setIsLoading(true);
        setError('');

        try {
            const suscripcionResponse = await api.post('/suscripcion', {
                membresia_id: membresiaId 
            });

            const suscripcionId = suscripcionResponse.data.id; 

            const pagoResponse = await api.post('/pagos/generar-link', {
                suscripcion_id: suscripcionId
            });

            if (pagoResponse.data.url_sandbox) {
                window.location.href = pagoResponse.data.url_sandbox; 
            } else {
                setError("No se pudo generar el enlace de pago. Contactá a soporte.");
            }

        } catch (err: any) {
            console.error("Error en el proceso de pago:", err);
            const msg = err.response?.data?.message || 'Error al procesar la suscripción.';
            setError(Array.isArray(msg) ? msg[0] : msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12">
            <div className={`w-full ${step === 1 ? 'max-w-md' : 'max-w-4xl'} p-8 bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl dark:shadow-sky-500/20 transition-all duration-500`}>
                
                {error && step !== 3 && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded text-center font-bold">
                        {error}
                    </div>
                )}

                {/* --- UI PASO 1 --- */}
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                        <div>
                            <h2 className="title-fan text-center text-4xl">Crear Cuenta</h2>
                            <p className="mt-2 text-center text-fan text-sm">Paso 1: Datos de acceso</p>
                        </div>
                        
                        <form onSubmit={handleNextStep1} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="label-fan">Correo electrónico</label>
                                    <input type="email" required placeholder="tu@correo.com" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="input-fan" />
                                    {fieldErrors.email && <span className="text-red-500 text-xs mt-1 block font-medium">{fieldErrors.email}</span>}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label-fan">Contraseña</label>
                                        <input type="password" required placeholder="Mín. 8, Mayúscula y Especial" value={formData.contrasena} onChange={(e) => setFormData(prev => ({ ...prev, contrasena: e.target.value }))} className="input-fan" 
                                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$" title="Debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial" />
                                        {fieldErrors.contrasena && <span className="text-red-500 text-xs mt-1 block font-medium">{fieldErrors.contrasena}</span>}
                                    </div>
                                    <div>
                                        <label className="label-fan">Repetir Contraseña</label>
                                        <input type="password" required placeholder="Repetir contraseña" value={formData.confirmPassword} onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))} className="input-fan" />
                                        {fieldErrors.confirmPassword && <span className="text-red-500 text-xs mt-1 block font-medium">{fieldErrors.confirmPassword}</span>}
                                    </div>
                                </div>
                            </div>
                            
                            <button type="submit" disabled={isLoading} 
                                className="w-full py-3 px-4 font-black rounded-lg text-slate-900 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 transition-all uppercase tracking-widest mt-2">
                                Siguiente
                            </button>
                        </form>
                        
                        <div className="bg-institucional-celeste/5 border-l-4 border-institucional-celeste p-4 mt-6">
                            <p className="text-sm italic text-fan">
                            * Al registrarte, aceptas nuestros <Link to="/terms-conditions" target="_blank" rel="noopener noreferrer"><strong>Términos y Condiciones</strong></Link> y nuestras <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer"><strong>Políticas de Privacidad</strong></Link>.
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

                        <form onSubmit={handleCompleteRegistration} className="space-y-8">
                            
                            {/* Sección Datos Personales */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                                <h3 className="subtitle-fan md:col-span-2 border-b border-slate-200 dark:border-white/10 pb-2">Datos Personales</h3>
                                
                                <div>
                                    <label className="label-fan">Nombre</label>
                                    <input type="text" name="nombre" required placeholder="Franco" value={formData.nombre} onChange={handleInputChange} className="input-fan" />
                                    {fieldErrors.nombre && <span className="text-red-500 text-xs mt-1 block font-medium">{fieldErrors.nombre}</span>}
                                </div>
                                
                                <div>
                                    <label className="label-fan">Apellido</label>
                                    <input type="text" name="apellido" required placeholder="Colapinto" value={formData.apellido} onChange={handleInputChange} className="input-fan" />
                                    {fieldErrors.apellido && <span className="text-red-500 text-xs mt-1 block font-medium">{fieldErrors.apellido}</span>}
                                </div>
                                
                                <div>
                                    <label className="label-fan">DNI</label>
                                    <input type="text" name="dni" required placeholder="Sin puntos" value={formData.dni} onChange={handleInputChange} className="input-fan" />
                                    {fieldErrors.dni && <span className="text-red-500 text-xs mt-1 block font-medium">{fieldErrors.dni}</span>}
                                </div>
                                
                                <div>
                                    <label className="label-fan">Fecha de Nacimiento</label>
                                    <input type="date" name="fecha_nacimiento" required value={formData.fecha_nacimiento} onChange={handleInputChange} className="input-fan [&::-webkit-calendar-picker-indicator]:dark:filter [&::-webkit-calendar-picker-indicator]:dark:invert" />
                                    {fieldErrors.fecha_nacimiento && <span className="text-red-500 text-xs mt-1 block font-medium">{fieldErrors.fecha_nacimiento}</span>}
                                </div>
                                
                                <div>
                                    <label className="label-fan">Género</label>
                                    <select name="genero" value={formData.genero} onChange={handleInputChange} className="input-fan">
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                        <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                                    </select>
                                </div>

                                <div className="md:col-span-3">
                                    <label className="label-fan">Nacionalidad</label>
                                    <select name="nacionalidad" required value={formData.nacionalidad} onChange={handleInputChange} className="input-fan">
                                        <option value="Argentina">Argentina</option>
                                        <option disabled>──────────</option>
                                        {paises.map(pais => (
                                            <option key={pais} value={pais}>{pais}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="label-fan">Teléfono</label>
                                    <input type="tel" name="telefono" required placeholder="349215334455" value={formData.telefono} onChange={handleInputChange} className="input-fan" />
                                    {fieldErrors.telefono && <span className="text-red-500 text-xs mt-1 block font-medium">{fieldErrors.telefono}</span>}
                                </div>
                            </div>

                            {/* Sección Domicilio */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
                                <h3 className="subtitle-fan md:col-span-3 border-b border-slate-200 dark:border-white/10 pb-2 mt-4">Domicilio</h3>
                                
                                <div className="md:col-span-2">
                                    <label className="label-fan">Calle</label>
                                    <input type="text" name="calle" required placeholder="Bv. Lehmann" value={formData.calle} onChange={handleInputChange} className="input-fan" />
                                    {fieldErrors.calle && <span className="text-red-500 text-xs mt-1 block font-medium">{fieldErrors.calle}</span>}
                                </div>
                                
                                <div>
                                    <label className="label-fan">Número</label>
                                    <input type="text" name="numero" required placeholder="1234" value={formData.numero} onChange={handleInputChange} className="input-fan" />
                                    {fieldErrors.numero && <span className="text-red-500 text-xs mt-1 block font-medium">{fieldErrors.numero}</span>}
                                </div>
                                
                                <div>
                                    <label className="label-fan">Piso</label>
                                    <input type="text" name="piso" placeholder="Opcional" value={formData.piso} onChange={handleInputChange} className="input-fan" />
                                </div>
                                
                                <div>
                                    <label className="label-fan">Depto</label>
                                    <input type="text" name="depto" placeholder="Opcional" value={formData.depto} onChange={handleInputChange} className="input-fan" />
                                </div>
                                
                                <div>
                                    <label className="label-fan">Código Postal</label>
                                    <input type="text" name="cp" required placeholder="2300" value={formData.cp} onChange={handleInputChange} className="input-fan" />
                                    {fieldErrors.cp && <span className="text-red-500 text-xs mt-1 block font-medium">{fieldErrors.cp}</span>}
                                </div>

                                <div className="md:col-span-3">
                                    <label className="label-fan">País</label>
                                    <select 
                                        name="pais" 
                                        required 
                                        value={formData.pais} 
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setFormData(prev => ({ ...prev, provincia: '', ciudad: '' }));
                                        }} 
                                        className="input-fan"
                                    >
                                        <option value="Argentina">Argentina</option>
                                        <option disabled>──────────</option>
                                        {paises.map(pais => (
                                            <option key={pais} value={pais}>{pais}</option>
                                        ))}
                                    </select>
                                </div>

                                {formData.pais === 'Argentina' ? (
                                    <>
                                        <div className="md:col-span-1">
                                            <label className="label-fan">Provincia</label>
                                            <select name="provincia" required value={formData.provincia} onChange={(e) => { handleInputChange(e); setFormData(prev => ({ ...prev, ciudad: '' })); }} className="input-fan">
                                                <option value="">Seleccioná...</option>
                                                {provincias.map(prov => (
                                                    <option key={prov.id} value={prov.nombre}>{prov.nombre}</option>
                                                ))}
                                            </select>
                                            {fieldErrors.provincia && <span className="text-red-500 text-xs mt-1 block font-medium">{fieldErrors.provincia}</span>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="label-fan">Ciudad / Localidad</label>
                                            <select name="ciudad" required value={formData.ciudad} onChange={handleInputChange} className="input-fan disabled:opacity-50 disabled:cursor-not-allowed" disabled={!formData.provincia || ciudades.length === 0}>
                                                <option value="">{formData.provincia ? 'Seleccioná tu ciudad...' : 'Primero elegí una provincia'}</option>
                                                {ciudades.map(ciudad => (
                                                    <option key={ciudad.id} value={ciudad.nombre}>{ciudad.nombre}</option>
                                                ))}
                                            </select>
                                            {fieldErrors.ciudad && <span className="text-red-500 text-xs mt-1 block font-medium">{fieldErrors.ciudad}</span>}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="md:col-span-1">
                                            <label className="label-fan">Estado / Provincia</label>
                                            <input type="text" name="provincia" required placeholder="Indiana" value={formData.provincia} onChange={handleInputChange} className="input-fan" />
                                            {fieldErrors.provincia && <span className="text-red-500 text-xs mt-1 block font-medium">{fieldErrors.provincia}</span>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="label-fan">Ciudad / Localidad</label>
                                            <input type="text" name="ciudad" required placeholder="Indianapolis" value={formData.ciudad} onChange={handleInputChange} className="input-fan" />
                                            {fieldErrors.ciudad && <span className="text-red-500 text-xs mt-1 block font-medium">{fieldErrors.ciudad}</span>}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Sección Perfil Fan */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 bg-slate-100 dark:bg-white/[0.02] p-6 rounded-xl border border-slate-200 dark:border-white/5">
                                <h3 className="subtitle-fan md:col-span-2 flex items-center gap-2">🏁 Tu ADN Tuerca</h3>
                                
                                <div>
                                    <label className="label-fan">Alias / Apodo</label>
                                    <input type="text" name="alias" required placeholder="FanDeArdusso12" value={formData.alias} onChange={handleInputChange} maxLength={20} className="input-fan" />
                                    {fieldErrors.alias && <span className="text-red-500 text-xs mt-1 block font-medium">{fieldErrors.alias}</span>}
                                </div>
                                
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

                            <div className="flex gap-4">
                                <button type="button" onClick={() => setStep(1)} className="w-1/3 py-4 font-bold rounded-lg uppercase bg-slate-800 text-white hover:bg-slate-700">
                                    Volver
                                </button>
                                <button type="submit" disabled={isLoading} 
                                    className="w-2/3 py-4 px-6 font-black rounded-lg text-black bg-sky-500 hover:bg-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] transition-all uppercase tracking-widest text-lg">
                                    {isLoading ? 'Acelerando...' : 'Completar Perfil Fan'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* --- UI PASO 3: PAGO --- */}
                {step === 3 && (
                    <div className="space-y-6">
                        {error && (
                            <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-center font-bold text-sm flex items-center justify-center gap-2 animate-in fade-in duration-300">
                                <span>⚠️</span> {error}
                            </div>
                        )}
                        <GenericPay 
                            onSelectPlan={handlePayment} 
                            isLoading={isLoading} 
                            membresias={membresias} 
                            titulo="Membresías disponibles" 
                            subtitulo="Selecciona el plan que mejor se adapte a vos" 
                        />
                        
                        <div className="text-center pt-4">
                            <Link 
                                to="/dashboard/resumen" 
                                className="inline-block py-3 px-6 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                            >
                                ← Ir al dashboard
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default RegisterPage;