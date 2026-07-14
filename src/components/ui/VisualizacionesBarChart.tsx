import { useMemo } from "react";
import { Eye, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function VisualizacionesBarChart({ metricasVisualizaciones }: { metricasVisualizaciones: any[] }) {
  const chartData = useMemo(() => {
    return metricasVisualizaciones && metricasVisualizaciones.length > 0 ? metricasVisualizaciones : [
        { mes: "Ene", vistas: 12500 },
        { mes: "Feb", vistas: 18200 },
        { mes: "Mar", vistas: 15400 },
        { mes: "Abr", vistas: 22100 },
        { mes: "May", vistas: 45000 }, 
        { mes: "Jun", vistas: 98000 },
        { mes: "Jul", vistas: 32000 }
    ];
  }, [metricasVisualizaciones]);

  const chartConfig = {
    vistas: { label: "Visitas / Vistas", color: "#8b5cf6" } // Violeta para destacar
  };

  return (
    <Card className="bg-white dark:bg-[#110c1b] border-slate-200 dark:border-white/10 shadow-md w-full">
      <CardHeader>
        <CardTitle className="dark:text-white uppercase tracking-wider font-black text-sm flex items-center gap-2">
          <Eye className="text-violet-500" size={16} /> Alcance y Visualizaciones Mensuales
        </CardTitle>
        <CardDescription>Tráfico e interacciones consolidadas</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="mes"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "#64748b", fontWeight: "bold" }}
            />
            <YAxis hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" formatter={(value) => `${Number(value).toLocaleString('es-AR')} vistas`} />} />
            <Bar dataKey="vistas" fill="var(--color-vistas)" radius={[4, 4, 0, 0]}>
              <LabelList 
                dataKey="vistas" 
                position="top" 
                offset={8} 
                className="fill-slate-700 dark:fill-white font-bold text-xs" 
                formatter={(v: any) => `${(v/1000).toFixed(1)}k`} 
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm border-t border-slate-200 dark:border-white/10 pt-4">
        <div className="flex gap-2 leading-none font-medium text-green-500">
          Crecimiento orgánico sostenido <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-slate-500">
          Refleja el impacto directo de las campañas de prensa activas.
        </div>
      </CardFooter>
    </Card>
  );
}