import { useState, useEffect } from 'react';
import { User, Shield, Calendar, CheckCircle, Clock, Award, Star, TrendingUp, Users, Activity } from 'lucide-react';
import api from '@/api/axios';

const ResumenPage = () => {
    const [perfil, setPerfil] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Mock states para las métricas que agregaremos (simulando carga de datos)
    const [ultimosBeneficios, setUltimosBeneficios] = useState<any[]>([]);
    const [proximosBeneficios, setProximosBeneficios] = useState<any[]>([]);

    useEffect(() => {
        const cargarResumen = async () => {
            try {
                // Traemos el perfil que ya tiene resuelto el rol y estado
                const res = await api.get('/usuario-auth/perfil');
                setPerfil(res.data);
                
                // TODO: Acá llamaremos a los endpoints de beneficios cuando estén listos
                // Por ahora dejamos mocks ilustrativos para ver el diseño del Fan
                setUltimosBeneficios([{ id: 1, nombre: 'Descuento 20% Boxes', fecha: '28/5/2026' }]);
                setProximosBeneficios([{ id: 2, nombre: 'Acceso Anticipado TC Rafaela', fecha: '14/6/2026' }]);

            } catch (err) {
                console.error("Error al cargar el resumen:", err);
                setError("No se pudo cargar el tablero principal.");
            } finally {
                setIsLoading(false);
            }
        };

        cargarResumen();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-institucional-celeste border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Calentando motores, cargando tablero...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 p-4 rounded-xl max-w-2xl mx-auto mt-10">
                <p className="font-bold">Falla en Boxes</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    // Identificamos el rol (normalizado a minúsculas)
    const esStaff = ['superadmin', 'administrativo', 'prensa'].includes(perfil?.rol?.toLowerCase());

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
            
            {/* ENCABEZADO GENÉRICO */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                        {esStaff ? <Shield className="text-red-500" /> : <User className="text-institucional-celeste" />}
                        Panel de Control
                    </h1>
                    <p className="text-slate-500">
                        {esStaff ? `Bienvenido al centro de operaciones (${perfil?.rol})` : `¡Hola de nuevo, Fanático de la velocidad!`}
                    </p>
                </div>
                <div className="text-sm text-slate-400 font-mono">
                    {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* 🏎️ VISTA 1: TABLERO PARA FANS (P1, P2, P3) */}
            {!esStaff && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Tarjeta de Perfil del Fan */}
                    <div className="bg-gradient-to-br from-[#1b1429] to-[#110c1b] border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
                        <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
                                perfil?.nivelFan === 'P1' ? 'bg-amber-500/10 border-amber-500 text-amber-400' :
                                perfil?.nivelFan === 'P2' ? 'bg-institucional-celeste/10 border-institucional-celeste text-institucional-celeste' :
                                'bg-slate-500/10 border-slate-500 text-slate-400'
                            }`}>
                                Socio {perfil?.nivelFan || 'Nivel P3'}
                            </span>
                        </div>

                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full border-2 border-institucional-celeste p-1 bg-black/40 overflow-hidden mb-4 shadow-inner">
                            {perfil?.perfil_fan?.avatar ? (
                                <img src={perfil.perfil_fan.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                                    <User size={40} />
                                </div>
                            )}
                        </div>

                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">{perfil?.nombre}</h2>
                        <p className="text-institucional-celeste font-mono text-sm mb-4">@{perfil?.perfil_fan?.alias || 'sin_apodo'}</p>
                        
                        <div className="w-full border-t border-white/5 pt-4 mt-2 space-y-3 text-left text-sm text-slate-400">
                            <div className="flex justify-between items-center">
                                <span>Estado Suscripción:</span>
                                <span className={`font-bold flex items-center gap-1 ${perfil?.estadoSuscripcion === 'Activo' ? 'text-green-400' : 'text-red-400'}`}>
                                    <CheckCircle size={14} /> {perfil?.estadoSuscripcion}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Marca de Corazón:</span>
                                <span className="font-bold text-white uppercase">{perfil?.perfil_fan?.hincha_marca_tc || 'No definido'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Métricas e Historial del Fan */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Grid de mini métricas rápidas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-[#161024] border border-slate-200 dark:border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                                <div className="p-3 bg-institucional-celeste/10 text-institucional-celeste rounded-xl">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Beneficios Usados</p>
                                    <p className="text-2xl font-black text-slate-800 dark:text-white">12 Beneficios</p>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-[#161024] border border-slate-200 dark:border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                                    <Star size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Tu Chicana Favorita</p>
                                    <p className="text-lg font-black text-slate-800 dark:text-white truncate max-w-[180px]">
                                        {perfil?.perfil_fan?.chicana_favorita || 'Curvón del Óvalo'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Listas de actividad */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Último beneficio utilizado */}
                            <div className="bg-white dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-md">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Clock size={16} className="text-institucional-celeste" /> Último Uso
                                </h3>
                                {ultimosBeneficios.map(b => (
                                    <div key={b.id} className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                                        <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">{b.nombre}</p>
                                        <p className="text-xs text-slate-400 mt-1">Usado el {b.fecha}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Próximos pedidos / Reservas */}
                            <div className="bg-white dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-md">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Calendar size={16} className="text-green-400" /> Próximas Citas
                                </h3>
                                {proximosBeneficios.map(b => (
                                    <div key={b.id} className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">{b.nombre}</p>
                                            <p className="text-xs text-slate-400 mt-1">Fecha reservada</p>
                                        </div>
                                        <span className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md font-mono text-xs font-bold">
                                            {b.fecha}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* 📊 VISTA 2: TABLERO DE ADMINISTRACIÓN (STAFF / SUPERADMIN / PRENSA) */}
            {esStaff && (
                <div className="space-y-6">
                    {/* Tarjeta Informativa de Carga */}
                    <div className="bg-gradient-to-r from-red-900/20 to-slate-900 border border-red-500/20 rounded-3xl p-6 flex items-center gap-6 shadow-xl">
                        <div className="p-4 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20">
                            <Activity size={32} className="animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Telemetría de Administración Lista</h2>
                            <p className="text-slate-400 text-sm max-w-2xl">
                                El chasis base del Staff está configurado correctamente. Estamos esperando la inyección de los módulos controladores específicos de métricas globales.
                            </p>
                        </div>
                    </div>

                    {/* Placeholder Grid que se irá llenando con las métricas reales que pases */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
                        <div className="bg-white dark:bg-[#110c1b] border border-dashed border-slate-300 dark:border-white/10 rounded-2xl p-6 text-center text-slate-500 italic text-sm">
                            <TrendingUp className="mx-auto mb-2 text-slate-400" /> Métricas Financieras (Próximamente)
                        </div>
                        <div className="bg-white dark:bg-[#110c1b] border border-dashed border-slate-300 dark:border-white/10 rounded-2xl p-6 text-center text-slate-500 italic text-sm">
                            <Users className="mx-auto mb-2 text-slate-400" /> Registro de Nuevos Socios (Próximamente)
                        </div>
                        <div className="bg-white dark:bg-[#110c1b] border border-dashed border-slate-300 dark:border-white/10 rounded-2xl p-6 text-center text-slate-500 italic text-sm">
                            <Award className="mx-auto mb-2 text-slate-400" /> Control de Beneficios Escaneados (Próximamente)
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ResumenPage;