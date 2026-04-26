import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // <-- Importamos los íconos

const PublicLayout = () => {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [isMenuOpen, setIsMenuOpen] = useState(false); // <-- Estado para el menú móvil

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
      setIsDark(true);
    }
  };

  // Función para cerrar el menú al hacer clic en un link
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 p-4 sticky top-0 z-50 transition-colors duration-300">
        
        <div className="flex justify-between items-center w-full">
          <h1 className="title-fan text-2xl md:text-4xl">
           <img src="/public/logo-autodromo-horizontal-color.png" alt="Logo Autódromo" className="h-10 md:h-16" />
          </h1>
          
          {/* NAV DE ESCRITORIO (Se oculta en móviles con md:flex) */}
          <nav className="hidden md:flex space-x-6 text-sm font-bold items-center text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            <Link to="/" className="hover:text-sky-500 transition-colors">Inicio</Link>
            <Link to="/historia" className="hover:text-sky-500 transition-colors">Historia</Link>
            <Link to="/calendario" className="hover:text-sky-500 transition-colors">Calendario</Link>
            <Link to="/noticias" className="hover:text-sky-500 transition-colors">Noticias</Link>
            <Link to="/contacto" className="hover:text-sky-500 transition-colors">Contacto</Link>
            
            <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-xl">
              {isDark ? '☀️' : '🌙'}
            </button>
            
            <Link to="/login" className="bg-sky-500 text-black px-5 py-2 rounded-md hover:bg-sky-400 transition-all font-black shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] ml-2">
              LOGIN
            </Link>
          </nav>

          {/* BOTÓN HAMBURGUESA PARA MÓVILES (Se oculta en PC) */}
          <button 
            className="md:hidden text-slate-600 dark:text-slate-300 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MENÚ DESPLEGABLE MÓVIL */}
        {isMenuOpen && (
          <nav className="md:hidden flex flex-col mt-4 space-y-4 pb-4 pt-4 border-t border-slate-200 dark:border-white/10 text-center font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider animate-in slide-in-from-top-2">
            <Link to="/" onClick={closeMenu} className="hover:text-sky-500 transition-colors">Inicio</Link>
            <Link to="/historia" onClick={closeMenu} className="hover:text-sky-500 transition-colors">Historia</Link>
            <Link to="/calendario" onClick={closeMenu} className="hover:text-sky-500 transition-colors">Calendario</Link>
            <Link to="/noticias" onClick={closeMenu} className="hover:text-sky-500 transition-colors">Noticias</Link>
            <Link to="/contacto" onClick={closeMenu} className="hover:text-sky-500 transition-colors">Contacto</Link>
            
            <div className="flex justify-center py-2">
              <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-100 dark:bg-white/5 transition-colors text-xl">
                {isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
              </button>
            </div>
            
            <div className="px-4">
              <Link to="/login" onClick={closeMenu} className="block w-full bg-sky-500 text-black px-5 py-3 rounded-md font-black shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                LOGIN
              </Link>
            </div>
          </nav>
        )}
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