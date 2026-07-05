import { useState, useEffect, useMemo } from 'react';
import { User, Shield, Calendar, CheckCircle, Clock, Award, Star, TrendingUp, MapPin } from 'lucide-react';
import api from '@/api/axios';

// --- IMPORTACIONES DE SHADCN UI Y RECHARTS ---
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Label, Pie, PieChart, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const ResumenPage = () => {
    const [perfil, setPerfil] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Mock states para las métricas de Fan
    const [ultimosBeneficios, setUltimosBeneficios] = useState<any[]>([]);
    const [proximosBeneficios, setProximosBeneficios] = useState<any[]>([]);

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
                const esStaffCheck = ['superadmin', 'administrativo', 'prensa'].includes(rolStr);

                if (esStaffCheck) {
                    const [resSuscripciones, resChicanas, resCiudades, resIngresos] = await Promise.all([
                        api.get('/suscripcion/admin').catch(() => ({ data: [] })),
                        api.get('/suscripcion/admin/metricas/chicanas').catch(() => ({ data: [] })),
                        api.get('/suscripcion/admin/metricas/ciudades').catch(() => ({ data: [] })),
                        api.get('/pagos/mensuales').catch(() => ({ data: [] }))
                    ]);                    

                    // 1. Estados
                    const rawSuscripciones = resSuscripciones.data;
                    const listaSuscripciones = rawSuscripciones?.data || (Array.isArray(rawSuscripciones) ? rawSuscripciones : []);
                    
                    setMetricasEstados({
                        Activo: listaSuscripciones.filter((s: any) => s && s.estado === 'Activo').length,
                        Pendiente: listaSuscripciones.filter((s: any) => s && s.estado === 'Pendiente').length,
                        Vencido: listaSuscripciones.filter((s: any) => s && s.estado === 'Vencido').length,
                        Cancelado: listaSuscripciones.filter((s: any) => s && s.estado === 'Cancelado').length,
                        Total: listaSuscripciones.length || 0 
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
                }

            }catch (err) {
                console.error("Error al cargar el resumen:", err);
                setError("No se pudo cargar el tablero principal.");
            } finally {
                setIsLoading(false);
            }
        };

        cargarResumen();
    }, []);

    // ============================================================================
    // ⚙️ CONFIGURACIÓN DE SHADCN CHARTS (Colores y mapeo de datos)
    // ============================================================================
    
    // 1. Suscripciones (Donut con texto central)
    const datosSuscripcionesShadcn = useMemo(() => [
        { estado: "Activo", cantidad: metricasEstados.Activo, fill: "#22c55e" },
        { estado: "Pendiente", cantidad: metricasEstados.Pendiente, fill: "#64748b" },
        { estado: "Vencido", cantidad: metricasEstados.Vencido, fill: "#efde44" },
        { estado: "Cancelado", cantidad: metricasEstados.Cancelado, fill: "#be2323" },
    ].filter(d => d.cantidad > 0), [metricasEstados]);
    
    const configSuscripciones = {
        cantidad: { label: "Suscripciones" },
        Activo: { label: "Activos", color: "#22c55e" },
        Pendiente: { label: "Pendientes", color: "#64748b" },
        Vencido: { label: "Vencidos", color: "#efde44" },
        Cancelado: { label: "Cancelados", color: "#be2323" },
    };

    // 2. Fans Totales (Radial Shape)
    const radialData = [{ browser: "fans", visitors: metricasEstados.Total, fill: "#0b97f5" }];
    const configRadial = { visitors: { label: "Fans Totales" }, fans: { label: "Fans", color: "#0b97f5" } };
    
    // 3. Sectores Favoritos (Donut simple)
    const coloresSectores = ["#0b97f5", "#0b97f5d5", "#0b97f58f", "#0b97f557", "#0b97f527"];
    const datosSectoresShadcn = useMemo(() => {
        // Ordenamos los datos de mayor a menor para que el [0] sea siempre el líder
        const sorted = [...topChicanas].sort((a, b) => b.fans - a.fans);
        return sorted.map((c, i) => ({
            browser: c.nombre,
            visitors: c.fans,
            fill: coloresSectores[i % coloresSectores.length]
        }));
    }, [topChicanas]);

    const configSectores = { visitors: { label: "Fans" } };

    // 4. Finanzas (Bar Chart Custom Label)
    const configFinanzas = { ingresos: { label: "Recaudación", color: "#0ea5e9" } };


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

            {/* 🏎️ VISTA 1: TABLERO PARA FANS (INTACTA) */}
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
                        
                        {/* 1. SUSCRIPCIONES (DONUT CON TEXTO) */}
                        <Card className="flex flex-col bg-white dark:bg-[#110c1b] border-slate-200 dark:border-white/10">
                            <CardHeader className="items-center pb-0">
                                <CardTitle className="dark:text-white text-sm font-black uppercase tracking-wider">Estado de Suscripciones</CardTitle>
                                <CardDescription>En tiempo real</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 pb-0">
                                <ChartContainer config={configSuscripciones} className="mx-auto aspect-square max-h-[250px]">
                                    <PieChart>
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                        <Pie data={datosSuscripcionesShadcn} dataKey="cantidad" nameKey="estado" innerRadius={60} strokeWidth={5}>
                                            <Label
                                                content={({ viewBox }) => {
                                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                        return (
                                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-slate-800 dark:fill-white text-3xl font-bold">
                                                                    {metricasEstados.Total.toLocaleString()}
                                                                </tspan>
                                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-slate-500 text-xs">
                                                                    Totales
                                                                </tspan>
                                                            </text>
                                                        )
                                                    }
                                                }}
                                            />
                                        </Pie>
                                    </PieChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        {/* 2. FANS TOTALES (RADIAL SHAPE) */}
                        <Card className="flex flex-col bg-white dark:bg-[#110c1b] border-slate-200 dark:border-white/10">
                            <CardHeader className="items-center pb-0">
                                <CardTitle className="dark:text-white text-sm font-black uppercase tracking-wider">Comunidad Óvalo</CardTitle>
                                <CardDescription>P1 + P2 + P3 FANS</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 pb-0">
                                <ChartContainer config={configRadial} className="mx-auto aspect-square max-h-[250px]">
                                    <RadialBarChart data={radialData} endAngle={100} innerRadius={65} outerRadius={95}>
                                        <PolarGrid gridType="circle" radialLines={false} stroke="none" className="first:fill-slate-100 dark:first:fill-white/5 last:fill-transparent" polarRadius={[86, 74]} />
                                        <RadialBar dataKey="visitors" background />
                                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                            <Label
                                                content={({ viewBox }) => {
                                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                        return (
                                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-institucional-celeste text-4xl font-bold">
                                                                    {metricasEstados.Total.toLocaleString()}
                                                                </tspan>
                                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-slate-500 text-xs">
                                                                    Fans
                                                                </tspan>
                                                            </text>
                                                        )
                                                    }
                                                }}
                                            />
                                        </PolarRadiusAxis>
                                    </RadialBarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        {/* 3. SECTORES FAVORITOS (DONUT SIMPLE) */}
                        <Card className="flex flex-col bg-white dark:bg-[#110c1b] border-slate-200 dark:border-white/10">
                            <CardHeader className="items-center pb-0">
                                <CardTitle className="dark:text-white text-sm font-black uppercase tracking-wider">Sectores Favoritos</CardTitle>
                                <CardDescription>Top Chicanas elegidas</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 pb-0">
                                <ChartContainer config={configSectores} className="mx-auto aspect-square max-h-[250px]">
                                    <PieChart>
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                        <Pie data={datosSectoresShadcn} dataKey="visitors" nameKey="browser" innerRadius={60} strokeWidth={5}>
                                            <Label
                                                content={({ viewBox }) => {
                                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                        return (
                                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-institucional-celeste text-xl font-bold">
                                                                    {datosSectoresShadcn[0]?.browser || "-"}
                                                                </tspan>
                                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-slate-500 text-[10px] uppercase">
                                                                    Favorito
                                                                </tspan>
                                                            </text>
                                                        )
                                                    }
                                                }}
                                            />
                                        </Pie>
                                    </PieChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                    </div>

                    {/* FILA 2: GRÁFICO BARRA CUSTOM - INGRESOS FINANCIEROS */}
                    <Card className="bg-white dark:bg-[#110c1b] border-slate-200 dark:border-white/10">
                        <CardHeader>
                            <CardTitle className="dark:text-white uppercase tracking-wider font-black flex items-center gap-2">
                                <TrendingUp className="text-institucional-celeste" /> Evolución Financiera
                            </CardTitle>
                            <CardDescription className="subtitle-fan">Ingresos mensuales del  {new Date().toLocaleDateString('es-AR', { year: 'numeric' })}
                            </CardDescription>
                            <div className="text-sm text-slate-400 font-mono">
                                  panel actualizado el {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={configFinanzas} className="h-[300px] w-full">
                                <BarChart accessibilityLayer data={metricasFinanzas} layout="vertical" margin={{ right: 40 }}>
                                    <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#334155" />
                                    <YAxis dataKey="mes" type="category" tickLine={false} tickMargin={10} axisLine={false} hide />
                                    <XAxis dataKey="ingresos" type="number" hide />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                    <Bar dataKey="ingresos" fill="#0ea5e9" radius={4}>
                                        <LabelList dataKey="mes" position="insideLeft" offset={8} className="fill-white font-medium" fontSize={12} />
                                        <LabelList dataKey="ingresos" position="right" offset={8} className="fill-slate-700 dark:fill-white font-bold" fontSize={12} formatter={(v: any) => `$${(v/1000)}k`} />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-2 text-sm border-t border-slate-200 dark:border-white/10 pt-4">
                            <div className="flex gap-2 leading-none font-medium text-green-500">
                                Tendencia alcista detectada <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="leading-none text-slate-500">
                                Mostrando recaudación histórica mensual.
                            </div>
                        </CardFooter>
                    </Card>

                    {/* FILA 3: TABLA DE CIUDADES (TRADICIONAL) */}
                    <div className="bg-white dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 rounded-xl p-6 shadow-md max-w-xl mx-auto">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="text-institucional-celeste" size={20} />
                            <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider">Demografía Socios</h3>
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
                                        <td className="py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300">{ciudad.ciudad || 'No especificada'}</td>
                                        <td className="py-2.5 text-sm font-bold text-institucional-celeste text-right">{ciudad.cantidad}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            )}
        </div>
    );
};

export default ResumenPage;