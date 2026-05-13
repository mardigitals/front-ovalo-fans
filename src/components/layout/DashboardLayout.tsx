import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { useAuth } from '@/hooks/useAuth';

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
        
        {/* Cabecera Móvil */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-md z-10 sticky top-0">
           <h2 className="subtitle-fan text-lg">ÓVALO FANS</h2>
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