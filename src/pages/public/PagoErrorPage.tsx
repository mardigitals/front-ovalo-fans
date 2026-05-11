import { useNavigate } from 'react-router-dom';
import { XCircle, AlertTriangle } from 'lucide-react';

const PagoErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md p-8 text-center bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-red-500/30 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.2)] animate-in zoom-in duration-500">
                
                <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 relative">
                    <XCircle size={50} className="absolute z-10" />
                    <AlertTriangle size={80} className="absolute opacity-20" />
                </div>

                <h1 className="title-fan text-4xl mb-2 text-slate-800 dark:text-white">FRENADA BRUSCA</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                    Tuvimos un problema al procesar tu pago. Puede que tu tarjeta haya sido rechazada o cerraste la ventana antes de tiempo. No se te ha cobrado nada.
                </p>

                <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-4 bg-red-500 hover:bg-red-400 text-white font-black rounded-xl transition-all uppercase flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(239,68,68,0.3)]"
                >
                    Volver a Intentar
                </button>
            </div>
        </div>
    );
};

export default PagoErrorPage;