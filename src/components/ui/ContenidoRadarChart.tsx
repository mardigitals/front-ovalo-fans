// import { useMemo } from "react";
import { Megaphone } from "lucide-react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function ContenidoRadarChart({ contenido }: { contenido: any[] }) {
  const chartConfig = {
    vistas: { label: "Vistas Totales", color: "#0ea5e9" }
  };

  return (
    <Card className="flex flex-col bg-white dark:bg-[#110c1b] border-slate-200 dark:border-white/10 shadow-md w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="dark:text-white uppercase tracking-wider font-black text-sm flex items-center gap-2">
          <Megaphone className="text-amber-500" size={16} /> Interacción por tipo de contenido
        </CardTitle>
        <CardDescription>Formatos más vistos por la comunidad</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-1">
        
        {contenido && contenido.length > 0 ? (
          <ChartContainer config={chartConfig} className="mx-auto w-full aspect-square max-h-[250px]">
            <RadarChart data={contenido} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="formato" tick={{ fill: "#64748b", fontSize: 12, fontWeight: "bold" }} />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
              <Radar
                name="Vistas"
                dataKey="vistas"
                stroke="#0ea5e9"
                fill="#0ea5e9"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-slate-400 text-xs font-bold uppercase tracking-widest">
            Sin métricas de vistas
          </div>
        )}
        
      </CardContent>
    </Card>
  );
}