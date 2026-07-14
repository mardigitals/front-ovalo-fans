import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Mock de datos (luego lo reemplazás con tu API)
const chartData = [
  { mes: "Ene", altas: 18, bajas: 2 },
  { mes: "Feb", altas: 35, bajas: 5 },
  { mes: "Mar", altas: 23, bajas: 8 },
  { mes: "Abr", altas: 47, bajas: 3 },
  { mes: "May", altas: 52, bajas: 10 },
  { mes: "Jun", altas: 64, bajas: 4 },
];

const chartConfig = {
  altas: {
    label: "Nuevas Suscripciones",
    color: "#22c55e", // Verde éxito
    icon: TrendingUp,
  },
  bajas: {
    label: "Cancelaciones",
    color: "#ef4444", // Rojo alerta
    icon: TrendingDown,
  },
} satisfies ChartConfig;

export function AltasBajasChart() {
  return (
    <Card className="bg-white dark:bg-[#110c1b] border-slate-200 dark:border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle className="dark:text-white uppercase tracking-wider font-black text-lg">
          Evolución de Retención
        </CardTitle>
        <CardDescription>Altas vs. Bajas en los últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="mes"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="bajas"
              type="monotone"
              fill="var(--color-bajas)"
              fillOpacity={0.2}
              stroke="var(--color-bajas)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="altas"
              type="monotone"
              fill="var(--color-altas)"
              fillOpacity={0.2}
              stroke="var(--color-altas)"
              strokeWidth={2}
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium text-green-500">
              Tendencia positiva en retención <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-slate-500">
              Mostrando actividad histórica del 2026
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}