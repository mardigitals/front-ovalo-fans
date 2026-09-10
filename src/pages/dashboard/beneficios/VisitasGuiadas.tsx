import PlantillaBeneficio from '@/components/ui/PlantillaBeneficio';
import { Eye } from 'lucide-react';

const VisitasGuiadasPage = () => {
  return (
    <PlantillaBeneficio
      titulo="Visitas Guiadas privadas"
      descripcion="Viví una EXPERIENCIA ÚNICA. Recorrés la pista, conocés los secretos del Óvalo y visitás lugares como el museo, la torre de control, los boxes y sectores exclusivos que pocos conocen."
      tipoBeneficio="VISITAS_GUIADAS"
      icono={Eye}
      colorBase="text-slate-500"
      bgBase="bg-slate-500/10"
      reglas={[
        "Beneficio para Socios Nivel P1 y P2.",
        "Se puede coordinar para el fan titular y hasta 4 acompañantes.",
        "Los recorridos se realizan únicamente en días sin actividad oficial en pista.",
        "Duración aproximada del recorrido: 45-60 minutos."
      ]}
    />
  );
};

export default VisitasGuiadasPage;