import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { Flag } from 'lucide-react';

// --- 1. Subcomponente para la pantalla de Bloqueo ---
const PantallaBloqueo = () => {
  const [segundos, setSegundos] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    // Le restamos 1 al contador cada segundo
    const intervalo = setInterval(() => {
      setSegundos((prev) => prev - 1);
    }, 1000);

    // A los 5 segundos exactos, lo pateamos al dashboard
    const redireccion = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 5000);

    // Limpiamos los motores por si el usuario se va a otra página antes de los 5 seg
    return () => {
      clearInterval(intervalo);
      clearTimeout(redireccion);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 animate-in fade-in zoom-in duration-500">
      <div className="bg-red-500/10 p-6 rounded-full mb-6 border-2 border-red-500/20">
        <Flag className="text-red-500" size={64} />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white uppercase tracking-tighter mb-4">
        ¡Bandera Negra!
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mb-8">
        Acceso denegado. Tu credencial actual no tiene los permisos necesarios para ingresar.
      </p>
      <div className="bg-slate-100 dark:bg-white/5 px-8 py-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg">
        <p className="text-institucional-celeste font-bold text-lg animate-pulse flex items-center gap-2">
          Volviendo a la pista en {segundos}...
        </p>
      </div>
    </div>
  );
};

// --- 2. El Guardián Principal ---
interface RoleGuardProps {
  allowedRoles: string[];
}

const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const { userProfile, isLoading } = useAuth();

  if (isLoading) return <FullScreenLoader />;

  const rol = userProfile?.rol?.toLowerCase() || 'fan';

  if (!allowedRoles.includes(rol)) {
    console.warn(`Bandera Negra: Acceso denegado. Rol '${rol}' intentó acceder a ruta restringida.`);
    
    // En vez de redirigir de golpe con <Navigate />, mostramos la pantalla con el temporizador
    return <PantallaBloqueo />;
  }

  return <Outlet />;
};

export default RoleGuard;