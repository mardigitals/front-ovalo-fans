import PlantillaBeneficio from '@/components/ui/PlantillaBeneficio';
import { Mic } from 'lucide-react';

const SalaPrensaPage = () => {
  return (
    <PlantillaBeneficio
      titulo="Sala de Prensa 'Leonelo Bellezze'"
      descripcion="Solicitá el uso de la sala de prensa del autódromo para tus eventos corporativos, reuniones o cenas especiales."
      tipoBeneficio="SALA_PRENSA"
      icono={Mic}
      colorBase="text-yellow-500"
      bgBase="bg-yellow-500/10"
      reglas={[
        "Beneficio exclusivo para Socios Nivel P1.",
        "Se puede utilizar 1 (una) vez por año calendario.",
        "Capacidad máxima: 120 personas.",
        "No incluye servicio de catering ni limpieza posterior (a cargo del socio).",
        "Sujeto a disponibilidad y agenda del Club Atlético Rafaela."
      ]}
    />
  );
};

export default SalaPrensaPage;