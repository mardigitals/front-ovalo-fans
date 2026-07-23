import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Crown, Mic, MapPin, CarFront, Zap, Eye, Gift, 
  ImagePlay, Wrench, Ticket, Music, ShoppingBag 
} from 'lucide-react';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import api from '@/api/axios';

// --- CONFIGURACIÓN CENTRAL DE BENEFICIOS ---
// Acá definís qué niveles (P1, P2, P3) pueden ver cada tarjeta y a dónde redirige
const LISTA_BENEFICIOS = [
  {
    tipo: 'VIP_BOXES',
    titulo: 'VIP Boxes',
    descripcion: 'Acceso exclusivo a la zona de boxes durante los eventos.',
    icono: Crown,
    color: 'text-amber-500',
    bgIcono: 'bg-amber-500/10',
    nivelesPermitidos: ['P1'], // Solo P1
    ruta: '/dashboard/vip-boxes'
  },
  {
    tipo: 'SALA_PRENSA',
    titulo: 'Sala de Prensa',
    descripcion: 'Viví la carrera desde la sala de prensa con los periodistas.',
    icono: Mic,
    color: 'text-sky-500',
    bgIcono: 'bg-sky-500/10',
    nivelesPermitidos: ['P1'],
    ruta: '/dashboard/sala-prensa'
  },
  {
    tipo: 'PLACA_RECTA',
    titulo: 'Tu nombre en la Recta',
    descripcion: 'Dejá tu huella grabada en la mítica recta del autódromo.',
    icono: MapPin,
    color: 'text-emerald-500',
    bgIcono: 'bg-emerald-500/10',
    nivelesPermitidos: ['P1', 'P2'], // P1 y P2
    ruta: '/dashboard/placa-recta'
  },
  {
    tipo: 'PACECAR_RESCATE',
    titulo: 'Pacecar / Rescate',
    descripcion: 'Sentí la adrenalina dando una vuelta en el vehículo oficial.',
    icono: CarFront,
    color: 'text-red-500',
    bgIcono: 'bg-red-500/10',
    nivelesPermitidos: ['P1'],
    ruta: '/dashboard/pacecar'
  },
  {
    tipo: 'FAST_ACCESS',
    titulo: 'Fast Access',
    descripcion: 'Ingreso rápido sin filas los días de carrera.',
    icono: Zap,
    color: 'text-yellow-500',
    bgIcono: 'bg-yellow-500/10',
    nivelesPermitidos: ['P1', 'P2'],
    ruta: '/dashboard/fast-pass'
  },
  {
    tipo: 'VISITAS_GUIADAS',
    titulo: 'Visitas Guiadas',
    descripcion: 'Recorré las instalaciones y conocé la historia del Óvalo.',
    icono: Eye,
    color: 'text-institucional-celeste',
    bgIcono: 'bg-institucional-celeste/10',
    nivelesPermitidos: ['P1', 'P2', 'P3'], // Todos
    ruta: '/dashboard/visitas-guiadas'
  },
  {
    tipo: 'REGALO_SUPERFAN',
    titulo: 'Regalo Superfan',
    descripcion: 'Kit exclusivo de merchandising oficial del club.',
    icono: Gift,
    color: 'text-pink-500',
    bgIcono: 'bg-pink-500/10',
    nivelesPermitidos: ['P1'],
    ruta: '/dashboard/regalo-superfan'
  },
  {
    tipo: 'MULTIMEDIA_VIP',
    titulo: 'Contenido Inédito',
    descripcion: 'Acceso a fotos y videos exclusivos de las carreras.',
    icono: ImagePlay,
    color: 'text-purple-500',
    bgIcono: 'bg-purple-500/10',
    nivelesPermitidos: ['P1', 'P2', 'P3'],
    ruta: '/dashboard/galeria'
  },
  {
    tipo: 'DESC_PRUEBAS',
    titulo: 'Descuento Pruebas',
    descripcion: 'Ahorrá en la reserva de pista para autos, motos o karts.',
    icono: Wrench,
    color: 'text-orange-500',
    bgIcono: 'bg-orange-500/10',
    nivelesPermitidos: ['P1', 'P2', 'P3'],
    ruta: '/dashboard/pruebas'
  },
  {
    tipo: 'DESC_CARRERAS',
    titulo: 'Descuento Carreras',
    descripcion: 'Entradas con precio preferencial para eventos de TC y más.',
    icono: Ticket,
    color: 'text-teal-500',
    bgIcono: 'bg-teal-500/10',
    nivelesPermitidos: ['P1', 'P2', 'P3'],
    ruta: '/dashboard/entradas'
  },
  {
    tipo: 'DESC_RECITALES',
    titulo: 'Descuento Recitales',
    descripcion: 'Beneficios en los grandes eventos musicales del Autódromo.',
    icono: Music,
    color: 'text-indigo-500',
    bgIcono: 'bg-indigo-500/10',
    nivelesPermitidos: ['P1', 'P2', 'P3'],
    ruta: '/dashboard/recitales'
  },
  {
    tipo: 'DESC_COMERCIOS',
    titulo: 'Descuento Comercios',
    descripcion: 'Ahorrá en la red de negocios adheridos de Rafaela.',
    icono: ShoppingBag,
    color: 'text-blue-500',
    bgIcono: 'bg-blue-500/10',
    nivelesPermitidos: ['P1', 'P2', 'P3'],
    ruta: '/dashboard/comercios'
  }
];

