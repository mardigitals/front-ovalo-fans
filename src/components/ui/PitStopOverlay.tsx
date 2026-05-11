import { CreditCard, LogOut, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PitStopProps {
    status: 'Pendiente' | 'Vencida' | 'Suspendida' | 'Eliminada' | string;
}

const PitStopOverlay = ({ status }: PitStopProps) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    // Mensajes personalizados según el estado
    const getMessage = () => {
        switch (status) {
            case 'Pendiente': return 'Tu suscripción está en el taller. Completá el pago para salir a pista.';
            case 'Vencida': return '¡Bandera roja! Tu suscripción ha vencido. Pasá por boxes para renovar.';
            case 'Suspendida': return 'Tu cuenta ha sido penalizada por el comisario deportivo. Contactate con soporte.';
            case 'Eliminada': return 'Esta cuenta ya no forma parte del equipo. Adiós, corredor.';
            default: return 'Frenada en boxes. Necesitamos revisar tu estado de cuenta.';
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#08060d]/80 backdrop-blur-md p-4 animate-in fade-in duration-500">
            <div className="w-full max-w-lg bg-white dark:bg-black/90 border-2 border-sky-500 rounded-3xl shadow-[0_0_50px_rgba(14,165,233,0.4)] overflow-hidden relative">
                
                {/* Decoración Racing */}
                <div className="absolute top-0 left-0 w-full h-2 bg-repeating-linear-gradient(45deg,#000,#000_10px,#fbbf24_10px,#fbbf24_20px)">
                    {/* Franja Amarilla y Negra tipo Boxes */}
                    <div className="h-full w-full bg-[repeating-linear-gradient(-45deg,#fbbf24,#fbbf24_20px,#000_20px,#000_40px)]"></div>
                </div>

                <div className="p-8 pt-10 text-center">
                    <div className="w-20 h-20 bg-sky-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-sky-500 animate-pulse">
                        <Wrench size={40} />
                    </div>

                    <h2 className="title-fan text-3xl md:text-4xl mb-4 dark:text-white uppercase tracking-tighter">
                        Frenada en Boxes
                    </h2>

                    <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 font-medium">
                        {getMessage()}
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                        {/* Botón para pagar (solo si no es suspendido/eliminado) */}
                        {status !== 'Suspendida' && status !== 'Eliminada' && (
                            <button 
                                onClick={() => navigate('/registerPage')} // O a una página de /planes
                                className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-black font-black rounded-xl transition-all uppercase flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(14,165,233,0.3)]"
                            >
                                <CreditCard size={20} />
                                Actualizar Pago
                            </button>
                        )}

                        <button 
                            onClick={handleLogout}
                            className="w-full py-4 bg-slate-100 dark:bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-slate-500 font-bold rounded-xl transition-all uppercase flex items-center justify-center gap-3"
                        >
                            <LogOut size={20} />
                            Salir del Sistema
                        </button>
                    </div>
                </div>

                {/* Footer del Modal */}
                <div className="bg-slate-50 dark:bg-white/[0.02] p-4 text-center border-t border-slate-200 dark:border-white/5 text-xs text-slate-500 font-mono italic">
                    STATUS_CODE: {status.toUpperCase()}
                </div>
            </div>
        </div>
    );
};

export default PitStopOverlay;