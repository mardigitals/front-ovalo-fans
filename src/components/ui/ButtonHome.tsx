import { ChevronLeft, Home } from "lucide-react";

const ButtonHome = () => {
    const handleClick = () => {
        window.location.href = '/';
    }
    
    return (
        <div className="fixed bottom-6 right-6 z-50">
        <button 
            onClick={handleClick} 
            className="flex items-center mt-2 gap-3 text-slate-600 dark:text-institucional-gris w-full px-4 py-1 rounded-lg glass-neon-btn group"
          >
            <ChevronLeft size={20} className="group-hover:text-institucional-celeste transition-colors" />
            <Home size={20} className="group-hover:text-institucional-celeste transition-colors" />
            <span className="font-small transition-colors">Inicio</span>
        </button>
        </div>
    );
};

export default ButtonHome;