import { Award, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Mock de los socios más antiguos
const topSocios = [
  { id: 1, nombre: "Gustavo", apellido: "Belinde", plan: "P2 FAN", mesesActivo: 14 },
  { id: 2, nombre: "Francisco", apellido: "Paravano", plan: "P3 FAN", mesesActivo: 14 },
  { id: 3, nombre: "Nadia", apellido: "Ricotti", plan: "P2 FAN", mesesActivo: 13 },
  { id: 4, nombre: "Mauro", apellido: "Medina", plan: "P2 FAN", mesesActivo: 12 },
  { id: 5, nombre: "Lionel", apellido: "Messi", plan: "P3 FAN", mesesActivo: 11 },
];

export function TopSociosList() {
  return (
    <Card className="bg-white dark:bg-[#110c1b] border-slate-200 dark:border-white/10 shadow-lg flex flex-col h-full">
      <CardHeader>
        <CardTitle className="dark:text-white uppercase tracking-wider font-black text-lg flex items-center gap-2">
          <Award className="text-amber-500" /> Salón de la Fama
        </CardTitle>
        <CardDescription>Top Fans con mayor antigüedad ininterrumpida.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto pr-2">
        <div className="space-y-4">
          {topSocios.map((socio, index) => (
            <div key={socio.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm
                  ${index === 0 ? 'bg-amber-500 text-white' : 
                    index === 1 ? 'bg-slate-400 text-white' : 
                    index === 2 ? 'bg-amber-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase">
                    {socio.nombre} {socio.apellido}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <ShieldCheck size={12} className={socio.plan === 'P2 FAN' ? 'text-institucional-celeste' : 'text-slate-400'}/>
                    {socio.plan}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-lg text-slate-700 dark:text-white">{socio.mesesActivo}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Meses</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}