import { useMemo } from "react";
import { CalendarDays } from "lucide-react";
import { Pie, PieChart, Sector } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

export function EventosPieChart({ tipos }: { tipos: any[] }) {
  // Paleta de colores para tipos de eventos
  const colores = ["#0ea5e9", "#f59e0b", "#8b5cf6", "#22c55e", "#ef4444"];

  const chartData = useMemo(() => {
    // Si no hay datos, usamos un mock temporal para poder maquetar
    const data = tipos && tipos.length > 0 ? tipos : [
      { tipo: "TC / Nacionales", cantidad: 4 },
      { tipo: "Zonales", cantidad: 8 },
      { tipo: "Pruebas Libres", cantidad: 12 },
      { tipo: "Eventos Extra", cantidad: 2 }
    ];

    return data.map((item, index) => ({
      ...item,
      fill: colores[index % colores.length],
    }));
  }, [tipos]);

  const chartConfig = useMemo(() => {
    const config: Record<string, any> = { cantidad: { label: "Eventos" } };
    chartData.forEach((item) => {
      config[item.tipo] = { label: item.tipo, color: item.fill };
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
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="cantidad"
              nameKey="tipo"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={0}
              activeShape={(props: any) => (
                <Sector {...props} outerRadius={(props.outerRadius || 0) + 10} />
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}