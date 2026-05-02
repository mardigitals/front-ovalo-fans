import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/api/axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/usuario-auth/login', { email, contrasena: password });
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard'); 
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error de conexión';
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      
      {/* Botón volver */}
      <Link to="/" className="mb-8 text-slate-500 hover:text-sky-500 transition-colors text-sm font-medium">
        ← Volver al inicio
      </Link>

      {/* 2. Tarjeta Glass adaptada para Claro y Oscuro */}
      <div className="w-full max-w-md p-8 space-y-8 bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl dark:shadow-sky-500/20">
        
        <h2 className="title-fan text-center text-4xl md:text-5xl">
          Iniciar Sesión
        </h2>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="label-fan">Email</label>
              <input 
                id="email"
                type="email" 
                required 
                className="input-fan" 
                placeholder="tu@correo.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div>
              <label htmlFor="password" className="label-fan">Contraseña</label>
              <input 
                id="password"
                type="password" 
                required 
                className="input-fan" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
          </div>

          {error && (
            <p className="text-sm font-bold text-red-500 text-center bg-red-500/10 py-3 rounded-md border border-red-500/20">
              {error}
            </p>
          )}

          {/* 5. Botón principal con el estilo Fierrero/Celeste */}
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full py-4 px-6 font-black rounded-lg text-black bg-sky-500 hover:bg-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] transition-all uppercase tracking-widest text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-200 dark:border-white/10">
          <p className="text-slate-500 text-sm">
            ¿No tienes cuenta? <Link to="/register" className="text-sky-500 hover:text-sky-400 font-black tracking-wide ml-1">REGISTRARME</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;