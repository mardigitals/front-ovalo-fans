import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Key, Trash2, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

const MiCuentaPage = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  
  // Guardamos el email real que viene de la Base de Datos
  const [emailReal, setEmailReal] = useState<string>('');

  // Estados para Borrar Cuenta
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estados para Cambiar Contraseña
  const [resetStatus, setResetStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

// --- TRAEMOS EL EMAIL DE LA BASE DE DATOS AL ENTRAR ---
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const resPerfil = await fetch('http://localhost:3000/usuario-auth/perfil', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const datosCompletos = await resPerfil.json();
        setEmailReal(datosCompletos.email || 'Email no encontrado');

      } catch (error) {
        console.error('Error al cargar la cuenta:', error);
      }
    };
    fetchEmail();
  }, []);

  // --- FUNCIÓN 1: PEDIR CAMBIO DE CONTRASEÑA ---
  const handlePasswordReset = async () => {
    // Si todavía no cargó el email o dio error, no hacemos nada
    if (!emailReal || emailReal === 'Email no encontrado') return;
    
    setResetStatus('loading');
    try {
      const response = await fetch('http://localhost:3000/usuario-auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailReal }) // <--- Mandamos el email real
      });

      if (response.ok) {
        setResetStatus('success');
        setTimeout(() => setResetStatus('idle'), 5000);
      } else {
        setResetStatus('error');
      }
    } catch (error) {
      console.error(error);
      setResetStatus('error');
    }
  };

  // --- FUNCIÓN 2: BORRAR CUENTA ---
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/usuario-auth/delete-account', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        handleLogout();
        navigate('/');
      } else {
        console.error("Error al borrar cuenta");
        setIsDeleting(false);
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white uppercase tracking-tighter">Configuración de Cuenta</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tarjeta de Seguridad */}
        <div className="bg-white dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-institucional-celeste/10 text-institucional-celeste rounded-xl">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Seguridad y Acceso</h2>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Email principal</p>
            <p className="font-medium text-slate-900 dark:text-white">
              {emailReal ? emailReal : 'Cargando...'}
            </p>
          </div>

          <button 
            onClick={handlePasswordReset}
            disabled={resetStatus === 'loading' || resetStatus === 'success' || !emailReal}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors font-medium ${
              resetStatus === 'success' 
                ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' 
                : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white'
            }`}
          >
            {resetStatus === 'idle' && <><Key size={18} /> Solicitar Cambio de Contraseña</>}
            {resetStatus === 'loading' && 'Enviando email...'}
            {resetStatus === 'success' && <><CheckCircle2 size={18} /> ¡Revisá tu correo!</>}
            {resetStatus === 'error' && 'Error al enviar. Reintentar.'}
          </button>
          {resetStatus === 'success' && (
            <p className="text-xs text-center text-slate-500 mt-2">
              Te enviamos un enlace seguro a tu casilla.
            </p>
          )}
        </div>

        {/* Tarjeta de Zona de Riesgo */}
        <div className="bg-white dark:bg-[#110c1b] border border-red-200 dark:border-red-900/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-800"></div>
          
          <div className="flex items-center gap-3 mb-6 mt-2">
            <div className="p-3 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 rounded-xl">
              <AlertTriangle size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Zona de Boxes (Peligro)</h2>
          </div>
          
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
            Eliminar tu cuenta es una acción permanente. Perderás tu historial de pagos, tu antigüedad y todos tus beneficios.
          </p>

          <button 
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl transition-colors font-bold"
          >
            <Trash2 size={18} /> Dar de baja mi cuenta
          </button>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#110c1b] border border-red-500/30 rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
            <AlertTriangle size={60} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">¿Bandera Negra Definitiva?</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Estás a punto de abandonar la pista. Tus datos, suscripciones y beneficios se perderán para siempre. ¿Estás absolutamente seguro?
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white font-bold py-3 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center"
              >
                {isDeleting ? 'Procesando...' : 'Sí, eliminar cuenta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiCuentaPage;