import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Map, Users, LogOut, Menu, X, Shield, Camera, Star, Ticket, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/api/axios'; 

const DashboardLayout = () => {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Estados de seguridad y perfil
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // 1. Verificación de seguridad al entrar
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/usuario-auth/perfil');
        setUserProfile(response.data);
      } catch (error) {
        console.error("Acceso denegado o token expirado", error);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // 2. Lógica del Botón Salir
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // 3. Cambio de Tema (Sol/Luna)
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

  // --- PANTALLA DE CARGA ---
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#08060d]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-institucional-celeste/20 border-t-institucional-celeste rounded-full animate-spin"></div>
          <p className="text-sky-500 animate-pulse font-black tracking-widest uppercase text-sm">
            Verificando credenciales...
          </p>
        </div>
      </div>
    );
  }

  // 4. Lógica de Menú Dinámico
  const rol = userProfile?.rol || 'Fan'; 
  const nivelFan = userProfile?.nivelFan || 'P3'; 

  const getNavItems = () => {
    const items = [];

    // Todos ven el Inicio
    items.push({ to: '/dashboard', icon: <Home size={20} />, label: 'Inicio' });

    if (rol === 'fan') {
      items.push({ to: '/dashboard/mapa', icon: <Map size={20} />, label: 'Mapa Interactivo' });
      
      if (nivelFan === 'P1' || nivelFan === 'P2') {
        items.push({ to: '/dashboard/fast-pass', icon: <Ticket size={20} />, label: 'Fast Access' });
      }
      if (nivelFan === 'P1') {
        items.push({ to: '/dashboard/vip', icon: <Star size={20} />, label: 'VIP Boxes' });
      }
    } else {
      // Menú STAFF
      if (rol === 'SuperAdmin' || rol === 'Administrativo') {
        items.push({ to: '/dashboard/socios', icon: <Users size={20} />, label: 'Gestión Socios' });
      }
      if (rol === 'SuperAdmin' || rol === 'Prensa') {
        items.push({ to: '/dashboard/prensa', icon: <Camera size={20} />, label: 'Prensa y Medios' });
      }
      if (rol === 'SuperAdmin') {
        items.push({ to: '/dashboard/config', icon: <Settings size={20} />, label: 'Configuración' });
        items.push({ to: '/dashboard/seguridad', icon: <Shield size={20} />, label: 'Seguridad' });
      }
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#08060d] font-sans">
      
      {/* Overlay Oscuro en Móviles */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* SIDEBAR LATERAL */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white/90 dark:bg-black/80 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 flex flex-col transition-transform duration-300 z-50 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="p-6 flex justify-between items-center">
          <div>
            <h2 className="subtitle-fan text-xl">ÓVALO FANS</h2>
            <p className="text-[10px] text-slate-500 dark:text-institucional-gris uppercase tracking-widest mt-1">
              Club Atlético Rafaela
            </p>
          </div>
          <button className="md:hidden text-slate-500 dark:text-slate-400 p-1" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* ETIQUETA VISUAL DEL ROL / NIVEL */}
        <div className="px-6 pb-2">
          <span className="inline-block px-3 py-1 bg-institucional-celeste/10 border border-institucional-celeste/20 rounded-full text-[10px] font-black text-institucional-celeste uppercase tracking-widest">
            {rol === 'fan' ? `Socio Nivel ${nivelFan}` : `Staff: ${rol}`}
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
              onClick={() => setIsSidebarOpen(false)} 
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

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto relative flex flex-col h-screen">
        
        {/* Cabecera Móvil */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-md z-10 sticky top-0">
           <h2 className="subtitle-fan text-lg">ÓVALO FANS</h2>
           <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 dark:text-slate-300 p-1">
             <Menu size={28} />
           </button>
        </header>

        {/* Luz neón de fondo (blur) */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-institucional-celeste/20 dark:bg-institucional-celeste/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300" />
        
        {/* Renderizado de las vistas hijas (pasando el userProfile como contexto) */}
        <div className="p-4 md:p-8 max-w-6xl mx-auto relative z-10 text-slate-900 dark:text-white transition-colors duration-300 w-full h-full">
            <Outlet context={{ userProfile }} />
        </div>
      </main>
    </div>
  );
};

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
export default DashboardLayout;