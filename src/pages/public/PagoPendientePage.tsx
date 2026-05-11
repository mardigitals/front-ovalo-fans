import { useNavigate } from 'react-router-dom';
import { Clock, AlertCircle } from 'lucide-react';

const PagoPendientePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md p-8 text-center bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-yellow-500/30 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.2)] animate-in zoom-in duration-500">
                
                <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500 relative">
                    <Clock size={50} className="absolute z-10 animate-pulse" />
                    <AlertCircle size={80} className="absolute opacity-20" />
                </div>

                <h1 className="title-fan text-4xl mb-2 text-slate-800 dark:text-white">PAGO EN REVISIÓN</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                    Mercado Pago está procesando tu transacción. Esto puede demorar unos minutos o hasta 24 horas si pagaste en efectivo (Rapipago/PagoFácil).
                </p>

                <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-xl transition-all uppercase flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(234,179,8,0.3)]"
                >
                    Ir al Dashboard
                </button>
            </div>
        </div>
    );
};

export default PagoPendientePage;