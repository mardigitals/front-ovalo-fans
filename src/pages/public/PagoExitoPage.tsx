import { useNavigate } from 'react-router-dom';
import { CheckCircle, Trophy } from 'lucide-react';

const PagoExitoPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md p-8 text-center bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-green-500/30 rounded-3xl shadow-[0_0_50px_rgba(34,197,94,0.2)] animate-in zoom-in duration-500">
                
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 relative">
                    <CheckCircle size={50} className="absolute z-10" />
                    <Trophy size={80} className="absolute opacity-20" />
                </div>

                <h1 className="title-fan text-4xl mb-2 text-slate-800 dark:text-white">¡PAGO APROBADO!</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                    La transferencia fue exitosa. Ya sos oficialmente parte del equipo Óvalo Fans. Preparate para disfrutar de todos los beneficios exclusivos.
                </p>

                <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-4 bg-green-500 hover:bg-green-400 text-black font-black rounded-xl transition-all uppercase flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(34,197,94,0.3)]"
                >
                    Ir a mi Perfil FAN
                </button>
            </div>
        </div>
    );
};

export default PagoExitoPage;