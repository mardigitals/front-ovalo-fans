import { useState, useEffect } from 'react';
import { User, Shield, Calendar, CheckCircle, Clock, Award, Star, TrendingUp, Users, Activity, MapPin, Flag } from 'lucide-react';
import { 
    PieChart, Pie, Cell, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import api from '@/api/axios';

// Colores para la distribución de estados
const COLORES_ESTADO = {
    Activo: '#22c55e',
    Pendiente: '#f59e0b',
    Vencido: '#ef4444',
    Cancelado: '#64748b'
};

const ResumenPage = () => {
    const [perfil, setPerfil] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Mock states para las métricas que agregaremos (simulando carga de datos)
    const [ultimosBeneficios, setUltimosBeneficios] = useState<any[]>([]);
    const [proximosBeneficios, setProximosBeneficios] = useState<any[]>([]);

    // --- ESTADOS EXCLUSIVOS PARA RECHARTS (STAFF) ---
    const [datosEstadosPie, setDatosEstadosPie] = useState<any[]>([]);
    const [topChicanas, setTopChicanas] = useState<any[]>([]);
    const [topCiudades, setTopCiudades] = useState<any[]>([]);
    const [metricasFinanzas, setMetricasFinanzas] = useState<any[]>([]);

    useEffect(() => {
        const cargarResumen = async () => {
            try {
                // Traemos el perfil que ya tiene resuelto el rol y estado
                const res = await api.get('/usuario-auth/perfil');
                setPerfil(res.data);
                
                // Mocks para la vista del fan
                setUltimosBeneficios([{ id: 1, nombre: 'Descuento 20% Boxes', fecha: '28/5/2026' }]);
                setProximosBeneficios([{ id: 2, nombre: 'Acceso Anticipado TC Rafaela', fecha: '14/6/2026' }]);

                // --- CARGA DE TELEMETRÍA SI ES STAFF ---
                const rolStr = res.data?.rol?.toLowerCase() || '';
                const esStaffCheck = ['superadmin', 'administrativo', 'prensa'].includes(rolStr);

                if (esStaffCheck) {
                    const [resSuscripciones, resChicanas, resCiudades] = await Promise.all([
                        api.get('/suscripcion/admin').catch(() => ({ data: [] })),
                        api.get('/suscripcion/admin/metricas/chicanas').catch(() => ({ data: [] })),
                        api.get('/suscripcion/admin/metricas/ciudades').catch(() => ({ data: [] }))
                    ]);

                    // 1. Gráfico de Torta (Suscripciones)
                    // Tu findAll de suscripciones devuelve un sobre con { data: [...] }
                    const rawSuscripciones = resSuscripciones.data;
                    const listaSuscripciones = rawSuscripciones?.data || (Array.isArray(rawSuscripciones) ? rawSuscripciones : []);

                    const estadosAgrupados = [
                        { name: 'Activo', value: listaSuscripciones.filter((s: any) => s && s.estado === 'Activo').length },
                        { name: 'Pendiente', value: listaSuscripciones.filter((s: any) => s && s.estado === 'Pendiente').length },
                        { name: 'Vencido', value: listaSuscripciones.filter((s: any) => s && s.estado === 'Vencido').length },
                        { name: 'Cancelado', value: listaSuscripciones.filter((s: any) => s && s.estado === 'Cancelado').length },
                    ].filter(e => e.value > 0);
                    setDatosEstadosPie(estadosAgrupados);

                    // 2. Gráfico de Barras (Chicanas)
                    // 🚨 CORREGIDO: Mapeamos 'chicana' y forzamos Number() para activar Recharts
                    const chicanasFormateadas = (resChicanas.data || []).map((c: any) => ({
                        nombre: c.chicana || 'Sin definir',
                        fans: Number(c.cantidad || 0) 
                    }));
                    setTopChicanas(chicanasFormateadas);

                    // 3. Tabla de Ciudades (Guardamos directo el array que viene del service)
                    setTopCiudades(resCiudades.data || []);

                    // 4. Mock para ingresos financieros
                    setMetricasFinanzas([
                        { mes: 'Ene', ingresos: 450000 },
                        { mes: 'Feb', ingresos: 520000 },
                        { mes: 'Mar', ingresos: 850000 },
                        { mes: 'Abr', ingresos: 610000 },
                        { mes: 'May', ingresos: 720000 },
                        { mes: 'Jun', ingresos: 980000 },
                    ]);
                }

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

            {/* ========================================================================= */}
            {/* 📊 VISTA 2: TABLERO DE ADMINISTRACIÓN CON RECHARTS (STAFF)                */}
            {/* ========================================================================= */}
            {esStaff && (
                <div className="space-y-8">
                    
                    {/* FILA 1: GRÁFICOS PRINCIPALES (Suscripciones y Sectores) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Gráfico de Torta - Suscripciones */}
                        <div className="bg-white dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-md flex flex-col justify-between">
                            <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider mb-4 text-center">
                                Distribución de Suscripciones
                            </h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%" minWidth={250}>
                                    <PieChart>
                                        <Pie
                                            isAnimationActive={false}
                                            data={datosEstadosPie}
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                        >
                                            {datosEstadosPie.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORES_ESTADO[entry.name as keyof typeof COLORES_ESTADO] || '#cbd5e1'} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip 
                                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
                                            itemStyle={{ color: 'white' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Gráfico de Barras - Top Chicanas */}
                        <div className="bg-white dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-md flex flex-col justify-between">
                            <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider mb-4 text-center">
                                Sectores Favoritos (Chicanas)
                            </h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%" minWidth={250}>
                                    <BarChart data={topChicanas} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                        <XAxis type="number" stroke="#94a3b8" />
                                        <YAxis dataKey="nombre" type="category" stroke="#94a3b8" width={90} fontSize={12} />
                                        <RechartsTooltip 
                                            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
                                        />
                                        <Bar isAnimationActive={false} dataKey="fans" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} name="Fans" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>

                    {/* FILA 2: GRÁFICO GRANDE - EVOLUCIÓN FINANCIERA */}
                    <div className="bg-white dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-md">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <TrendingUp className="text-green-500" size={20} /> Evolución de Ingresos Mensuales
                            </h3>
                            <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-bold rounded-full uppercase tracking-wider">
                                Auditoría Global
                            </span>
                        </div>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%" minWidth={300}>
                                <AreaChart data={metricasFinanzas} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="mes" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" tickFormatter={(v) => `$${v / 1000}k`} />
                                    <RechartsTooltip 
                                        formatter={(value: any) => [`$${Number(value).toLocaleString('es-AR')}`, 'Recaudación']}
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
                                    />
                                    <Area isAnimationActive={false} type="monotone" dataKey="ingresos" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* FILA 3: LISTA DEMOGRÁFICA DE CIUDADES */}
                    <div className="bg-white dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-md max-w-xl mx-auto">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="text-institucional-celeste" size={20} />
                            <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider">Ranking de Socios por Ciudad</h3>
                        </div>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-white/10 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="pb-2">Ciudad</th>
                                    <th className="pb-2 text-right">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {topCiudades.slice(0, 5).map((ciudad, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {ciudad.ciudad || 'No especificada'}
                                        </td>
                                        {/* 🚨 CORREGIDO: Usamos ciudad.cantidad en vez de .count */}
                                        <td className="py-2.5 text-sm font-bold text-institucional-celeste text-right">
                                            {ciudad.cantidad}
                                        </td>
                                    </tr>
                                ))}
                                {topCiudades.length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="py-4 text-center text-sm text-slate-500 italic">No hay registros geográficos aún.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            )}

        </div>
    );
};

export default ResumenPage;