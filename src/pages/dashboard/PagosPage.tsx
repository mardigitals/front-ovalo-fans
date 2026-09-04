import { useState, useEffect } from 'react';
import { Wallet2, AlertTriangle, Receipt } from 'lucide-react';
import GenericPay from '@/components/ui/GenericPay'; // Ajustá la ruta si es necesario
import api from '@/api/axios';

const PagosPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [estadoSuscripcion, setEstadoSuscripcion] = useState<string | null>(null);
    const [historialPagos, setHistorialPagos] = useState<any[]>([]);
    const [membresiasActivas, setMembresiasActivas] = useState<any[]>([]); // 🔥 NUEVO ESTADO
    const [cargandoDatos, setCargandoDatos] = useState(true);

    useEffect(() => {
        const fetchDatosFinancieros = async () => {
            try {
                // 1. Buscamos el Perfil
                const perfilRes = await api.get('/usuario-auth/perfil');
                const estado = perfilRes.data.estadoSuscripcion || 'Pendiente';
                setEstadoSuscripcion(estado);

        
                // 3. Promesas en paralelo para Pagos y Membresías (Más rápido)
                const [pagosRes, membresiasRes] = await Promise.all([
                    api.get('/pagos/mis-pagos').catch(() => ({ data: [] })),
                    api.get('/membresia').catch(() => ({ data: [] }))
                ]);
                
                setHistorialPagos(pagosRes.data || []);

                // 🔥 4. Filtramos las dadas de baja y las ordenamos por precio de mayor a menor
                const activas = membresiasRes.data
                    .filter((m: any) => !m.eliminado_en)
                    .sort((a: any, b: any) => b.precio_mensual - a.precio_mensual);
                
                setMembresiasActivas(activas);

            } catch (err) {
                console.error("Error al cargar datos financieros:", err);
                setEstadoSuscripcion('Pendiente');
                setHistorialPagos([]);
            } finally {
                setCargandoDatos(false);
            }
        };

        fetchDatosFinancieros();
    }, []);

    const handlePayment = async (membresiaId: number) => {
        setIsLoading(true);
        setError('');

        try {
            const suscripcionResponse = await api.post('/suscripcion', { membresia_id: membresiaId });
            const pagoResponse = await api.post('/pagos/generar-link', { suscripcion_id: suscripcionResponse.data.id });

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

    const renderizarTitulos = () => {
        if (cargandoDatos) return <h2 className="title-fan text-center text-3xl md:text-5xl text-slate-500">Cargando...</h2>;
        
        if (estadoSuscripcion === 'Activo') {
            return (
                <div className="text-center space-y-2 mb-8">
                    <h2 className="title-fan text-center text-3xl pb-4 md:text-5xl">¿Querés modificar tu plan?</h2>
                    <p className="text-slate-500 font-medium">Elegí una nueva membresía para subir de nivel.</p>
                </div>
            );
        }
        
        if (estadoSuscripcion === 'Vencido' || estadoSuscripcion === 'Cancelado') {
            return (
                <div className="text-center space-y-2 mb-8">
                    <h2 className="title-fan text-center text-3xl pb-4 md:text-5xl">Renová tu suscripción</h2>
                    <p className="text-slate-500 font-medium">Regularizá tu pago para seguir disfrutando del Autódromo.</p>
                </div>
            );
        }
        return null; 
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-12">
            
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
                <div className="bg-institucional-celeste/10 p-4 rounded-xl border border-institucional-celeste/20">
                    <Wallet2 className="text-institucional-celeste" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white uppercase tracking-tighter">Mi Billetera</h1>
                    <p className="text-slate-500">Gestioná tu suscripción y pagos</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border-l-4 border-red-500 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3">
                    <AlertTriangle size={20} />
                    <span className="font-medium">{error}</span>
                </div>
            )}

           <section className="bg-white/5 p-4 md:p-8 rounded-3xl border border-white/5">
                {renderizarTitulos()}
                
                {/* 🔥 LE PASAMOS LAS MEMBRESÍAS DINÁMICAS AL COMPONENTE */}
                {!cargandoDatos && membresiasActivas.length > 0 ? (
                    <GenericPay 
                        onSelectPlan={handlePayment} 
                        isLoading={isLoading} 
                        membresias={membresiasActivas} 
                        // 🔥 Eliminamos las líneas de titulo y subtitulo acá para que no se dupliquen
                    />
                ) : !cargandoDatos && (
                    <div className="text-center py-10 text-slate-500 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                        Actualmente no hay planes de membresía disponibles.
                    </div>
                )}
            </section>
            
            <section className="bg-white dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
                    <Receipt className="text-institucional-celeste" />
                    <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wider">Historial de Pagos</h3>
                </div>

                {cargandoDatos ? (
                    <div className="text-center py-8 text-slate-500 animate-pulse">Cargando registros...</div>
                ) : historialPagos.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-slate-400 border-b border-slate-200 dark:border-white/10">
                                    <th className="py-3 font-semibold text-sm">ID Operación</th>
                                    <th className="py-3 font-semibold text-sm">Fecha</th>
                                    <th className="py-3 font-semibold text-sm">Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historialPagos.map((pago: any) => (
                                    <tr key={pago.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-4 text-slate-700 dark:text-slate-300 font-mono text-sm">#{pago.mp_payment_id || pago.id}</td>
                                        <td className="py-4 text-slate-700 dark:text-slate-300">{new Date(pago.fecha_pago).toLocaleDateString('es-AR')}</td>
                                        <td className="py-4 font-bold text-institucional-celeste">${Number(pago.monto).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-100 dark:border-white/5">
                        <p className="text-slate-500 italic">No hay pagos registrados en el sistema.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default PagosPage;