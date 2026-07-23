import { Car, Phone, ArrowRight, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

const PruebasPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] p-4 animate-in fade-in duration-500">
      
      {/* TARJETA PRINCIPAL (Estilo Glassmorphism basado en tu Modal) */}
      <div className="w-full max-w-xl bg-white/90 dark:bg-[#08060d]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl relative p-8 text-center overflow-hidden">
        
        {/* Decoración de fondo sutil */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Íconos de encabezado */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
            <Wrench size={32} />
          </div>
          <div className="w-20 h-20 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.2)]">
            <Car size={40} />
          </div>
        </div>

        {/* Título */}
        <div className="mb-6 border-b border-slate-200 dark:border-white/10 pb-6">
          <h1 className="title-fan text-3xl text-slate-800 dark:text-white mb-3">
            ¡BOXES EN PREPARACIÓN!
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
            Próximamente podrás reservar tu prueba de <strong className="text-sky-500 font-bold">auto, moto o kart</strong> directamente por la app.
          </p>
        </div>

        {/* Caja de Contacto */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5">
          <Phone size={24} className="text-slate-400" />
          <span className="text-slate-700 dark:text-slate-300 font-medium text-center sm:text-left">
            Para más info comunicate al{' '}
            <a href="tel:3492123456" className="font-bold text-sky-500 hover:text-sky-400 hover:underline transition-colors">
              3492-123456
            </a>
          </span>
        </div>

        {/* BOTÓN DE ACCIÓN (Estilo Sky tomado de tu código) */}
        <Link 
          to="/dashboard/beneficios" // <-- Asegurate de que esta sea la ruta correcta en tu AppRoutes
          className="flex items-center justify-center gap-3 py-4 px-6 bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 border border-sky-500/50 rounded-xl transition-all duration-300 font-black group hover:scale-[1.02]"
        >
          ¿QUERÉS CONOCER QUÉ OTROS BENEFICIOS TENÉS?
          <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        
      </div>
    </div>
  );
};

export default PruebasPage;