import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Users, User, LogOut, X, Shield, Camera, Star, Ticket, Settings, PercentIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme'; // <-- Importamos el hook

// 1. Subcomponente para los botones del menú
const SidebarItem = ({ to, icon, label, isActive, onClick }: { to: string; icon: React.ReactNode; label: string; isActive?: boolean; onClick?: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 glass-neon-btn group ${
      isActive ? 'bg-institucional-celeste/10 text-institucional-celeste border-institucional-celeste/30' : 'text-slate-600 dark:text-institucional-gris'
    }`}
  >
    <span className={`${isActive ? 'text-institucional-celeste' : 'group-hover:text-institucional-celeste'} transition-colors duration-300`}>{icon}</span>
    <span className="font-medium transition-colors duration-300">{label}</span>
  </Link>
);

// Definimos qué "props" va a recibir el Sidebar desde el Layout principal
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
  const { userProfile, handleLogout } = useAuth();
  const { isDark, toggleTheme } = useTheme(); // <-- Instanciamos el hook acá y borramos toda la lógica vieja
  
  // Variables de seguridad
  const rol = userProfile?.rol?.toLowerCase() || 'fan'; 
  const nivelFan = userProfile?.nivelFan || 'P3'; 

  // Generador dinámico de los items del menú
  const getNavItems = () => {
    const items = [];

    items.push({ to: '/dashboard', icon: <Home size={20} />, label: 'Inicio' });
    items.push({ to: '/dashboard/perfil', icon: <User size={20} />, label: 'Mi Perfil' });
    items.push({ to: '/dashboard/beneficios', icon: <PercentIcon size={20} />, label: 'Beneficios y Descuentos' });

    if (rol === 'fan') {
      items.push({ to: '/dashboard/mapa', icon: <Map size={20} />, label: 'Mapa Interactivo' });
      
      if (nivelFan === 'P1' || nivelFan === 'P2') {
        items.push({ to: '/dashboard/fast-pass', icon: <Ticket size={20} />, label: 'Fast Access' });
      }
      if (nivelFan === 'P1') {
        items.push({ to: '/dashboard/vip', icon: <Star size={20} />, label: 'VIP Boxes' });
      }
    } else {
      if (rol === 'superadmin' || rol === 'administrativo') {
        items.push({ to: '/dashboard/socios', icon: <Users size={20} />, label: 'Gestión Socios' });
      }
      if (rol === 'superadmin' || rol === 'prensa') {
        items.push({ to: '/dashboard/prensa', icon: <Camera size={20} />, label: 'Prensa y Medios' });
      }
      if (rol === 'superadmin') {
        items.push({ to: '/dashboard/config', icon: <Settings size={20} />, label: 'Configuración' });
        items.push({ to: '/dashboard/seguridad', icon: <Shield size={20} />, label: 'Seguridad' });
      }
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Overlay Oscuro en Móviles */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* SIDEBAR LATERAL */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white/90 dark:bg-black/80 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 flex flex-col transition-transform duration-300 z-50 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="p-6 flex justify-between items-center">
          <div>
            <h2 className="subtitle-fan text-xl">ÓVALO FANS</h2>
            <p className="text-[10px] text-slate-500 dark:text-institucional-gris uppercase tracking-widest mt-1">
              Club Atlético Rafaela
            </p>
          </div>
          <button className="md:hidden text-slate-500 dark:text-slate-400 p-1" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* ETIQUETA VISUAL DEL ROL / NIVEL */}
        <div className="px-6 pb-2">
          <span className="inline-block px-3 py-1 bg-institucional-celeste/10 border border-institucional-celeste/20 rounded-full text-[10px] font-black text-institucional-celeste uppercase tracking-widest">
            {rol === 'fan' ? `Socio Nivel ${nivelFan}` : `Staff: ${userProfile?.rol}`}
          </span>
        </div>

        {/* MENÚ DE NAVEGACIÓN */}
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {navItems.map((item, index) => (
            <SidebarItem 
              key={index} 
              to={item.to} 
              icon={item.icon} 
              label={item.label} 
              isActive={location.pathname === item.to} 
              onClick={() => setIsOpen(false)} 
            />
          ))}
        </nav>

        {/* BOTONES INFERIORES */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 flex flex-col gap-4">
          <div className="flex justify-center">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-xl"
              title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>

          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 text-slate-600 dark:text-institucional-gris w-full px-4 py-3 rounded-lg glass-neon-btn group"
          >
            <LogOut size={20} className="group-hover:text-institucional-celeste transition-colors" />
            <span className="font-medium transition-colors">Salir</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;