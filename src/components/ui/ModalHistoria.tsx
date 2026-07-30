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
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-3xl bg-[#110c1b] border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* BOTÓN CERRAR */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full z-20"
        >
          <X size={20} />
        </button>

        {/* ENCABEZADO MODAL */}
        <div className="p-6 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2 text-institucional-celeste font-mono text-xs uppercase tracking-widest mb-1">
            <Calendar size={14} /> {etapa.periodo}
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            {etapa.titulo}
          </h2>
        </div>

        {/* CAROUSEL DE FOTOS */}
        <div className="relative w-full h-[320px] bg-black flex items-center justify-center group overflow-hidden">
          <img 
            src={etapa.fotos[currentIndex].url} 
            alt={etapa.fotos[currentIndex].epigrafe}
            className="w-full h-full object-cover transition-all duration-500"
          />
          
          {/* Controles de navegación del Carousel */}
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

        {/* HISTORIA ESCRITA ABAJO Y EPÍGRAFE */}
        <div className="p-6 overflow-y-auto space-y-4 bg-[#110c1b] flex-grow">
          <div className="text-xs text-institucional-celeste italic font-medium bg-institucional-celeste/10 p-2 rounded-lg border border-institucional-celeste/20">
            📷 <strong>Foto actual:</strong> {etapa.fotos[currentIndex].epigrafe}
          </div>
          
          <div className="text-slate-300 text-sm leading-relaxed space-y-3 whitespace-pre-line">
            {etapa.descripcionLarga}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ModalHistoria;