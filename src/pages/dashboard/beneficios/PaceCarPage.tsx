import PlantillaBeneficio from '@/components/ui/PlantillaBeneficio';
import { Gauge } from 'lucide-react';

const PacecarPage = () => {
  return (
    <PlantillaBeneficio
      titulo="Pacecar / Rescate"
      descripcion="Sentí la adrenalina dando una vuelta en el vehículo oficial de rescate durante una actividad de pista."
      tipoBeneficio="PACECAR_RESCATE"
      icono={Gauge}
      colorBase="text-yellow-500"
      bgBase="bg-yellow-500/10"
      reglas={[
        "Beneficio exclusivo para Socios Nivel P1.",
        "Se puede utilizar 1 (una) vez por año calendario.",
        "Sujeto a disponibilidad del cronograma del evento.",
        "Deberás firmar un deslinde de responsabilidad civil en el autódromo antes de subir al vehículo.",
        "No apto para menores de 18 años ni personas con problemas cardíacos."
      ]}
    />
  );
};

export default PacecarPage;