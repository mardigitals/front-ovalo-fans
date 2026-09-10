import PlantillaBeneficio from '@/components/ui/PlantillaBeneficio';
import { Gift } from 'lucide-react';

const RegaloSuperfanPage = () => {
  return (
    <PlantillaBeneficio
      titulo="Regalo Superfan"
      descripcion="Solicitá tu kit de merchandising oficial del Óvalo, pensado exclusivamente para nuestros fanáticos más fieles."
      tipoBeneficio="REGALO_SUPERFAN"
      icono={Gift}
      colorBase="text-slate-500"
      bgBase="bg-slate-500/10"
      reglas={[
        "Beneficio para Socios Nivel P1 y P2.",
        "Disponible 1 (una) vez por año calendario.",
        "El kit se retira presencialmente por las oficinas del Autódromo en el día de la coordinación via mail.",
        "Se debe presentar QR de FAN o el DNI del titular al momento de retirar."
      ]}
    />
  );
};

export default RegaloSuperfanPage;