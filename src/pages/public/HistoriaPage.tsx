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

    descripcionLarga: `En 1919 Atlético organiza la primera competencia oficial. En el mes de febrero el club nombra una Subcomisión de Carreras integrada por José Simonetta, Adolfo Bircher, Emilio Picasso, Federico Bollinger, Eduardo Ripamonti y Francisco Soldano. El 25 de mayo de 1919 se larga la primera carrera de automóviles en la que intervienen 7 corredores: Angel Gallé, Antonio Valenti, Juan Colombetti, Jorge Cohen, Juan Macci y Oberdán Piovano.

El grupo de audaces pilotos se alineó sobre bulevar Lehmann y calle Alem, ese fue el lugar de la largada de un intenso recorrido de 320 km. que uniría Rafaela con las localidades de Lehmann, Ataliva, Sunchales, Tacural, Morteros, Brikmann, Porteña, Luxardo, San Francisco, Clucellas, Saguier y Susana. El vencedor de esa prueba histórica fue Oberdán Piovano con un coche Overland con el que realizó el recorrido en un tiempo de 4 horas, 9 minutos y 2 segundos, con un promedio de 77,349 km/h. Segundo fue Juan Colombetti con Studebaker y tercero Juan Macci con Chevrolet.

Así fue el principio del automovilismo en Atlético de Rafaela. Una de las historias más ricas de este deporte en Argentina. En este proceso genuino, y siempre ejemplar, está la clave para comprender cómo fue posible que desde este club del interior del país, un buen día todo Indianápolis, sus pilotos, sus máquinas y hasta su propio estilo competitivo llegara a la Argentina, atraído por una convocatoria que no reconoce igual.

Así surgía la pasión por los fierros, la que pronto destacaría al club y a la ciudad en los más altos conceptos y niveles del país y el mundo`,

    fotos: [

      { url: '/images/modals/caballo-largada-1919.jpg', epigrafe: 'Grilla de largada en el centro de Rafaela.' },

      { url: '/images/modals/largada-1919.jpg', epigrafe: 'Largada en calle Alem y Bv. Lehmann, ambos caminos de tierra.' },

      { url: '/images/modals/catedral-rafaela-1919.jpg', epigrafe: 'Vista histórica de la 1 Carrera.' },

      { url: '/images/modals/cohen-1919.jpg', epigrafe: 'Corredor J. Cohen, en 1919.' },

      { url: '/images/modals/piovano-1919.jpg', epigrafe: 'O. Piovano, ganador de la histórica  Carrera.' },

      { url: '/images/modals/recorte-diario-1919.jpg', epigrafe: 'Recorte de diario alusivo a la primera Carrera.' }

    ]

  },

  {

    id: 'etapa-2',

    periodo: '1926 - 1970',

    titulo: '500 Millas Argentinas',

    resumen: 'La consagración nacional y la mítica competencia en el óvalo de distintos tamaños.',

    descripcionLarga: `La posibilidad de las 500 Millas Argentinas cobró fuerza y su realización fue abordada por la Comisión Directiva. El 3 de marzo de 1926 se dispuso definitivamente encarar la atrevida idea y el 27 de marzo en el libro de actas del club se deja asentado que: “estando todo dispuesto favorablemente se correrán las primeras 500 Millas Argentinas».

El 6 de junio de 1926 a las 7 de la mañana 29 autos hacían tronar el piso de tierra. Más de 40 mil personas esperaban la largada. La carrera se disputaría en un circuito de caminos vecinales, ubicado a 2.000 metros al Oeste de la hoy Ruta 34, en la prolongación del Bulevar Roca, Un dibujo de aproximadamente 37 Km que debía ser recorrido en 21 oportunidades y así encontrar una equivalencia gaucha de las 500 Millas Gringas en Indianápolis.

Se pusieron en marcha los cronómetros desde un vagón de tren que a un costado constituía un lugar preferencial para las autoridades de la competencia entre ellos los fiscalizadores enviados desde Buenos Aires por el ACA (Automóvil Club Argentino). Ruido de motores, gritos, aplausos, huellas, tierra por el aire, se largaron las 500 millas, la gran historia empezaba a escribirse. A las 2 horas de carrera se desató un temporal para que la competencia fuera más dramática en la lluvia y el barro. Domingo Bucci, quien figuró como el primer inscripto en la nómina se había situado en el liderazgo con su automóvil Hudson y ahí permaneció hasta que finalmente llegó la suspensión. El reloj marcaba 2 horas, 15 minutos y 1 segundo de carrera.

Pasarían semanas para que se retome la prueba deportiva, se produce una fuerte ruptura de relaciones entre Atlético y el Automóvil Club Argentino. La confusión ganó a muchos y las desprolijidades propias de la inexperiencia hicieron que se cometieran muchos errores al reanudar la prueba después de muchos intentos y postergaciones. Recién el 29 de agosto de 1926 se reanudan las 500 Millas Argentinas. Fue ese entonces el momento donde Raúl Riganti, piloto que llegó desde Buenos Aires y se convirtió en el memorable ganador del primer gran carrerón de la República Argentina.`,

    fotos: [

      { url: '/images/modals/largada-1926.jpg', epigrafe: 'Largada histórica de la 1 500 Millas Argentinas.' },

      { url: '/images/modals/llegada-1926.jpg', epigrafe: 'Bandera a cuadros para Riganti.' }

    ]

  },

  {

    id: 'etapa-3',

    periodo: '1971',

    titulo: '300 Indy, la Epopeya',

    resumen: 'Cuando los monstruos de Estados Unidos rugieron en el corazón de Santa Fe.',

    descripcionLarga: `El año 1971 quedó grabado a fuego en la historia mundial del deporte motor. El Autódromo de Rafaela fue escenario de las 300 Millas de Rafaela, trayendo a los bólidos y pilotos de la USAC (IndyCar) estadounidense. Fue una verdadera revolución tecnológica y logística que demostró que el óvalo rafaelino estaba a la altura de los mejores escenarios del planeta.`,

    fotos: [

      { url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80', epigrafe: 'Monoplazas americanos en la recta principal.' },

      { url: 'https://images.unsplash.com/photo-1541348263662-e0626628d0cf?auto=format&fit=crop&w=800&q=80', epigrafe: 'Equipos internacionales trabajando en los boxes de Rafaela.' }

    ]

  },

  {

    id: 'etapa-4',

    periodo: '1972 - 1999',

    titulo: 'Últimos años de la Época Dorada',

    resumen: 'La llegada del asfalto definitivo y récords absolutos de velocidad.',

    descripcionLarga: `Con la pavimentación del óvalo y su posterior ampliación, el Autódromo Ciudad de Rafaela se transformó en el templo indiscutido de la velocidad final en Sudamérica. Las categorías nacionales como el Turismo Carretera rompieron todos los récords de promedio de velocidad, regalando carrerones memorables bajo el rugido constante de los motores en las curvas peraltadas.`,

    fotos: [

      { url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80', epigrafe: 'Turismo Carretera acelerando a fondo en el óvalo asfaltado.' }

    ]

  },

  {

    id: 'etapa-5',

    periodo: '2000 - 2019',

    titulo: 'El Óvalo y sus Récords',

    resumen: 'Consolidación internacional, tecnología y pasión moderna.',

    descripcionLarga: `Durante estas décadas, el autódromo continuó modernizando sus instalaciones, albergando definiciones de campeonatos nacionales y manteniendo vivo el respeto por el diseño ovalado más rápido del continente. Los récords de velocidad continuaron cayendo, atrayendo a nuevas generaciones de fanáticos fierreros.`,

    fotos: [

      { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80', epigrafe: 'Vistas aéreas del circuito modernizado.' }

    ]

  },

  {

    id: 'etapa-6',

    periodo: '2019',

    titulo: '100 Años de Automovilismo',

    resumen: 'Un siglo entero viviendo a pura velocidad y pasión.',

    descripcionLarga: `Rafaela festejó a lo grande su centenario ligado al motor. Caravana de autos históricos, presencias de glorias vivientes del automovilismo nacional y homenajes institucionales que coronaron cien años de historia ininterrumpida junto al Club Atlético Rafaela.`,

    fotos: [

      { url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', epigrafe: 'Exhibición de autos históricos en el centenario.' }

    ]

  },

  {

    id: 'etapa-7',

    periodo: '2020 - Actualidad',

    titulo: 'Nuevos Sueños',

    resumen: 'Innovación, comunidad digital (Óvalo Fans) y futuro.',

    descripcionLarga: `Mirando hacia el futuro, el autódromo se adapta a las nuevas tecnologías con plataformas digitales como Óvalo Fans, integrando a las nuevas generaciones de socios, mejorando la experiencia en pista y preparándose para escribir las próximas páginas doradas del deporte motor argentino.`,

    fotos: [

      { url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80', epigrafe: 'El autódromo hoy: tecnología y pasión de vanguardia.' }

    ]

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
  // Estado para controlar qué tarjeta se muestra en la página (arranca con la primera)
  const [etapaActiva, setEtapaActiva] = useState<any>(ETAPAS_HISTORIA[0]);
  
  // Estado para controlar el modal (cuando se hace clic en la tarjeta)
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
        <div className="w-full py-8 px-4 md:px-12 m-2 relative mt-12 mb-16 overflow-x-auto custom-scrollbar">
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
                    // Al hacer clic, actualizamos la etapa activa (la tarjeta de abajo)
                    const etapaData = ETAPAS_HISTORIA.find(e => e.id === punto.etapaId);
                    if (etapaData) setEtapaActiva(etapaData);
                  }}
                >
                  <span className={`absolute -top-10 whitespace-nowrap px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}>
                    {ETAPAS_HISTORIA.find(e => e.id === punto.etapaId)?.titulo || 'Desconocida'}
                  </span>

                  <div className={`rounded-full transition-all duration-300 ease-out 
                    group-hover:scale-150 group-hover:backdrop-blur-md group-hover:shadow-[0_0_15px_rgba(255,255,255,0.6)]
                    flex items-center justify-center
                    ${punto.important 
                      ? 'w-6 h-6 bg-cyan-400 shadow-[0_0_20px_rgba(0,0,0,1)] dark:shadow-[0_0_20px_rgba(255,211,238,0.8)] border-2 border-slate-100 dark:border-slate-800 z-20' 
                      : 'w-4 h-4 bg-slate-900 dark:bg-white border-2 border-slate-300 dark:border-slate-600 z-10'
                    }
                    ${etapaActiva?.id === punto.etapaId ? 'ring-4 ring-cyan-500/50 scale-125' : ''} 
                    `}
                  ></div>

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

        {/* VISTA DE TARJETA ÚNICA ACTIVA */}
        <div className="flex justify-center w-full lg:pb-12">
          {etapaActiva && (() => {
            const index = ETAPAS_HISTORIA.findIndex(e => e.id === etapaActiva.id);
            const numeroLargada = String(index + 1).padStart(2, '0');

            return (
              <div 
                // Usamos la key para que React re-renderice la tarjeta y se aplique una suave transición
                key={etapaActiva.id}
                onClick={() => setEtapaSeleccionada(etapaActiva)} // Al clickear la tarjeta, abre el Modal
                className="bg-zinc-200 dark:bg-[#111] backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-8 md:p-10 hover:border-institucional-celeste/50 hover:shadow-lg dark:hover:shadow-[0_0_25px_rgba(14,165,233,0.2)] transition-all duration-500 group relative flex flex-col h-full overflow-hidden cursor-pointer w-full max-w-3xl animate-[fadeIn_0.5s_ease-out]"
              >
                {/* Bandera a cuadros superior */}
                <div className="absolute top-0 left-0 w-full h-2 bg-[conic-gradient(#ffffff_90deg,#1e293b_90deg_180deg,#ffffff_180deg_270deg,#1e293b_270deg)] bg-[length:12px_12px] opacity-80"></div>

                {/* Número gigante de fondo */}
                <div className="absolute -right-4 -bottom-8 text-[160px] md:text-[200px] font-black italic text-slate-100 dark:text-white/[0.03] pointer-events-none group-hover:text-institucional-celeste/5 transition-colors z-0 leading-none tracking-tighter">
                  {numeroLargada}
                </div>

                <div className="flex justify-between items-start mb-6 relative z-10 mt-2">
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-black italic px-4 py-2 rounded-md text-sm md:text-base shadow-sm border-b-2 border-institucional-celeste group-hover:bg-institucional-celeste transition-colors font-mono">
                    {etapaActiva.periodo}
                  </span>
                  <span className="text-sm font-bold text-institucional-celeste uppercase tracking-widest">
                    Etapa {numeroLargada}
                  </span>
                </div>

                <div className="relative z-10 flex-grow py-4">
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-institucional-celeste transition-colors mb-4">
                    {etapaActiva.titulo}
                  </h3>
                  <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed transition-colors">
                    {etapaActiva.resumen}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-300 dark:border-white/10 flex items-center justify-between text-base font-bold text-institucional-celeste group-hover:text-sky-500 transition-colors relative z-10">
                  <span className="uppercase tracking-widest text-sm md:text-base">Abrir archivo histórico completo</span>
                  <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" />
                </div>
              </div>
            );
          })()}
        </div>

      </div>

      {/* MODAL DE HISTORIA (Solo se abre si hay una etapa seleccionada haciendo clic en la tarjeta) */}
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