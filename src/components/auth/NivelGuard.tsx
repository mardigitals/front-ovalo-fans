import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { LockKeyhole } from 'lucide-react';

const PantallaBloqueoNivel = () => {
    const [segundos, setSegundos] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        const intervalo = setInterval(() => {
        setSegundos((prev) => prev - 1);
        }, 1000);

        const redireccion = setTimeout(() => {
        navigate('/dashboard', { replace: true });
        }, 5000);

        return () => {
        clearInterval(intervalo);
        clearTimeout(redireccion);
        };
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 animate-in fade-in zoom-in duration-500">
        <div className="bg-yellow-500/10 p-6 rounded-full mb-6 border-2 border-yellow-500/20">
            <LockKeyhole className="text-yellow-500" size={64} />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white uppercase tracking-tighter mb-4">
            Sector Exclusivo
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mb-8">
            Tu nivel de fan actual no incluye acceso a este beneficio. ¡Mejorá tu membresía para desbloquear esta zona!
        </p>
        <div className="bg-slate-100 dark:bg-white/5 px-8 py-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg">
            <p className="text-institucional-celeste font-bold text-lg animate-pulse flex items-center gap-2">
            Volviendo a la pista en {segundos}...
            </p>
        </div>
        </div>
    );
};

interface NivelGuardProps {
    allowedNiveles: string[];
}

const NivelGuard = ({ allowedNiveles }: NivelGuardProps) => {
    const { userProfile, isLoading } = useAuth();

    if (isLoading) return <FullScreenLoader />;

    const rol = userProfile?.rol?.toLowerCase() || 'fan';
    const nivel = userProfile?.nivelFan || 'P3'; // Por defecto le damos el nivel más bajo

    // Definimos exactamente quiénes son los dueños de la llave maestra
    const esStaff = ['superadmin', 'administrativo', 'prensa'].includes(rol);

    // Si es del Staff verificado, pasa siempre (llave maestra)
    if (esStaff) {
        return <Outlet />;
    }
    // Si es Fan, verificamos si su nivel está en la lista de permitidos
    if (!allowedNiveles.includes(nivel)) {
        console.warn(`Patovica de Tribuna: Acceso denegado. Un Fan nivel '${nivel}' intentó entrar a zona VIP.`);
        return <PantallaBloqueoNivel />;
    }

    // Si tiene el nivel correcto, lo dejamos pasar
    return <Outlet />;
};

export default NivelGuard;