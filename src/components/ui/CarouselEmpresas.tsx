import logoEmpresa1 from '@/assets/icons/beneficios/mardigitals.png';
import logoEmpresa2 from '@/assets/icons/beneficios/ypf.png';
import logoEmpresa3 from '@/assets/icons/beneficios/estudiora.jpg';
import logoEmpresa4 from '@/assets/icons/beneficios/utn.png';
import logoEmpresa5 from '@/assets/icons/beneficios/espacioarq.jpeg';
import logoEmpresa6 from '@/assets/icons/beneficios/long.jpg';

const companies = [
  { id: 1, name: 'Mar digitals', logo: logoEmpresa1, url: 'https://mardigitals.netlify.app' },
  { id: 2, name: 'YPF', logo: logoEmpresa2, url: 'https://www.ypf.com' },
  { id: 3, name: 'Estudio RA', logo: logoEmpresa3, url: 'https://www.arqestudiora.com' },
  { id: 4, name: 'UTN Rafaela', logo: logoEmpresa4, url: 'https://www.utn.edu.ar' },
  { id: 5, name: 'Espacio ARQ', logo: logoEmpresa5 },
  { id: 6, name: 'Long Automotores', logo: logoEmpresa6, url: 'https://www.long.com.ar' },
  ];

const CarouselEmpresas = () => {
  // Duplicamos el array para crear la ilusión de un bucle infinito continuo
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <div className="relative w-full overflow-hidden py-12 bg-transparent z-10">
      
      <div className="text-center mb-8">
        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-widest title-fan ">
          Empresas Adheridas
        </h3>
        <p className="text-fan mt-2">Disfrutá de beneficios en las mejores marcas</p>
      </div>

      {/* Inyectamos los keyframes para la animación infinita */}
      <style>
        {`
          @keyframes slide-infinite {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); } 
          }
          .animate-slider {
            display: flex;
            width: max-content;
            animation: slide-infinite 25s linear infinite;
          }
          .animate-slider:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      {/* Contenedor del Carrusel */}
      <div className="animate-slider gap-8 px-4">
        {duplicatedCompanies.map((company, index) => (
          <a
            key={`${company.id}-${index}`}
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-40 h-24 md:w-48 md:h-28 bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-sky-500 hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all duration-300"
          >
            <img
              src={company.logo}
              alt={company.name}
              className="max-w-[70%] max-h-[70%] object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300 grayscale group-hover:grayscale-0"
            />
            
            {/* Tooltip flotante con el nombre de la empresa */}
            <div className="absolute -top-12 scale-0 group-hover:scale-100 transition-transform duration-200 origin-bottom bg-sky-500 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">
              {company.name}
              {/* Triángulo del Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-sky-500"></div>
            </div>
          </a>
        ))}
      </div>
      
      {/* Sombras en los bordes para difuminar la entrada y salida (Opcional, queda muy bien) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-zinc dark:from-[#08060d] to-transparent z-20"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-zinc dark:from-[#08060d] to-transparent z-20"></div>
    </div>
  );
};

export default CarouselEmpresas;