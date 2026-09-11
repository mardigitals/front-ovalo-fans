import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import ModalHistoria from '@/components/ui/ModalHistoria';
import heroImage2 from '@/assets/images/hero-image-2.jpg';
import ButtonHome from '@/components/ui/ButtonHome'; 
import Footer from '@/components/ui/Footer';

// --- DATA HISTÓRICA DEL AUTÓDROMO ---
const ETAPAS_HISTORIA = [
  {
    id: 'etapa-1',
    periodo: '1919 - 1925',
    titulo: 'El despertar de una pasión',
    resumen: 'Los primeros rugidos de velocidad en caminos de tierra.',
    descripcionLarga: `En 1919 Atlético organiza la primera competencia oficial...`,
    fotos: [] // Mantené tus fotos aquí
  },
  {
    id: 'etapa-2',
    periodo: '1926 - 1970',
    titulo: '500 Millas Argentinas',
    resumen: 'La consagración nacional y la mítica competencia en el óvalo de distintos tamaños.',
    descripcionLarga: `La posibilidad de las 500 Millas Argentinas cobró fuerza...`,
    fotos: []
  },
  {
    id: 'etapa-3',
    periodo: '1971',
    titulo: '300 Indy, la Epopeya',
    resumen: 'Cuando los monstruos de Estados Unidos rugieron en el corazón de Santa Fe.',
    descripcionLarga: `El año 1971 quedó grabado a fuego en la historia mundial...`,
    fotos: []
  },
  {
    id: 'etapa-4',
    periodo: '1972 - 1999',
    titulo: 'Últimos años de la Época Dorada',
    resumen: 'La llegada del asfalto definitivo y récords absolutos de velocidad.',
    descripcionLarga: `Con la pavimentación del óvalo y su posterior ampliación...`,
    fotos: []
  },
  {
    id: 'etapa-5',
    periodo: '2000 - 2019',
    titulo: 'El Óvalo y sus Récords',
    resumen: 'Consolidación internacional, tecnología y pasión moderna.',
    descripcionLarga: `Durante estas décadas, el autódromo continuó modernizando...`,
    fotos: []
  },
  {
    id: 'etapa-6',
    periodo: '2019',
    titulo: '100 Años de Automovilismo',
    resumen: 'Un siglo entero viviendo a pura velocidad y pasión.',
    descripcionLarga: `Rafaela festejó a lo grande su centenario ligado al motor...`,
    fotos: []
  },
  {
    id: 'etapa-7',
    periodo: '2020 - Actualidad',
    titulo: 'Nuevos Sueños',
    resumen: 'Innovación, comunidad digital (Óvalo Fans) y futuro.',
    descripcionLarga: `Mirando hacia el futuro, el autódromo se adapta a las nuevas tecnologías...`,
    fotos: []
  }
];

// --- DATA LÍNEA HISTÓRICA ---
const LINEA_HISTORICA = [
  { year: 1919, important: true, etapaId: 'etapa-1' },
  { year: 1926, important: true, etapaId: 'etapa-2' },
  { year: 1950, important: false, etapaId: 'etapa-2' },
  { year: 1953, important: false, etapaId: 'etapa-2' },
  { year: 1956, important: true, etapaId: 'etapa-2' },
  { year: 1966, important: true, etapaId: 'etapa-2' },
  { year: 1971, important: true, etapaId: 'etapa-3' },
  { year: 1973, important: false, etapaId: 'etapa-4' },
  { year: 1982, important: false, etapaId: 'etapa-4' },
  { year: 1998, important: false, etapaId: 'etapa-4' },
  { year: 2005, important: false, etapaId: 'etapa-5' },
  { year: 2012, important: false, etapaId: 'etapa-5' },
  { year: 2019, important: true, etapaId: 'etapa-6' },
  { year: 2026, important: true, etapaId: 'etapa-7' },
];

