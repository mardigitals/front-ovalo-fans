import { useState, useEffect } from 'react';
import { User, Shield, Calendar, CheckCircle, Clock, Award, Star } from 'lucide-react';
import api from '@/api/axios';

// --- IMPORTACIONES COMPONENTES UI CHARTS Y TABLE---
import { CiudadesTable } from '@/components/ui/CiudadesTable';
import { FinanzasBarChart } from '@/components/ui/FinanzasBarChart';
import { ChicanasPieChart } from '@/components/ui/ChicanasPieChart';
import { FansRadialChart } from '@/components/ui/FansRadialChart';
import { SuscripcionesDonutChart } from '@/components/ui/SuscripcionesDonutChart';
import { ClimaInfo } from '@/components/ui/ClimaInfo';
import { EventosPieChart } from '@/components/ui/EventosPieChart';
import { PublicacionesRadarChart } from '@/components/ui/PublicacionesRadarChart';
import { VisualizacionesBarChart } from '@/components/ui/VisualizacionesBarChart';

const ResumenPage = () => {
    const [perfil, setPerfil] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Mock states para las métricas de Fan
    const [ultimosBeneficios, setUltimosBeneficios] = useState<any[]>([]);
    const [proximosBeneficios, setProximosBeneficios] = useState<any[]>([]);
    
    const [totalBeneficiosUsados, setTotalBeneficiosUsados] = useState(0);
    const formatearBeneficio = (tipo: string) => {
    return tipo.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
};

    //Mock states para las metricas de Prensa
    const [Tipos] = useState<any[]>([]);
    const [Publicaciones] = useState<any[]>([]);
    const [metricasVisualizaciones] = useState<any[]>([]);

    // --- ESTADOS STAFF ---
    const [metricasEstados, setMetricasEstados] = useState({ Activo: 0, Pendiente: 0, Vencido: 0, Cancelado: 0, Total: 0 });
    const [topChicanas, setTopChicanas] = useState<any[]>([]);
    const [topCiudades, setTopCiudades] = useState<any[]>([]);
    const [metricasFinanzas, setMetricasFinanzas] = useState<any[]>([]);




    useEffect(() => {
        const cargarResumen = async () => {
            try {
                const res = await api.get('/usuario-auth/perfil');
                setPerfil(res.data);
                
                // Mocks Fan
                setUltimosBeneficios([{ id: 1, nombre: 'Descuento 20% Boxes', fecha: '28/5/2026' }]);
                setProximosBeneficios([{ id: 2, nombre: 'Acceso Anticipado TC Rafaela', fecha: '14/6/2026' }]);

                const rolStr = res.data?.rol?.toLowerCase() || '';
                const esStaffCheck = ['superadmin', 'administrativo'].includes(rolStr);
                // const esPrensaCheck = ['prensa'].includes(rolStr);

                if (esStaffCheck) {
                    const [resSuscripciones, resChicanas, resCiudades, resIngresos] = await Promise.all([
                        api.get('/suscripcion/admin/metricas/suscripciones').catch(() => ({ data: [] })),
                        api.get('/suscripcion/admin/metricas/chicanas').catch(() => ({ data: [] })),
                        api.get('/suscripcion/admin/metricas/ciudades').catch(() => ({ data: [] })),
                        api.get('/pagos/mensuales').catch(() => ({ data: [] }))
                    ]);                    

                    // 1. Estados
                    const rawSuscripciones = resSuscripciones.data;
                    const listaSuscripciones = rawSuscripciones?.data || (Array.isArray(rawSuscripciones) ? rawSuscripciones : []);

                    setMetricasEstados({
                        // Buscamos el objeto donde el estado coincida y tomamos su propiedad cantidad
                        Activo: Number(listaSuscripciones.find((s: any) => s.estado === 'Activo')?.cantidad || 0),
                        Pendiente: Number(listaSuscripciones.find((s: any) => s.estado === 'Pendiente')?.cantidad || 0),
                        Vencido: Number(listaSuscripciones.find((s: any) => s.estado === 'Vencido')?.cantidad || 0),
                        Cancelado: Number(listaSuscripciones.find((s: any) => s.estado === 'Cancelado')?.cantidad || 0),
                        // Para el total, sumamos las cantidades de todos los objetos recibidos
                        Total: listaSuscripciones.reduce((acc: number, curr: any) => acc + Number(curr.cantidad), 0)
                    });

                    // 2. Chicanas
                    const chicanasFormateadas = (resChicanas.data || []).map((c: any) => ({
                        nombre: c.chicana || 'Sin definir',
                        fans: Number(c.cantidad || 0) 
                    }));
                    setTopChicanas(chicanasFormateadas);

                    // 3. Ciudades
                    setTopCiudades(resCiudades.data || []);
                    
                    // 4. Finanzas
                    const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
 
                    const finanzasFormateadas = (resIngresos.data || []).map((item: any) => ({
                        // Traducimos el número de mes a texto (ej: 8 -> 'Ago'). Restamos 1 porque los arrays empiezan en 0.
                        mes: item.mes ? nombresMeses[item.mes - 1] : 'Desconocido',
                        
                        // Leemos 'total_ingresos' del backend y lo guardamos como 'ingresos' que es lo que espera el gráfico
                        ingresos: Number(item.total_ingresos || 0)
                    }));

                    setMetricasFinanzas(finanzasFormateadas);
                }else if (!esStaffCheck) {
                    // === LÓGICA PARA FANS ===try {
                    const resUsos = await api.get('/uso-beneficio/mis-usos');
                    const usos = resUsos.data || [];

                    // Filtramos por estado según tu DB
                    const completados = usos.filter((u: any) => u.estado === 'Completado');
                    const pendientes = usos.filter((u: any) => u.estado === 'Pendiente');

                    // A. Total de beneficios usados
                    setTotalBeneficiosUsados(completados.length);

                    // B. Último Uso (Ordenamos completados por fecha_uso descendente y agarramos 1)
                    if (completados.length > 0) {
                        const ultimos = completados.sort((a: any, b: any) => 
                            new Date(b.fecha_uso).getTime() - new Date(a.fecha_uso).getTime()
                        ).slice(0, 1);

                        setUltimosBeneficios(ultimos.map((u: any) => ({
                            id: u.id,
                            nombre: formatearBeneficio(u.tipo_beneficio),
                            fecha: new Date(u.fecha_uso).toLocaleDateString('es-AR')
                        })));
                    } else {
                        setUltimosBeneficios([]);
                    }

                    // C. Próximas Citas (Ordenamos pendientes por fecha_solicitud y agarramos 1)
                    if (pendientes.length > 0) {
                        const proximos = pendientes.sort((a: any, b: any) => 
                            new Date(a.fecha_solicitud).getTime() - new Date(b.fecha_solicitud).getTime()
                        ).slice(0, 1);

                        setProximosBeneficios(proximos.map((u: any) => ({
                            id: u.id,
                            nombre: formatearBeneficio(u.tipo_beneficio),
                            fecha: new Date(u.fecha_solicitud).toLocaleDateString('es-AR')
                        })));
                    } else {
                        setProximosBeneficios([]);
                    }
                }
                // if (esPrensaCheck) {
                //     const [resTipos, resPublicaciones, resMetricasVisualizaciones] = await Promise.all([
                //         api.get('/prensa/admin/metricas/tipos').catch(() => ({ data: [] })),
                //         api.get('/prensa/admin/metricas/publicaciones').catch(() => ({ data: [] })),
                //         api.get('/prensa/admin/metricas/visualizaciones').catch(() => ({ data: [] }))
                //     ]);
                


                // }
            }catch (err) {
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

    const esStaff = ['superadmin', 'administrativo'].includes(perfil?.rol?.toLowerCase());
    const esPrensa = ['prensa'].includes(perfil?.rol?.toLowerCase());

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
                        {esPrensa ? `Bienvenido al centro de prensa` : ''}
                        {esStaff ? `Bienvenido al centro de operaciones` : ''}
                        {!esStaff && !esPrensa ? `Bienvenido de nuevo, Fan del Óvalo` : ''}
                    </p>
                </div>
                <div className="text-sm text-slate-400 font-mono">
                    {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* VISTA 0: GENERICO (CLIMA) */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <ClimaInfo />
                </div>
            </div>

            {/* 🏎️ VISTA 1: TABLERO PARA FANS (INTACTA) */}
            {!esStaff && !esPrensa && (
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-[#161024] border border-slate-200 dark:border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                                <div className="p-3 bg-institucional-celeste/10 text-institucional-celeste rounded-xl">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Beneficios Usados</p>
                                    <p className="text-2xl font-black text-slate-800 dark:text-white">
                                        {totalBeneficiosUsados} {totalBeneficiosUsados === 1 ? 'Beneficio' : 'Beneficios'}
                                    </p>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            {/* 📊 VISTA 2: TABLERO SHADCN UI + RECHARTS (STAFF)                          */}
            {/* ========================================================================= */}
            {esStaff && (
                <div className="space-y-6">
                    
                    {/* FILA 1: TARJETAS PEQUEÑAS (Suscripciones, Fans, Sectores) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <SuscripcionesDonutChart metricasEstados={metricasEstados} />
                        <FansRadialChart activos={metricasEstados.Activo} />
                        <ChicanasPieChart chicanas={topChicanas} />
                    </div>

                    {/* FILA 2: GRÁFICO BARRA CUSTOM - INGRESOS FINANCIEROS */}
                    <FinanzasBarChart metricasFinanzas={metricasFinanzas} />

                    {/* FILA 3: TABLA DE CIUDADES (TRADICIONAL) */}
                    <CiudadesTable ciudades={topCiudades} />

                </div>
            )}

            {/* 📊 VISTA 3: TABLERO SHADCN UI + RECHARTS (PRENSA)     MOCKS                     */}
            {/* ========================================================================= */}
            {esPrensa && (
                <div className="space-y-6">
                    
                   
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <EventosPieChart tipos={Tipos} />
                    <PublicacionesRadarChart publicaciones={Publicaciones} />
                    </div>

                  <VisualizacionesBarChart metricasVisualizaciones={metricasVisualizaciones} />

                </div>
            )}


        </div>
    );
};

export default ResumenPage;