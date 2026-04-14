import { Outlet, Link } from 'react-router-dom';
import { Home, Map, Users, Settings, LogOut } from 'lucide-react';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-[#08060d] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tighter text-institucional-celeste">
            ÓVALO FANS
          </h2>
          <p className="text-[10px] text-institucional-gris uppercase tracking-widest">Club Atlético Rafaela</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem to="/" icon={<Home size={20} />} label="Inicio" />
          <SidebarItem to="/mapa" icon={<Map size={20} />} label="Mapa" />
          <SidebarItem to="/socios" icon={<Users size={20} />} label="Socios" />
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 text-institucional-gris w-full px-4 py-2 rounded-lg glass-neon-btn group">
            <LogOut size={20} />
            <span>Salir</span>
          </button>
        </div>
      </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 relative bg-[#08060d]">
            {/* Esta es la luz neón de fondo que el Sidebar va a desenfocar */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-institucional-celeste/10 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="max-w-6xl text-white mx-auto relative z-10">
                <Outlet />
            </div>
        </main>
    </div>
  );
};

const SidebarItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-3 rounded-lg text-institucional-gris glass-neon-btn group"
  >
    <span className="transition-colors">{icon}</span>
    <span className="font-medium">{label}</span>
  </Link>
);

export default DashboardLayout;