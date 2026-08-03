import { Gauge } from "lucide-react";
import logo from "@/assets/icons/logo-autodromo-negro.png";
import logoDark from "@/assets/icons/logo-autodromo-blanco.png";

const Footer = () => {
    return (

        <footer className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4 text-slate-500 dark:text-slate-400 font-medium italic pb-8 pt-4 text-sm font-firma w-full">
            <div className="flex items-center gap-2">
                <Gauge size={20} className="text-institucional-celeste" /> templo de la velocidad 
            </div>
            <div className="hidden md:block w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
            <div className="flex items-center gap-2">
                <img src={logo} alt="Logo Autódromo" className="h-5 w-auto dark:hidden opacity-70" />
                <img src={logoDark} alt="Logo Autódromo" className="h-5 w-auto hidden dark:block opacity-70" />
            </div>
        </footer>
    )
};

export default Footer;

