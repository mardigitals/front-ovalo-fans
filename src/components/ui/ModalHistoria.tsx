import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface EtapaHistoria {
  id: string;
  titulo: string;
  periodo: string;
  resumen: string;
  descripcionLarga: string;
  fotos: { url: string; epigrafe: string }[];
}

interface ModalHistoriaProps {
  etapa: EtapaHistoria | null;
  onClose: () => void;
}

const ModalHistoria = ({ etapa, onClose }: ModalHistoriaProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!etapa) return null;

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % etapa.fotos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + etapa.fotos.length) % etapa.fotos.length);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 md:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-[#110c1b] border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh] md:max-h-[90vh]">
        
        {/* BOTÓN CERRAR */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors bg-black/50 backdrop-blur-md p-2 rounded-full z-30"
        >
          <X size={20} />
        </button>

        {/* ENCABEZADO MODAL (Queda fijo arriba) */}
        <div className="p-3 md:p-4 border-b border-white/10 bg-[#110c1b]/95 backdrop-blur-md relative z-20 flex-shrink-0">
          <div className="flex items-center gap-2 text-institucional-celeste font-mono text-[10px] md:text-xs uppercase tracking-widest mb-0.5">
            <Calendar size={12} /> {etapa.periodo}
          </div>
          <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tight leading-none">
            {etapa.titulo}
          </h2>
        </div>

        {/* 
          CONTENEDOR SCROLLABLE
          Acá es donde ocurre la magia: engloba tanto la foto como el texto. 
        */}
        <div className="overflow-y-auto custom-scrollbar flex-grow relative z-10">
          
          {/* CAROUSEL DE FOTOS (Se vuelve 'sticky' para quedarse quieto de fondo) */}
          <div className="sticky top-0 z-0 w-full h-[300px] md:h-[300px] lg:h-[300px] bg-black flex items-center justify-center group">
            <img 
              src={etapa.fotos[currentIndex].url} 
              alt={etapa.fotos[currentIndex].epigrafe}
              className="w-full h-full object-contain transition-all duration-500"
            />
            
            {/* Controles de navegación */}
            {etapa.fotos.length > 1 && (
              <>
                <button 
                  onClick={prevPhoto}
                  className="absolute left-4 bg-black/50 hover:bg-black text-white p-2 rounded-full transition-colors backdrop-blur-sm"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextPhoto}
                  className="absolute right-4 bg-black/50 hover:bg-black text-white p-2 rounded-full transition-colors backdrop-blur-sm"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Indicador de posición */}
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-white">
              {currentIndex + 1} / {etapa.fotos.length}
            </div>
          </div>

          {/* 
            HISTORIA ESCRITA
            Al hacer scroll, este bloque sube y tapa a la foto sticky.
            Tiene un background sólido para ocultar la foto y una sombra oscura hacia arriba.
          */}
          <div className="relative z-10 p-4 md:p-6 bg-[#110c1b] shadow-[0_-15px_30px_rgba(0,0,0,0.8)] min-h-[50vh]">
            <div className="text-xs text-institucional-celeste italic font-medium bg-institucional-celeste/10 p-2 rounded-lg border border-institucional-celeste/20 mb-4">
              {etapa.fotos[currentIndex].epigrafe}
            </div>
            
            <div className="text-slate-300 text-sm md:text-base leading-relaxed space-y-3 whitespace-pre-line pb-4">
              {etapa.descripcionLarga}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ModalHistoria;