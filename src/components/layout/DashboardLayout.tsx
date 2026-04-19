import { Outlet, Link } from 'react-router-dom';
import { Home, Map, Users, LogOut, Menu, X } from 'lucide-react'; // <-- Agregamos Menu y X
import { useState } from 'react';

const DashboardLayout = () => {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // <-- Estado del Sidebar móvil
  
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

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#08060d]">
      
      {/* FONDO OSCURO EN MÓVILES (Click para cerrar el sidebar) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR (Oculto a la izq en móviles, fijo en PC) */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-white/90 dark:bg-black/80 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 flex flex-col transition-transform duration-300 z-50 md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex justify-between items-center">
          <div>
            <h2 className="subtitle-fan">ÓVALO FANS</h2>
            <p className="text-[10px] text-slate-500 dark:text-institucional-gris uppercase tracking-widest mt-1">
              Club Atlético Rafaela
            </p>
          </div>
          {/* Botón para cerrar sidebar (Solo móvil) */}
          <button className="md:hidden text-slate-500 dark:text-slate-400" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {/* Le pasamos la función para que se cierre el menú al tocar un link en el celular */}
          <SidebarItem to="/" icon={<Home size={20} />} label="Inicio" onClick={() => setIsSidebarOpen(false)} />
          <SidebarItem to="/mapa" icon={<Map size={20} />} label="Mapa" onClick={() => setIsSidebarOpen(false)} />
          <SidebarItem to="/socios" icon={<Users size={20} />} label="Socios" onClick={() => setIsSidebarOpen(false)} />
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-white/10 flex flex-col gap-4">
          <div className="flex justify-center">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-xl"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>

          <button className="flex items-center gap-3 text-slate-600 dark:text-institucional-gris w-full px-4 py-3 rounded-lg glass-neon-btn group">
            <LogOut size={20} className="group-hover:text-institucional-celeste transition-colors" />
            <span className="font-medium">Salir</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto relative flex flex-col h-screen">
        
        {/* CABECERA MÓVIL (Solo visible en pantallas chicas) */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-md z-10 sticky top-0">
           <h2 className="subtitle-fan text-lg">ÓVALO FANS</h2>
           <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 dark:text-slate-300 p-1">
             <Menu size={28} />
           </button>
        </header>

        {/* Luz neón de fondo */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-institucional-celeste/20 dark:bg-institucional-celeste/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300" />
        
        {/* Renderizado de las vistas hijas */}
        <div className="p-4 md:p-8 max-w-6xl mx-auto relative z-10 text-slate-900 dark:text-white transition-colors duration-300 w-full">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

// Actualizamos SidebarItem para que acepte 'onClick' opcional
const SidebarItem = ({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick?: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-institucional-gris glass-neon-btn group"
  >
    <span className="group-hover:text-institucional-celeste transition-colors duration-300">{icon}</span>
    <span className="font-medium transition-colors duration-300">{label}</span>
  </Link>
);

export default DashboardLayout;