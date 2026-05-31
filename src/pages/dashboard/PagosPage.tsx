import { useState } from 'react';
import { Wallet2, AlertTriangle } from 'lucide-react';
import GenericPay from '@/components/ui/GenericPay';
// Importá tu instancia de API (ajustá la ruta según cómo la tengas en tu proyecto)
import api from '@/api/axios'; 

const PagosPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePayment = async (membresiaId: number) => {
        setIsLoading(true);
        setError('');

        try {
            // 1. Crear/Actualizar la Suscripción
            const suscripcionResponse = await api.post('/suscripcion', {
                membresia_id: membresiaId 
            });

            const suscripcionId = suscripcionResponse.data.id; 

            // 2. Generar el link de Mercado Pago
            const pagoResponse = await api.post('/pagos/generar-link', {
                suscripcion_id: suscripcionId
            });

            // 3. Redirigir a Mercado Pago
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
        <div className="max-w-4xl mx-auto space-y-10 pb-12">
            {/* Encabezado */}
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

            {/* Cartel de error si falla Mercado Pago */}
            {error && (
                <div className="bg-red-500/10 border-l-4 border-red-500 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3">
                    <AlertTriangle size={20} />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {/* ACÁ CONECTAMOS EL COMPONENTE  */}
            <section>
                <GenericPay 
                    onSelectPlan={handlePayment} 
                    isLoading={isLoading} 
                />
            </section>
        </div>
    );
};

export default PagosPage;