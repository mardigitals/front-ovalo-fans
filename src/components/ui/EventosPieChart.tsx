import { useMemo } from "react";
import { CalendarDays } from "lucide-react";
import { Pie, PieChart, Sector } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

export function EventosPieChart({ tipos }: { tipos: any[] }) {
  // Paleta de colores para tipos de eventos
  const colores = ["#0ea5e9", "#f59e0b", "#8b5cf6", "#22c55e", "#ef4444", "#ec4899", "#14b8a6"];

  const chartData = useMemo(() => {
    return (tipos || []).map((item, index) => ({
      ...item,
      fill: colores[index % colores.length],
    }));
  }, [tipos]);

  const chartConfig = useMemo(() => {
    const config: Record<string, any> = { value: { label: "Eventos" } };
    chartData.forEach((item) => {
      // Usamos item.name porque así lo estructuramos en la consulta del backend
      config[item.name] = { label: item.name, color: item.fill };
    });
    return config satisfies ChartConfig;
  }, [chartData]);

  return (
    <Card className="flex flex-col bg-white dark:bg-[#110c1b] border-slate-200 dark:border-white/10 shadow-md w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="dark:text-white uppercase tracking-wider font-black text-sm flex items-center gap-2">
          <CalendarDays className="text-institucional-celeste" size={16} /> Tipos de Eventos
        </CardTitle>
        <CardDescription>Distribución del calendario anual</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        
        {/* Renderizado condicional: si hay datos muestra el gráfico, sino un texto */}
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="value" // <-- Ajustado para coincidir con la DB
                nameKey="name"  // <-- Ajustado para coincidir con la DB
                innerRadius={60}
                strokeWidth={5}
                activeIndex={0}
                activeShape={(props: any) => (
                  <Sector {...props} outerRadius={(props.outerRadius || 0) + 10} />
                )}
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-slate-400 text-xs font-bold uppercase tracking-widest">
            Sin eventos registrados
          </div>
        )}

      </CardContent>
    </Card>
  );
}