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
      const response = await api.post('/usuario-auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      
      // 1. Redirigimos al Dashboard tras el éxito
      navigate('/dashboard'); 
      
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error de conexión';
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08060d] text-white flex flex-col items-center justify-center p-4">
      <Link to="/" className="mb-8 text-stone-500 hover:text-cyan-400 transition-colors text-sm">
        ← Volver al inicio
      </Link>

      <div className="w-full max-w-md p-8 space-y-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-cyan-500/20">
        <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-200 tracking-tighter uppercase">Iniciar Sesión</h2>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <input type="email" required className="w-full px-4 py-3 border border-white/10 bg-white/[0.03] rounded-t-md outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" required className="w-full px-4 py-3 border border-white/10 bg-white/[0.03] rounded-b-md outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <p className="text-sm text-red-500 text-center bg-red-500/10 py-2 rounded border border-red-500/20">{error}</p>}

          <button type="submit" disabled={isLoading} className="w-full py-3 px-4 font-bold rounded-md text-black bg-cyan-400 hover:bg-cyan-500 transition-all uppercase tracking-wider">
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-stone-500 text-sm">
            ¿No tienes cuenta? <Link to="/register" className="text-cyan-500 hover:text-cyan-400 font-bold">Registrarme</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;