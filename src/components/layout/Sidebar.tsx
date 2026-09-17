import NotificationBadge from '@/components/ui/NotificationBadge';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileChartColumn, BadgeDollarSign, ShieldUser, Calendar, Upload, Film, 
  Gift, QrCode, Ticket, PenLine, Pyramid, Road, Users, Warehouse, User, LogOut, X, 
  Camera, Star, PercentIcon, FastForward, LockKeyholeOpen, Flag, Info, 
  UserRoundKey, ShoppingBasket, Check, ChartCandlestick, ShieldCheck 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme'; 
import ButtonHome from '@/components/ui/ButtonHome'; 
import logoAutodromo from '@/assets/icons/logo-autodromo-color.png';
import api from '@/api/axios'; // <-- Importamos Axios para la consulta

// Subcomponente de menú actualizado con soporte para "badge"
const SidebarItem = ({ to, icon, label, isActive, onClick, badge }: { to: string; icon: React.ReactNode; label: string; isActive?: boolean; onClick?: () => void; badge?: number }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 glass-neon-btn group ${
      isActive ? 'bg-institucional-celeste/10 text-institucional-celeste border-institucional-celeste/30' : 'text-slate-600 dark:text-institucional-gris'
    }`}
  >
    <span className={`${isActive ? 'text-institucional-celeste' : 'group-hover:text-institucional-celeste'} transition-colors duration-300`}>{icon}</span>
    <span className="font-medium transition-colors duration-300">{label}</span>
    
   {/* LA BURBUJA ROJA DE NOTIFICACIÓN */}
    {badge !== undefined && (
      <NotificationBadge count={badge} className="absolute right-4 top-1/2 -translate-y-1/2" />
    )}
  </Link>
);

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
  const { userProfile, handleLogout } = useAuth();
  const { isDark, toggleTheme } = useTheme(); 
  
  // Estado para el total de notificaciones
  const [totalPendientes, setTotalPendientes] = useState(0);

  const rol = userProfile?.rol?.toLowerCase() || 'fan'; 
  const nivelFan = userProfile?.nivelFan || 'P3'; 

  // Consulta al backend exclusiva para el Staff
  useEffect(() => {
    if (rol === 'administrativo' || rol === 'superadmin') {
      const fetchNotificaciones = async () => {
        try {
          const res = await api.get('/uso-beneficio', { params: { estado: 'Pendiente', limite: 100 } });
          setTotalPendientes(res.data.data?.length || 0);
        } catch (error) {
          console.error("Error al cargar notificaciones del sidebar", error);
        }
      };
      fetchNotificaciones();
    }
  }, [rol, location.pathname]); // Se refresca cuando cambia de ruta

  const getNavItems = () => {
    const items = [];
    
    items.push({ to: '/dashboard/resumen', icon: <FileChartColumn size={20} />, label: 'Resumen' });
    if (rol !== 'comercio') {
      items.push({ to: '/dashboard/mi-perfil', icon: <User size={20} />, label: 'Mi Perfil' });
      items.push({ to: '/dashboard/mi-cuenta', icon: <ShieldCheck size={20} />, label: 'Mi Cuenta' });
    }

    if (rol === 'fan') {
      items.push({ to: '/dashboard/pagos', icon: <BadgeDollarSign size={20} />, label: 'Mi Billetera' });
      items.push({ to: '/dashboard/beneficios', icon: <PercentIcon size={20} />, label: 'Beneficios' });
      items.push({ to: '/dashboard/comercios-fan', icon: <ShoppingBasket size={20} />, label: 'Comercios' });
      items.push({ to: '/dashboard/pruebas', icon: <Road size={20} />, label: 'Pruebas' });
      items.push({ to: '/dashboard/descuentos-carreras', icon: <Ticket size={20} />, label: 'Carreras' });
      items.push({ to: '/dashboard/descuentos-recitales', icon: <Ticket size={20} />, label: 'Recitales' });
      items.push({ to: '/calendario', icon: <Calendar size={20} />, label: 'Eventos' });
      items.push({ to: '/noticia', icon: <Info size={20} />, label: 'Noticias' });
      
      if (nivelFan === 'P1' || nivelFan === 'P2') {
        items.push({ to: '/dashboard/fast-pass', icon: <FastForward size={20} />, label: 'Fast Access' });
        items.push({ to: '/galeria', icon: <LockKeyholeOpen size={20} />, label: 'Fotos inéditas' });
        items.push({ to: '/dashboard/visitas', icon: <Camera size={20} />, label: 'Visitas guiadas' });
        items.push({ to: '/dashboard/regalo-superfan', icon: <Gift size={20} />, label: 'Regalo SUPERFAN' });
      }
      if (nivelFan === 'P1') {
        items.push({ to: '/dashboard/vip-boxes', icon: <Star size={20} />, label: 'VIP Boxes' });
        items.push({ to: '/dashboard/sala', icon: <Warehouse size={20} />, label: 'Sala de Prensa' });
        items.push({ to: '/dashboard/placa', icon: <PenLine size={20} />, label: 'Placa grabada' });
        items.push({ to: '/dashboard/pacecar', icon: <Flag size={20} />, label: 'Race experience' });
      }
    } else {
      if (rol === 'superadmin' || rol === 'administrativo') {
        items.push({ to: '/dashboard/metricas', icon: <ChartCandlestick size={20} />, label: 'Métricas' });
        items.push({ to: '/dashboard/validar', icon: <QrCode size={20} />, label: 'Validar Acceso' });
        items.push({ to: '/dashboard/socios', icon: <Users size={20} />, label: 'Suscripciones' });      
        items.push({ to: '/dashboard/solicitudes', icon: <Check size={20} />, label: 'Solicitudes', badge: totalPendientes });
        items.push({ to: '/dashboard/eventos', icon: <Calendar size={20} />, label: 'Cargar evento' });
        items.push({ to: '/dashboard/comercios', icon: <ShoppingBasket size={20} />, label: 'Comercios' });
      }
      if (rol === 'superadmin' || rol === 'prensa') {
        items.push({ to: '/noticia', icon: <Info size={20} />, label: 'Noticias' });
        items.push({ to: '/dashboard/galeria', icon: <Film size={20} />, label: 'Galería' });
        items.push({ to: '/dashboard/contenido', icon: <Upload size={20} />, label: 'Cargar contenido' });
        items.push({ to: '/dashboard/noticias', icon: <Info size={20} />, label: 'Crear noticia' });
      }

      if (rol === 'prensa'){
        items.push({ to: '/calendario', icon: <Calendar size={20} />, label: 'Eventos' });
      }

      if (rol === 'superadmin') {
        items.push({ to: '/dashboard/cuentas', icon: <ShieldUser size={20} />, label: 'Cuentas' });
        items.push({ to: '/dashboard/staff', icon: <UserRoundKey size={20} />, label: 'Staff' });
        items.push({ to: '/dashboard/membresias', icon: <Pyramid size={20} />, label: 'Membresías' });  
      }
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-white/90 dark:bg-black/80 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 flex flex-col transition-transform duration-300 z-50 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="p-6 flex justify-between items-center">
          <div>
            <img src={logoAutodromo} alt="Logo Autódromo Rafaela" className="h-12 w-auto opacity-80 px-10" />
            <p className="text-[12px] title-fan uppercase tracking-widest mt-1">
              Sistema Óvalo Fans
            </p>
          </div>
          <button className="md:hidden text-slate-500 dark:text-slate-400 p-1" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="px-6 pb-2">
          <span className="inline-block px-3 py-1 bg-institucional-celeste/10 border border-institucional-celeste/20 rounded-full text-[10px] font-black text-institucional-celeste uppercase tracking-widest">
            {rol === 'fan' ? `Socio Nivel ${nivelFan}` : `Staff: ${userProfile?.rol}`}
          </span>
          <ButtonHome />          
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto bg-slate-100 dark:bg-neutral-950 rounded-lg shadow-inner custom-scrollbar">
          {navItems.map((item, index) => (
            <SidebarItem 
              key={index} 
              to={item.to} 
              icon={item.icon} 
              label={item.label} 
              isActive={location.pathname === item.to} 
              onClick={() => setIsOpen(false)}
              badge={item.badge} 
            />
          ))}
        </nav>

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