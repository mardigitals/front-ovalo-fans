import { TrendingUp, DollarSign } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartData = [
  { mes: "Ene", p2: 186000, p3: 80000 },
  { mes: "Feb", p2: 305000, p3: 200000 },
  { mes: "Mar", p2: 237000, p3: 120000 },
  { mes: "Abr", p2: 373000, p3: 190000 },
  { mes: "May", p2: 409000, p3: 230000 },
  { mes: "Jun", p2: 480000, p3: 290000 },
];

const chartConfig = {
  p2: {
    label: "P2 FAN ($)",
    color: "#0ea5e9", // Sky blue
  },
  p3: {
    label: "P3 FAN ($)",
    color: "#8b5cf6", // Violeta
  },
} satisfies ChartConfig;

export function MrrChart() {
  return (
    <Card className="bg-white dark:bg-[#110c1b] border-slate-200 dark:border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle className="dark:text-white uppercase tracking-wider font-black text-lg flex items-center gap-2">
          <DollarSign className="text-institucional-celeste" /> MRR por Membresía
        </CardTitle>
        <CardDescription>Ingreso Mensual Recurrente (Solo Activos)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ left: 10 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="mes"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" formatter={(value) => `$${Number(value).toLocaleString('es-AR')}`} />}
            />
            <Bar dataKey="p2" fill="var(--color-p2)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="p3" fill="var(--color-p3)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium text-green-500">
          Crecimiento del MRR del 12% este mes <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-slate-500">
          Proyección basada en {new Date().toLocaleDateString('es-AR', { year: 'numeric' })}
        </div>
      </CardFooter>
    </Card>
  );
}