const HistoriaPage = () => {
  const [etapaSeleccionada, setEtapaSeleccionada] = useState<any>(null);
  const [mostrarLogo, setMostrarLogo] = useState(true);

  // Efecto para la transición de 1,2 segundos (logo difuminado -> texto)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMostrarLogo(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen pt-16 bg-slate-50 dark:bg-black transition-colors duration-300 relative overflow-hidden">
      
      {/* 🏁 FONDO DINÁMICO (SOLO VISIBLE EN DARK MODE) */}
      <div className="hidden dark:block absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* 1. Textura de Tierra */}
        <div 
          className="absolute top-0 left-0 w-full h-[800px] bg-cover opacity-40"
          style={{ 
            backgroundImage: `url('/bg/tierra-fondo.webp')`, 
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)'
          }}
        ></div>

        {/* 2. Textura de Asfalto */}
        <div 
          className="absolute bottom-0 left-0 w-full h-[800px] bg-cover opacity-50"
          style={{ 
            backgroundImage: `url('/bg/asfalto-fondo.webp')`, 
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)'
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10 space-y-12">
        
        {/* ENCABEZADO ANIMADO (Logo y Textos en el mismo espacio) */}
        <div className="relative flex items-center justify-center w-full h-[300px] max-w-3xl mx-auto">
            
            {/* Logo Autódromo - Se difumina y desaparece */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out ${mostrarLogo ? 'opacity-100 blur-none scale-100 z-20' : 'opacity-0 blur-xl scale-110 -z-10'}`}>
                <div className="inline-flex justify-center p-5 bg-white dark:bg-institucional-celeste/10 border border-slate-200 dark:border-institucional-celeste/30 rounded-3xl shadow-md dark:shadow-[0_0_20px_rgba(14,165,233,0.2)] mb-2 transition-all duration-300 hover:scale-105"> 
                   <img src="src/assets/icons/logo-autodromo-horizontal-color.png" alt="Logo Autódromo Rafaela" className="justify-center h-auto max-w-full" />
                </div>
            </div>

            {/* Textos - Aparecen en su lugar */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center text-center space-y-4 transition-all duration-1000 ease-in-out delay-[400ms] ${!mostrarLogo ? 'opacity-100 z-20 translate-y-0' : 'opacity-0 -z-10 translate-y-4'}`}>
                <h1 className="title-fan text-7xl inline-flex px-4 py-4 shadow-[0_0_20px_rgba(14,165,233,0.2)] m-4 rounded-3xl border-slate-200 bg-white/5 backdrop-blur-sm">
                    Historia 
                </h1>
                <p className="text-fan text-lg">
                    Desde la tierra y los paraísos, hasta el asfalto entre paredones.
                </p>
                <h2 className="subtitle-fan text-3xl md:text-3xl text-cyan-600 dark:text-cyan-400">
                    Rafaela, Cumbre del Automovilismo Argentino
                </h2>
                <p className="text-fan">
                    <em className="font-bold">Más de un siglo de pasión, velocidad y gloria.</em>
                </p> 
            </div>
        </div>
        
        {/* Foto hero histórica fundida en el fondo */}
        <div className="relative w-full mx-auto h-[60vh] md:h-[60vh] mt-4 flex items-center justify-center pointer-events-none">
            <img 
              src={heroImage2} 
              alt="Pista Circuito antiguo de Rafaela" 
              className="w-full h-full object-cover opacity-30 dark:opacity-25 mix-blend-luminosity grayscale" 
              style={{
                maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 70%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 70%)'
              }}
            />
        </div>   

        {/* LÍNEA HISTÓRICA INTERACTIVA */}
        <div className="w-full py-8 px-4 m-4 relative mt-12 mb-16 overflow-x-auto custom-scrollbar">
          <div className="min-w-[900px] md:max-w-[1200px] relative">
            {/* Línea dorada */}
            <div className="absolute top-1/2 left-4 right-4 h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 transform -translate-y-1/2 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)] z-0"></div>

            {/* Puntos de la línea */}
            <div className="relative z-10 flex justify-between items-center w-full px-4">
              {LINEA_HISTORICA.map((punto, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center justify-center cursor-pointer group relative"
                  onClick={() => {
                    const etapaData = ETAPAS_HISTORIA.find(e => e.id === punto.etapaId);
                    if (etapaData) setEtapaSeleccionada(etapaData);
                  }}
                >
                  {/* Tooltip Hover (Opcional por encima) */}
                  <span className={`absolute -top-10 whitespace-nowrap px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}>
                    Ver {ETAPAS_HISTORIA.find(e => e.id === punto.etapaId)?.titulo || 'Desconocida'}
                  </span>

                  {/* El Punto (Diferente tamaño y color según importancia) */}
                  <div className={`rounded-full transition-all duration-300 ease-out 
                    group-hover:scale-150 group-hover:backdrop-blur-md group-hover:shadow-[0_0_15px_rgba(255,255,255,0.6)]
                    flex items-center justify-center
                    ${punto.important 
                      ? 'w-6 h-6 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] border-2 border-slate-100 dark:border-slate-800 z-20' 
                      : 'w-4 h-4 bg-slate-900 dark:bg-white border-2 border-slate-300 dark:border-slate-600 z-10'
                    }`}
                  ></div>

                  {/* Texto Año Fijo Abajo */}
                  <span className={`absolute top-8 font-bold transition-colors duration-300 ${
                      punto.important 
                      ? 'text-cyan-600 dark:text-cyan-400 text-[15px]' 
                      : 'text-slate-600 dark:text-slate-300 text-xs'
                    }`}
                  >
                    {punto.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GRILLA DE TARJETAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:pb-12">
          {ETAPAS_HISTORIA.map((etapa, index) => {
            const numeroLargada = String(index + 1).padStart(2, '0');
            
            const escalonadoClass = index % 3 === 1 
              ? 'lg:translate-y-6' 
              : index % 3 === 2 
                ? 'lg:translate-y-12' 
                : '';

            return (
              <div 
                key={etapa.id}
                onClick={() => setEtapaSeleccionada(etapa)}
                className={`bg-zinc-200 dark:bg-[#111] backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 hover:border-institucional-celeste/50 hover:shadow-lg dark:hover:shadow-[0_0_25px_rgba(14,165,233,0.2)] transition-all duration-300 group relative flex flex-col h-full overflow-hidden cursor-pointer ${escalonadoClass}`}
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-[conic-gradient(#ffffff_90deg,#1e293b_90deg_180deg,#ffffff_180deg_270deg,#1e293b_270deg)] bg-[length:12px_12px] opacity-80"></div>

                <div className="absolute -right-4 -bottom-8 text-[140px] font-black italic text-slate-100 dark:text-white/[0.03] pointer-events-none group-hover:text-institucional-celeste/5 transition-colors z-0 leading-none tracking-tighter">
                  {numeroLargada}
                </div>

                <div className="flex justify-between items-start mb-4 relative z-10 mt-2">
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-black italic px-3 py-1 rounded-md text-sm shadow-sm border-b-2 border-institucional-celeste group-hover:bg-institucional-celeste transition-colors font-mono">
                    {etapa.periodo}
                  </span>
                  <span className="text-xs font-bold text-institucional-celeste uppercase tracking-widest">
                    Etapa {numeroLargada}
                  </span>
                </div>

                <div className="relative z-10 flex-grow">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-institucional-celeste transition-colors mb-2">
                    {etapa.titulo}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed transition-colors">
                    {etapa.resumen}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-sm font-bold text-institucional-celeste group-hover:text-sky-500 transition-colors relative z-10">
                  <span className="uppercase tracking-widest text-xs">Abrir archivo histórico</span>
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <ModalHistoria 
        etapa={etapaSeleccionada} 
        onClose={() => setEtapaSeleccionada(null)} 
      />
      
      <div className="fixed bottom-6 right-6 z-50">
        <ButtonHome />
      </div>
      
      <Footer />    
    </div>
  );
};

export default HistoriaPage;