import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { useAuth } from '@/hooks/useAuth';
import PitStopOverlay from '@/components/auth/PitStopOverlay';
import logoAutodromo from '@/assets/icons/logo-autodromo-color.png';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { userProfile, isLoading } = useAuth(); 

  if (isLoading) return <FullScreenLoader />; 

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#08060d] font-sans">
      
      {/* Sidebar encapsulado */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
      />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto relative flex flex-col h-screen">
        
        <PitStopOverlay />
        {/* Cabecera Móvil */}
        <header className="md:hidden sticky top-0 z-40 flex items-center justify-between p-4 bg-white/80 dark:bg-[#08060d]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10">
           <img src={logoAutodromo} alt="Logo Autódromo Rafaela" className="h-6 md:h-16 opacity-80" />
           <h2 className="subtitle-fan text-lg">Óvalo Fans</h2>
           <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 dark:text-slate-300 p-1">
             <Menu size={28} />
           </button>
        </header>

        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-institucional-celeste/20 dark:bg-institucional-celeste/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300" />
        
        <div className="p-4 md:p-8 max-w-6xl mx-auto relative z-10 text-slate-900 dark:text-white transition-colors duration-300 w-full h-full">
            <Outlet context={{ userProfile }} />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;