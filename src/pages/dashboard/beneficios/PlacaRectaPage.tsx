import PlantillaBeneficio from '@/components/ui/PlantillaBeneficio';
import { MapPin } from 'lucide-react';

const PlacaRectaPage = () => {
  return (
    <PlantillaBeneficio
      titulo="Tu Nombre en la Recta"
      descripcion="Inmortalizá tu pasión. Dejá tu huella grabada en una placa conmemorativa sobre el paredón de la mítica recta del autódromo."
      tipoBeneficio="PLACA_RECTA"
      icono={MapPin}
      colorBase="text-yellow-500"
      bgBase="bg-yellow-500/10"
      reglas={[
        "Beneficio exclusivo para Socios Nivel P1.",
        "La placa incluirá tu Nombre, Apellido y número de socio.",
        "Requerimos 12 meses de suscripción activa para poder solicitar la placa.",
        "La instalación se realiza tradicionalmente en la semana posterior a su aprobación.",
        "Beneficio vitalicio mientras se mantenga la suscripción activa."
      ]}
    />
  );
};

export default PlacaRectaPage;