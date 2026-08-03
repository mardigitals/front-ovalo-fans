import { useState } from 'react';
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

const HistoriaPage = () => {
  const [etapaSeleccionada, setEtapaSeleccionada] = useState<any>(null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-300 relative overflow-hidden">
      
      {/* 🏁 FONDO DINÁMICO (SOLO VISIBLE EN DARK MODE) */}
      <div className="hidden dark:block absolute inset-0 z-0 pointer-events-none overflow-hidden">
        
       {/* 🏁 FONDO DINÁMICO (SOLO VISIBLE EN DARK MODE) */}
      <div className="hidden dark:block absolute inset-0 z-0 pointer-events-none overflow-hidden">
        
        {/* 1. Textura de Tierra (Arriba) - Corregido para cubrir sin repetir */}
        <div 
          className="absolute top-0 left-0 w-full h-[800px] bg-cover opacity-40"
          style={{ 
            backgroundImage: `url('/bg/tierra-fondo.webp')`, 
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)'
          }}
        ></div>

        {/* 2. Textura de Asfalto (Abajo) - Corregido para cubrir sin repetir */}
        <div 
          className="absolute bottom-0 left-0 w-full h-[800px] bg-cover opacity-50"
          style={{ 
            backgroundImage: `url('/bg/asfalto-fondo.webp')`, 
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)'
          }}
        ></div>
      </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10 space-y-12">
        
        {/* ENCABEZADO CON LOGO DEL AUTÓDROMO */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          
            {/* Logo adaptable - Le sumamos un pequeño scale al hacer hover para darle interactividad */}
            <div className="inline-flex justify-center p-5 bg-white dark:bg-institucional-celeste/10 border border-slate-200 dark:border-institucional-celeste/30 rounded-3xl shadow-md dark:shadow-[0_0_20px_rgba(14,165,233,0.2)] mb-2 transition-all duration-300 hover:scale-105"> 
               <img src="src/assets/icons/logo-autodromo-horizontal-color.png" alt="Logo Autódromo Rafaela" className="justify-center" />
            </div>
            {/* Textos con adaptabilidad dark/light */}
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 dark:text-white transition-colors">
                Historia del <span className="text-institucional-celeste inline-flex justify-center px-4 py-4 shadow-[0_0_20px_rgba(14,165,233,0.2)] m-4 rounded-3xl border-slate-200 "> Automovilismo de </span> Rafaela
            </h1>
            <p className="text-slate-600 dark:text-slate-600 text-lg transition-colors">
                Desde la tierra y los paraísos, hasta el asfalto entre paredones.
            </p>
            <h2 className="subtitle-fan">Rafaela, cumbre del automovilismo argentino</h2>
            <p className="text-slate-600 dark:text-slate-600 text-lg transition-colors">
                <em>Más de un siglo de pasión, velocidad y gloria.</em>
            </p> 
        </div>
        
       {/* Foto hero histórica fundida en el fondo */}
        <div className="relative w-full mx-auto h-[70vh] md:h-[70vh] mt-4 mb-32 flex items-center justify-center pointer-events-none">
            <img 
              src={heroImage2} 
              alt="Pista Circuito antiguo de Rafaela" 
              // opacity-30 la hace transparente. mix-blend-luminosity hace que tome el color de la tierra de fondo.
              className="w-full h-full object-cover opacity-30 dark:opacity-25 mix-blend-luminosity grayscale" 
              style={{
                // Esto crea un difuminado perfecto: sólido en el centro, transparente en los bordes
                maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 70%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 70%)'
              }}
            />
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
                // Fondo blanco en light, negro/gris en dark
                className={`bg-white dark:bg-[#111] backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 hover:border-institucional-celeste/50 hover:shadow-lg dark:hover:shadow-[0_0_25px_rgba(14,165,233,0.2)] transition-all duration-300 group relative flex flex-col h-full overflow-hidden cursor-pointer ${escalonadoClass}`}
              >
                {/* Bandera a cuadros superior */}
                <div className="absolute top-0 left-0 w-full h-2 bg-[conic-gradient(#ffffff_90deg,#1e293b_90deg_180deg,#ffffff_180deg_270deg,#1e293b_270deg)] bg-[length:12px_12px] opacity-80"></div>

                {/* Número de cajón gigante de fondo */}
                <div className="absolute -right-4 -bottom-8 text-[140px] font-black italic text-slate-100 dark:text-white/[0.03] pointer-events-none group-hover:text-institucional-celeste/5 transition-colors z-0 leading-none tracking-tighter">
                  {numeroLargada}
                </div>

                {/* Header de la card */}
                <div className="flex justify-between items-start mb-4 relative z-10 mt-2">
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-black italic px-3 py-1 rounded-md text-sm shadow-sm border-b-2 border-institucional-celeste group-hover:bg-institucional-celeste transition-colors font-mono">
                    {etapa.periodo}
                  </span>
                  <span className="text-xs font-bold text-institucional-celeste uppercase tracking-widest">
                    Etapa {numeroLargada}
                  </span>
                </div>

                {/* Contenido (Textos dinámicos) */}
                <div className="relative z-10 flex-grow">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-institucional-celeste transition-colors mb-2">
                    {etapa.titulo}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed transition-colors">
                    {etapa.resumen}
                  </p>
                </div>

                {/* Botón / Enlace inferior */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-sm font-bold text-institucional-celeste group-hover:text-sky-500 transition-colors relative z-10">
                  <span className="uppercase tracking-widest text-xs">Abrir archivo histórico</span>
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* MODAL / CAROUSEL DE HISTORIA */}
      <ModalHistoria 
        etapa={etapaSeleccionada} 
        onClose={() => setEtapaSeleccionada(null)} 
      />
      
      {/* BOTÓN FLOTANTE PARA VOLVER A LA WEB */}
      <ButtonHome />
      
      {/* FOOTER */ }
      <Footer />    

    </div>
  );
};

export default HistoriaPage;