const BeneficiosPage = () => {
    const [perfil, setPerfil] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const cargarPerfil = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/usuario-auth/perfil', {
            headers: { Authorization: `Bearer ${token}` }
            });
            setPerfil(res.data);
        } catch (error) {
            console.error('Error al cargar el perfil:', error);
        } finally {
            setIsLoading(false);
        }
        };
        cargarPerfil();
    }, []);

    if (isLoading) return <FullScreenLoader />;

    // Obtenemos el nivel (P1, P2 o P3). Si no tiene, asumimos P3 por defecto o no mostramos nada.
    const nivelUsuario = perfil?.nivelFan || 'P3';
    const esFan = perfil?.rol === 'fan';

    // Filtramos la lista de beneficios:
    // Solo devolvemos los que incluyan el nivel del usuario en 'nivelesPermitidos'
    const beneficiosFiltrados = LISTA_BENEFICIOS.filter((beneficio) => 
        esFan && beneficio.nivelesPermitidos.includes(nivelUsuario)
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-in fade-in duration-500">
        {/* ENCABEZADO */}
        <div className="border-b border-slate-200 dark:border-white/10 pb-6">
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white uppercase tracking-tighter flex items-center gap-2">
            <Crown className="text-institucional-celeste" /> 
            Tus Beneficios Activos
            </h1>
            <p className="text-slate-500 mt-1">
            Tenés nivel <strong className="text-institucional-celeste">{nivelUsuario}</strong>. Preparate en tu cajón de largada para usar tu beneficio.
            </p>
        </div>

        {/* GRILLA DE TARJETAS (ESCALONADA TIPO LARGADA) */}
        {/* Agregamos pb-12 al contenedor para que las tarjetas desplazadas no se corten abajo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:pb-12">
            {beneficiosFiltrados.length > 0 ? (
            beneficiosFiltrados.map((beneficio, index) => {
                const IconoComponente = beneficio.icono;
                
                // Generamos el número de largada (01, 02, 03...)
                const numeroLargada = String(index + 1).padStart(2, '0');
                
                // Lógica de escalonamiento: La columna 2 baja un poco, la columna 3 baja más.
                const escalonadoClass = index % 3 === 1 
                ? 'lg:translate-y-6' 
                : index % 3 === 2 
                    ? 'lg:translate-y-12' 
                    : '';

                return (
                <Link 
                    key={beneficio.tipo} 
                    to={beneficio.ruta}
                    // Aplicamos la clase de escalonamiento calculada arriba
                    className={`bg-white dark:bg-[#161024] border border-slate-200 dark:border-white/5 rounded-2xl p-5 hover:border-institucional-celeste/50 hover:shadow-[0_0_20px_rgba(14,165,233,0.15)] transition-all duration-300 group relative flex flex-col h-full overflow-hidden cursor-pointer ${escalonadoClass}`}
                >
                    {/* 🏁 BANDERA A CUADROS (Borde Superior) */}
                    {/* Usamos conic-gradient para crear un patrón de ajedrez ultra liviano */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-[conic-gradient(#ffffff_90deg,#1e293b_90deg_180deg,#ffffff_180deg_270deg,#1e293b_270deg)] bg-[length:12px_12px] opacity-80"></div>

                    {/* NÚMERO DE CAJÓN GIGANTE (Fondo de agua) */}
                    <div className="absolute -right-4 -bottom-8 text-[140px] font-black italic text-slate-100 dark:text-white/[0.02] pointer-events-none group-hover:text-institucional-celeste/5 transition-colors z-0 leading-none tracking-tighter">
                    {numeroLargada}
                    </div>

                    {/* Efecto de luz al hacer hover */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-institucional-celeste/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-institucional-celeste/10 transition-colors z-0"></div>

                    {/* HEADER DE LA TARJETA */}
                    <div className="flex justify-between items-start mb-5 relative z-10 mt-3">
                    <div className="flex items-center gap-3">
                        {/* Badge de Posición de Largada */}
                        <div className="bg-slate-800 text-white font-black italic px-3 py-1 rounded-md text-lg shadow-md border-b-2 border-institucional-celeste group-hover:bg-institucional-celeste transition-colors">
                        P{numeroLargada}
                        </div>
                        {/* Ícono del Beneficio */}
                        <div className={`p-2 rounded-xl ${beneficio.bgIcono} ${beneficio.color}`}>
                        <IconoComponente size={22} />
                        </div>
                    </div>
                    
                    {/* Etiqueta del nivel */}
                    <div className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1 rounded-full flex items-center gap-1 shadow-inner">
                        <span className="font-bold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {beneficio.nivelesPermitidos.join(' / ')}
                        </span>
                    </div>
                    </div>

                    {/* CONTENIDO TEXTUAL */}
                    <div className="relative z-10 flex-grow">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-institucional-celeste transition-colors">
                        {beneficio.titulo}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
                        {beneficio.descripcion}
                    </p>
                    </div>

                    {/* CALL TO ACTION (Línea de meta) */}
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-sm font-bold text-institucional-celeste group-hover:text-sky-400 transition-colors relative z-10">
                    <span className="uppercase tracking-widest text-xs">Poner en marcha</span>
                    <span className="text-lg group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                </Link>
                )
            })
            ) : (
            <div className="col-span-full text-center py-12 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                <p className="text-slate-500 font-medium">Aún no hay beneficios disponibles para tu nivel.</p>
            </div>
            )}
        </div>

        </div>
    );
};

export default BeneficiosPage;