import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

const PublicLayout = () => {
  // 1. El estado inicial ahora lee qué decidió el script del index.html
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  // 2. La función ahora guarda en localStorage
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light'); // Guardamos la preferencia
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark'); // Guardamos la preferencia
      setIsDark(true);
    }
  };
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 p-4 flex justify-between items-center sticky top-0 z-50 transition-colors duration-300">
        
        <h1 className="title-fan text-2xl md:text-4xl">
          AUTÓDROMO RAFAELA
        </h1>
        
        <nav className="hidden md:flex space-x-6 text-sm font-bold items-center text-slate-600 dark:text-slate-300 uppercase tracking-wider">
          <Link to="/" className="hover:text-sky-500 transition-colors">Inicio</Link>
          <Link to="/historia" className="hover:text-sky-500 transition-colors">Historia</Link>
          <Link to="/calendario" className="hover:text-sky-500 transition-colors">Calendario</Link>
          <Link to="/noticias" className="hover:text-sky-500 transition-colors">Noticias</Link>
          <Link to="/contacto" className="hover:text-sky-500 transition-colors">Contacto</Link>
          
          {/* --- BOTÓN SOL / LUNA --- */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-xl"
            title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          
          <Link 
            to="/login" 
            className="bg-sky-500 text-black px-5 py-2 rounded-md hover:bg-sky-400 transition-all font-black shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] ml-2"
          >
            LOGIN
          </Link>
        </nav>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="p-8 text-center text-slate-500 text-sm border-t border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-black/20 transition-colors duration-300">
        &copy; {new Date().getFullYear()} Autódromo Rafaela. Desarrollo por MAR digitals.
      </footer>
    </div>
  );
};

export default PublicLayout;