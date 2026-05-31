import { useState, useEffect } from 'react';
import { Wallet2, AlertTriangle, Receipt } from 'lucide-react';
import GenericPay from '@/components/ui/GenericPay';
import api from '@/api/axios';

const PagosPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // 1.  ESTADO PARA GUARDAR LA DATA DE SUSCRIPCIÓN Y PAGOS
    const [estadoSuscripcion, setEstadoSuscripcion] = useState<string | null>(null);
    const [historialPagos, setHistorialPagos] = useState<any[]>([]);
    const [cargandoDatos, setCargandoDatos] = useState(true);
    const [tituloPay, setTituloPay] = useState("Elegí tu Nivel de FAN");
    const [subtituloPay, setSubtituloPay] = useState("Asegurá tu lugar y accedé a los beneficios.");

    // 2.  TRAEMOS LOS DATOS CUANDO CARGA LA PÁGINA
    useEffect(() => {
        const fetchDatosFinancieros = async () => {
            try {
                // 1. Buscamos el Perfil
                const perfilRes = await api.get('/usuario-auth/perfil');
                const estado = perfilRes.data.estadoSuscripcion || 'Pendiente';
                setEstadoSuscripcion(estado);

                // 2. Cambiamos los textos según el estado de la suscripción
                if (estado === 'Activo') {
                    setTituloPay("¿Querés modificar tu plan?");
                    setSubtituloPay("Elegí una nueva membresía para subir de nivel.");
                } else if (estado === 'Vencido' || estado === 'Cancelado') {
                    setTituloPay("Renová tu suscripción");
                    setSubtituloPay("Regularizá tu pago para seguir disfrutando del Autódromo.");
                } else {
                    setTituloPay("Elegí tu Nivel de FAN");
                    setSubtituloPay("Asegurá tu lugar y accedé a los beneficios.");
                }

                // 3. Buscamos los Pagos
                const pagosRes = await api.get('/pagos/mis-pagos');  
                setHistorialPagos(pagosRes.data || []);

            } catch (err) {
                console.error("Error al cargar datos financieros:", err);
                // Si da error (ej: no tiene suscripción aún), lo tratamos como 'Pendiente'
                setEstadoSuscripcion('Pendiente');
                setTituloPay("Elegí tu Nivel de FAN");
                setSubtituloPay("Asegurá tu lugar y accedé a los beneficios.");
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

    // 3.  LÓGICA PARA LOS TÍTULOS DINÁMICOS
    const renderizarTitulos = () => {
        if (cargandoDatos) {
            return <h2 className="title-fan text-center text-3xl md:text-5xl text-slate-500">Cargando...</h2>;
        }

        switch (estadoSuscripcion) {
            case 'Activo':
                return (
                    <div className="text-center space-y-2 mb-8">
                        <h2 className="title-fan text-center text-3xl md:text-5xl text-institucional-celeste">
                            ¿Querés modificar tu plan?
                        </h2>
                        <p className="text-slate-500 font-medium">Elegí una nueva membresía para subir de nivel.</p>
                    </div>
                );
            case 'Vencido':
            case 'Cancelado':
                return (
                    <div className="text-center space-y-2 mb-8">
                        <h2 className="title-fan text-center text-3xl md:text-5xl text-red-500">
                            Renová tu suscripción
                        </h2>
                        <p className="text-slate-500 font-medium">Regularizá tu pago para seguir disfrutando del Autódromo.</p>
                    </div>
                );
            default: // Caso 'Pendiente' o si no hay datos
                return null; // Devolvemos null porque el GenericPay ya trae su propio título "Elegí tu Nivel"
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-12">
            
            {/* ENCABEZADO */}
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
                <div className="bg-institucional-celeste/10 p-4 rounded-xl border border-institucional-celeste/20">
                    <Wallet2 className="text-institucional-celeste" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white uppercase tracking-tighter">
                        Mi Billetera
                    </h1>
                    <p className="text-slate-500">Gestioná tu suscripción y pagos</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border-l-4 border-red-500 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3">
                    <AlertTriangle size={20} />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {/* SECCIÓN DE PRECIOS */}
            <section className="bg-white/5 p-8 rounded-3xl border border-white/5">
                {/* 4.  LLAMAMOS A LOS TÍTULOS DINÁMICOS ACÁ */}
                {renderizarTitulos()}
                
               <GenericPay 
                    onSelectPlan={handlePayment} 
                    isLoading={isLoading || cargandoDatos} 
                    titulo={tituloPay}         
                    subtitulo={subtituloPay}    
                />
            </section>

            {/* 5.  TABLA DE ÚLTIMOS PAGOS */}
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
                                        <td className="py-4 text-slate-700 dark:text-slate-300">
                                            {new Date(pago.fecha_pago).toLocaleDateString('es-AR')}
                                        </td>
                                        <td className="py-4 font-bold text-institucional-celeste">
                                            ${Number(pago.monto).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                        </td>
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