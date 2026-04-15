import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

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
      // Si tu Nest NO tiene setGlobalPrefix('api'), quita el /api de la config de axios
      const response = await api.post('/usuario-auth/login', { 
        email, 
        contrasena: password
      });
      
      localStorage.setItem('token', response.data.access_token);
      navigate('/'); 
      
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error de conexión';
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08060d] text-white flex flex-col items-center justify-center p-4">
      {/* Botón para volver al inicio */}
      <Link to="/" className="mb-8 text-stone-500 hover:text-cyan-400 transition-colors text-sm">
        ← Volver al inicio
      </Link>

      {/* Card con Efecto Glass */}
      <div className="w-full max-w-md p-8 space-y-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-cyan-500/20">
        <div>
          <h2 className="text-center text-4xl font-extrabold text-cyan-400 tracking-tight">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-stone-400">
            Accede a la plataforma de Óvalo Fans
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <input 
              type="email" 
              required 
              className="w-full px-4 py-3 border border-white/10 bg-white/[0.03] rounded-t-md focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder:text-stone-600" 
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" 
              required 
              className="w-full px-4 py-3 border border-white/10 bg-white/[0.03] rounded-b-md focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder:text-stone-600" 
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center bg-red-500/10 py-2 rounded border border-red-500/20">
              {error}
            </p>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 px-4 font-bold rounded-md text-black bg-cyan-400 hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:bg-stone-700 disabled:text-stone-500 transition-all uppercase tracking-wider"
          >
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-stone-500 text-sm">
            ¿No tienes cuenta? <span className="text-cyan-500 cursor-not-allowed">Contacta al club</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;