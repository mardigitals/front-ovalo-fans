import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; 
import logo from '@/assets/icons/logo-autodromo-color.png';
import logoMar from '@/assets/icons/MAR negro sin fondo.png';
import logoDark from '@/assets/icons/MAR blanco sin fondo.png';
import { useTheme } from '@/hooks/useTheme';

// Arreglo para no repetir código en el menú de escritorio y móvil
const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/historia', label: 'Historia' },
  { to: '/calendario', label: 'Calendario' },
  { to: '/noticias', label: 'Noticias' },
  { to: '/contacto', label: 'Contacto' }
];

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  // Función para cerrar el menú al hacer clic en un link
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-black/20 backdrop-blur-xl border-b border-white/5 p-4 transition-colors duration-300">        
        <div className="flex justify-between items-center w-full">
          <h1 className="title-fan text-2xl md:text-4xl">
            <img src={logo} alt="Logo Autódromo" className="h-6 md:h-16" />
          </h1>
          
          {/* NAV DE ESCRITORIO (Se oculta en móviles con md:flex) */}
          <nav className="hidden md:flex space-x-6 text-sm font-bold items-center text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-sky-500 transition-colors">
                {link.label}
              </Link>
            ))}
            
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
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={closeMenu} className="hover:text-sky-500 transition-colors">
                {link.label}
              </Link>
            ))}
            
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
      
      <footer className="pt-3 justify-center text-center text-slate-500 text-sm border-t border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-black/20 transition-colors duration-300">
        &copy; {new Date().getFullYear()} Autódromo Rafaela.  Todos los derechos reservados. 
        <p className="flex items-center justify-center gap-2">
          Desarrollado por 
          <img src={logoMar} alt="Logo MAR digitals" className="h-20 w-auto dark:hidden" />
          <img src={logoDark} alt="Logo MAR digitals" className="h-20 w-auto hidden dark:block" />
        </p>
      </footer>
    </div>
  );
}
export default PublicLayout;