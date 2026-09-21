import { useState, useEffect } from 'react';
import { BarChart3, Activity } from 'lucide-react';
import api from '@/api/axios';

import { SuscripcionesDonutChart } from '@/components/ui/SuscripcionesDonutChart';
import { FansRadialChart } from '@/components/ui/FansRadialChart';
import { CiudadesTable } from '@/components/ui/CiudadesTable';
import { AltasBajasChart } from '@/components/ui/AltasBajasChart';
import { MrrChart } from '@/components/ui/MrrChart';
import { TopSociosList } from '@/components/ui/TopSociosList';
import { ProvinciasPieChart } from '@/components/ui/ProvinciasPieChart';

const SuscripcionesMetricasPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [metricasEstados, setMetricasEstados] = useState({ Activo: 0, Pendiente: 0, Vencido: 0, Cancelado: 0, Total: 0 });
    const [topCiudades, setTopCiudades] = useState<any[]>([]);
    const [topProvincias, setTopProvincias] = useState<any[]>([]);
    const [datosRetencion, setDatosRetencion] = useState<any[]>([]);
    const [datosMrr, setDatosMrr] = useState<any[]>([]);
    const [topSocios, setTopSocios] = useState<any[]>([]);

    useEffect(() => {
        const cargarMetricas = async () => {
            try {     
                const [resSuscripciones, resCiudades, resProvincias, resRetencion, resMrr, resTopSocios] = await Promise.all([
                    api.get('/suscripcion/admin/metricas/suscripciones').catch(() => ({ data: [] })),
                    api.get('/suscripcion/admin/metricas/ciudades').catch(() => ({ data: [] })),
                    api.get('/suscripcion/admin/metricas/provincias').catch(() => ({ data: [] })),
                    api.get('/suscripcion/admin/metricas/retencion').catch(() => ({ data: [] })), 
                    api.get('/pagos/admin/metricas/mrr').catch(() => ({ data: [] })),
                    api.get('/suscripcion/admin/metricas/top-socios').catch(() => ({ data: [] })) 
                ]);

                const rawSuscripciones = resSuscripciones.data;
                const listaSuscripciones = rawSuscripciones?.data || (Array.isArray(rawSuscripciones) ? rawSuscripciones : []);

                setMetricasEstados({
                    Activo: Number(listaSuscripciones.find((s: any) => s.estado === 'Activo')?.cantidad || 0),
                    Pendiente: Number(listaSuscripciones.find((s: any) => s.estado === 'Pendiente')?.cantidad || 0),
                    Vencido: Number(listaSuscripciones.find((s: any) => s.estado === 'Vencido')?.cantidad || 0),
                    Cancelado: Number(listaSuscripciones.find((s: any) => s.estado === 'Cancelado')?.cantidad || 0),
                    Total: listaSuscripciones.reduce((acc: number, curr: any) => acc + Number(curr.cantidad), 0)
                });

                setTopCiudades(resCiudades.data || []);                
                setTopProvincias(resProvincias.data || []);
                
                // 3. Guardamos la data real
                setDatosRetencion(resRetencion.data || []);
                setDatosMrr(resMrr.data || []);
                setTopSocios(resTopSocios.data || []);

            } catch (err) {
                console.error("Error al cargar métricas:", err);
                setError("No se pudieron cargar los datos del servidor.");
            } finally {
                setIsLoading(false);
            }
        };

        cargarMetricas();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-institucional-celeste border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Analizando datos de suscripciones...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 p-4 rounded-xl max-w-2xl mx-auto mt-10">
                <p className="font-bold">Error de Conexión</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                        <BarChart3 className="text-institucional-celeste" /> 
                        Métricas de Suscripciones
                    </h1>
                    <p className="text-slate-500 flex items-center gap-2 mt-1">
                        <Activity size={16} /> Analíticas avanzadas de la comunidad Óvalo Fans.
                    </p>
                </div>
                <div className="text-sm text-slate-400 font-mono bg-white dark:bg-[#110c1b] px-4 py-2 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                    {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-full">
                        <SuscripcionesDonutChart metricasEstados={metricasEstados} />
                    </div>
                    <div className="h-full">
                        <FansRadialChart activos={metricasEstados.Activo} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AltasBajasChart data={datosRetencion} />
                    <MrrChart data={datosMrr} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <div className="flex flex-col gap-6 w-full">
                        <ProvinciasPieChart provincias={topProvincias} />
                        <CiudadesTable ciudades={topCiudades} />
                    </div>
                    
                    <div className="w-full h-full">
                        <TopSociosList data={topSocios} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SuscripcionesMetricasPage;