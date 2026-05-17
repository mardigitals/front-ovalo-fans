import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Flag, Gauge, XCircle, Wrench, Wallet2 } from 'lucide-react';

const PitStopOverlay = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [accesoPermitido, setAccesoPermitido] = useState<boolean | null>(null);
  const [estadoSuscripcion, setEstadoSuscripcion] = useState<string>('');

  useEffect(() => {
    const verificarPase = async () => {
      const rol = userProfile?.rol?.toLowerCase();
      if (['superadmin', 'administrativo', 'prensa'].includes(rol || '')) {
        setAccesoPermitido(true);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/suscripcion/verificar-pase', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('El backend no respondió con éxito');

        const data = await response.json();
        setAccesoPermitido(data.acceso_permitido);
        setEstadoSuscripcion(data.estado_suscripcion);
      } catch (error) {
        console.error("Error al verificar el pase:", error);
        setAccesoPermitido(false);
        setEstadoSuscripcion('Error');
      }
    };

    if (userProfile) {
      verificarPase();
    }
  }, [userProfile]);

  if (accesoPermitido === null || accesoPermitido === true) return null;
  if (location.pathname.includes('/dashboard/cuentas')) return null;

  return (
    // VOLVEMOS AL ABSOLUTE: Solo tapa el contenedor padre (el <main>)
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#050308]/90 backdrop-blur-md p-4 transition-all duration-300 rounded-l-2xl md:rounded-none">
      
      {/* Fondo decorativo de pista */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="tracks" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="10" height="100" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#tracks)" transform="rotate(45, 0, 0)" />
        </svg>
      </div>

      <div className="relative bg-white dark:bg-[#110c1b] border-4 border-slate-900 dark:border-black rounded-3xl max-w-xl w-full p-1 text-center shadow-[0_0_60px_-15px] shadow-institucional-celeste/40 overflow-hidden transform transition-all duration-500 scale-100 rotate-0 m-4">
        
        {/* Encabezado con patrón de bandera a cuadros */}
        <div className="relative bg-black h-16 w-full rounded-t-2xl flex items-center justify-center gap-3 border-b-4 border-institucional-celeste overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="checkered" width="20" height="20" patternUnits="userSpaceOnUse">
                        <rect width="10" height="10" fill="white" />
                        <rect x="10" y="10" width="10" height="10" fill="white" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#checkered)" />
                </svg>
            </div>
            {estadoSuscripcion === 'Pendiente' ? (
                <>
                <Wrench className="text-yellow-400 relative z-10" size={32} />
                <h2 className="text-2xl font-extrabold text-white uppercase relative z-10 font-sans tracking-tighter">Pit Stop Obligatorio</h2>
                </>
            ) : (
                <>
                <Flag className="text-red-500 relative z-10" size={32} />
                <h2 className="text-2xl font-extrabold text-white uppercase relative z-10 font-sans tracking-tighter">Bandera Negra</h2>
                </>
            )}
        </div>

        <div className="p-8">
            <div className="flex justify-center items-center gap-4 mb-8">
                <div className="p-1 border-2 border-slate-300 dark:border-white/10 rounded-full hidden sm:block">
                    <Gauge className="text-slate-500 dark:text-white/30" size={32}/>
                </div>
                {estadoSuscripcion === 'Pendiente' ? (
                  <Wrench className="text-yellow-600 dark:text-yellow-400 p-2 bg-yellow-100 dark:bg-yellow-500/20 rounded-full" size={80}/>
                ) : (
                  <XCircle className="text-red-600 dark:text-red-400 p-2 bg-red-100 dark:bg-red-500/20 rounded-full" size={80}/>
                )}
                <div className="p-1 border-2 border-slate-300 dark:border-white/10 rounded-full hidden sm:block">
                    <Gauge className="text-slate-500 dark:text-white/30" size={32}/>
                </div>
            </div>

            {estadoSuscripcion === 'Pendiente' ? (
              <p className="subtitle-fan text-lg text-slate-800 dark:text-slate-200 mb-8 max-w-sm mx-auto">
                Estás parado en boxes. Falta la confirmación de pago para volver a pista.
              </p>
            ) : (
              <p className="subtitle-fan text-lg text-slate-800 dark:text-slate-200 mb-8 max-w-sm mx-auto">
                Tu suscripción está vencida o cancelada. Renovala ahora para volver a pista y no perderte ni una vuelta.
              </p>
            )}

            <button 
              onClick={() => navigate('/dashboard/cuentas')}
              className="group w-full bg-institucional-celeste hover:bg-white text-white hover:text-institucional-celeste font-extrabold text-lg py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 border-2 border-institucional-celeste shadow-lg shadow-institucional-celeste/20 hover:shadow-xl hover:scale-[1.02]"
            >
              <Wallet2 size={24}/>
              Ir a Mi Billetera y Pagar la Cuota
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-600 mt-4 block">(Solo en boxes se puede pagar)</span>
        </div>
      </div>
    </div>
  );
};

export default PitStopOverlay;