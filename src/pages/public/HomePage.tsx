import { Link } from 'react-router-dom';
import heroImage from '@/assets/images/hero-image.png';
import { Gauge } from 'lucide-react';
import logo from '@/assets/icons/logo-autodromo-negro.png';
import logoDark from '@/assets/icons/logo-autodromo-blanco.png';

const HomePage = () => (
  <main className="flex flex-col min-h-screen bg-white dark:bg-[#08060d] transition-colors duration-300">
    
    {/* image hero */}
    <header className="relative w-full h-[40vh] md:h-screen flex-shrink-0 overflow-hidden bg-gradient-to-r from-transparent via-white/20 to-transparent">
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Pista del Autódromo de Rafaela" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-[#08060d]" />
      </div>
    </header>  

    {/* <section> */}
    <section className="relative z-10 flex flex-col items-center text-center px-6 py-16 md:py-24 max-w-4xl mx-auto">
      
      <h2 className="title-fan text-center text-4xl md:text-5xl">
        ¡VIVE LA PASIÓN!
      </h2>
      
      {/* <article> */}
      <div className="space-y-8 mb-12">
        <h3 className="subtitle-fan text-xl md:text-2xl leading-relaxed text-slate-800 dark:text-slate-200">
          Bienvenido a <em className="text-institucional-celeste not-italic">ÓVALO FANS,</em> tu espacio para vivir la historia y la emoción del automovilismo.
        </h3>
        
        {/* Fondo sutil adaptado a ambos modos */}
        <div className="p-6 rounded-2xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 backdrop-blur-sm">
            <p className="text-slate-600 dark:text-slate-300 font-medium italic mb-2">
                ¡Elegí la membresía que más se adapte a vos!
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
                Convertite en un <span className="text-institucional-celeste font-black tracking-tighter">P1 · P2 · P3</span> FAN, 
                accedé a contenido exclusivo y disfrutá de <em className="text-black dark:text-white not-italic font-bold">beneficios únicos.</em>
            </p>
        </div>
      </div>

      {/* Navegación de acción */}
      <nav className="flex flex-col items-center gap-8">
        <Link 
          to="/login" 
          className="py-5 px-12 font-black rounded-full text-black bg-sky-500 hover:bg-sky-400 
                    shadow-[0_0_25px_rgba(14,165,233,0.3)] hover:shadow-[0_0_45px_rgba(14,165,233,0.6)] 
                    hover:scale-105 transition-all uppercase tracking-widest text-lg"
        >
          ¡Únete a ÓVALO FANS!
        </Link>

        <Link 
          to="/terms-conditions" 
          className="text-slate-500 hover:text-sky-500 dark:text-slate-400 dark:hover:text-sky-400 transition-colors text-xs font-bold uppercase tracking-widest"
        >
          Ver términos y condiciones
        </Link>
      </nav>
    </section>

    {/* <footer> */}
    <footer className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 font-medium italic mb-2 text-sm font-firma">
      <Gauge size={20} /> templo de la velocidad 
      <img src={logo} alt="Logo Autódromo" className="h-5 w-auto dark:hidden" />
      <img src={logoDark} alt="Logo Autódromo" className="h-5 w-auto hidden dark:block" />
    </footer>
  </main>
);

export default HomePage;