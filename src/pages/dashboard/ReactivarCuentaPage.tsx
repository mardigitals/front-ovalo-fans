import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import api from '@/api/axios'; // Ajustá la ruta según tu configuración

const ReactivarCuentaPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [mensaje, setMensaje] = useState('Reactivando tu cuenta...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMensaje('Token inválido o ausente.');
      return;
    }

    const reactivar = async () => {
      try {
        // Hacemos el PATCH al backend enviando el token en el body
        const response = await api.patch('/usuario-auth/restore-account', { token });
        setStatus('success');
        setMensaje(response.data.message || '¡Cuenta reactivada con éxito!');
        
        // Redirigimos al login después de 3 segundos
        setTimeout(() => navigate('/login'), 3000);
      } catch (error: any) {
        setStatus('error');
        setMensaje(error.response?.data?.message || 'Hubo un error al reactivar la cuenta. El enlace puede haber expirado.');
      }
    };

    reactivar();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#08060d] p-4">
      <div className="max-w-md w-full bg-white dark:bg-[#110c1b] p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl text-center">
        
        {status === 'loading' && (
          <div className="flex flex-col items-center text-sky-500 animate-pulse">
            <Loader2 size={48} className="animate-spin mb-4" />
            <h2 className="text-xl font-bold">Procesando solicitud...</h2>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center text-green-500 animate-in zoom-in duration-300">
            <CheckCircle2 size={64} className="mb-4" />
            <h2 className="text-2xl font-black mb-2 uppercase">¡Bienvenido de vuelta!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{mensaje}</p>
            <p className="text-sm text-slate-400">Redirigiendo al login...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center text-red-500 animate-in zoom-in duration-300">
            <AlertTriangle size={64} className="mb-4" />
            <h2 className="text-2xl font-black mb-2 uppercase">Error de Reactivación</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{mensaje}</p>
            <Link to="/login" className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold w-full hover:bg-slate-700 transition-colors">
              Volver al Inicio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReactivarCuentaPage;