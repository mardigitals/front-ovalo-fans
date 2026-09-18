import PlantillaBeneficio from '@/components/ui/PlantillaBeneficio';
import { CircleStar } from 'lucide-react';

const VipBoxesPage = () => {
  return (
    <PlantillaBeneficio
      titulo="VIP Boxes"
      descripcion="Viví la carrera desde adentro. Accedé a la zona exclusiva de boxes durante el fin de semana de Turismo Carretera."
      tipoBeneficio="VIP_BOXES"
      icono={CircleStar}
      colorBase="text-yellow-500"
      bgBase="bg-yellow-500/10"
      requiereEvento={true} // <-- ACÁ ACTIVAS EL SELECTOR
      tipoEventoFiltro="TC"   // <-- FILTRAS SOLO LOS TC
      reglas={[
        "Beneficio exclusivo para Socios Nivel P1.",
        "Requiere 12 meses de antigüedad ininterrumpida y 12 pagos registrados en el último año.",
        "Válido únicamente para fechas de Turismo Carretera (TC) del año en curso.",
        "Se otorga 1 (una) credencial de acceso por año calendario.",
        "La credencial es física e intransferible. Una vez aprobada tu solicitud, el Staff te informará por email los días y horarios para retirarla.",
        "Deberás presentar tu DNI al momento del retiro y en los controles de acceso al autódromo."
      ]}
    />
  );
};

export default VipBoxesPage;