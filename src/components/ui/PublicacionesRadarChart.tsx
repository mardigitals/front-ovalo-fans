import { useMemo } from "react";
import { Megaphone } from "lucide-react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function PublicacionesRadarChart({ publicaciones }: { publicaciones: any[] }) {
  const chartData = useMemo(() => {
    return publicaciones && publicaciones.length > 0 ? publicaciones : [
      { canal: "Instagram", cantidad: 120 },
      { canal: "Web Oficial", cantidad: 45 },
      { canal: "Gacetillas", cantidad: 15 },
      { canal: "Youtube", cantidad: 8 },
      { canal: "Twitter / X", cantidad: 85 }
    ];
  }, [publicaciones]);

  const chartConfig = {
    cantidad: { label: "Publicaciones", color: "#0ea5e9" }
  };

  return (
    <Card className="flex flex-col bg-white dark:bg-[#110c1b] border-slate-200 dark:border-white/10 shadow-md w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="dark:text-white uppercase tracking-wider font-black text-sm flex items-center gap-2">
          <Megaphone className="text-amber-500" size={16} /> Canales de Difusión
        </CardTitle>
        <CardDescription>Volumen de contenido por plataforma</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-1 ">
        <ChartContainer config={chartConfig} className="mx-auto w-full aspect-square max-h-[250px]">
          <RadarChart data={chartData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="canal" tick={{ fill: "#64748b", fontSize: 12, fontWeight: "bold" }} />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
            <Radar
              name="Publicaciones"
              dataKey="cantidad"
              stroke="#0ea5e9"
              fill="#0ea5e9"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}