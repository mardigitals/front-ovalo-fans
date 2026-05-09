import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '@/api/axios';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Atrapamos el token de la URL (ej: localhost:5173/reset-password?token=12345)
  const token = searchParams.get('token');

  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Enlace inválido o expirado. Solicitá uno nuevo.');
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/usuario-auth/reset-password', { 
        token, 
        nuevaContrasena 
      });
      setSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al restaurar la contraseña. El enlace puede haber expirado.';
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl dark:shadow-sky-500/20">
        
        <h2 className="title-fan text-center text-4xl">Nueva Clave</h2>
        
        {!token ? (
           <div className="text-center space-y-4">
             <p className="text-red-500 font-bold p-4 bg-red-500/10 rounded-md">Error: No se encontró el token de seguridad en el enlace.</p>
             <Link to="/login" className="text-sky-500 font-bold block mt-4">Ir al Login</Link>
           </div>
        ) : success ? (
          <div className="text-center space-y-6">
            <div className="bg-green-500/10 text-green-500 border border-green-500/20 p-4 rounded-lg font-bold">
              ¡Contraseña actualizada con éxito!
            </div>
            <p className="text-fan text-sm">Ya podés volver a las pistas con tus nuevas credenciales.</p>
            <button onClick={() => navigate('/login')} className="w-full py-4 font-black rounded-lg text-black bg-sky-500 hover:bg-sky-400 transition-all uppercase tracking-widest text-lg">
              Iniciar Sesión
            </button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="label-fan">Nueva Contraseña</label>
                <input 
                  type="password" 
                  required 
                  className="input-fan" 
                  placeholder="Mín. 8, Mayúscula y Especial" 
                  value={nuevaContrasena} 
                  onChange={(e) => setNuevaContrasena(e.target.value)}
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$" 
                  title="Debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial" 
                />
              </div>
              <div>
                <label className="label-fan">Repetir Nueva Contraseña</label>
                <input 
                  type="password" 
                  required 
                  className="input-fan" 
                  placeholder="Repetir contraseña" 
                  value={confirmarContrasena} 
                  onChange={(e) => setConfirmarContrasena(e.target.value)} 
                />
              </div>
            </div>

            {error && (
              <p className="text-sm font-bold text-red-500 text-center bg-red-500/10 py-3 rounded-md border border-red-500/20">
                {error}
              </p>
            )}

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-4 font-black rounded-lg text-black bg-sky-500 hover:bg-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all uppercase tracking-widest text-lg disabled:opacity-50"
            >
              {isLoading ? 'Actualizando...' : 'Guardar y Entrar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;