import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function FinanzasBarChart({ metricasFinanzas }: { metricasFinanzas: any[] }) {
  const configFinanzas = { ingresos: { label: "Recaudación", color: "#0ea5e9" } };

  return (
    <Card className="bg-white dark:bg-[#110c1b] border-slate-200 dark:border-white/10">
      <CardHeader>
        <CardTitle className="dark:text-white uppercase tracking-wider font-black flex items-center gap-2">
          <TrendingUp className="text-institucional-celeste" /> Evolución Financiera
        </CardTitle>
        <CardDescription className="subtitle-fan">
          Ingresos mensuales del {new Date().toLocaleDateString('es-AR', { year: 'numeric' })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={configFinanzas} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={metricasFinanzas} layout="vertical" margin={{ right: 40 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#334155" />
            <YAxis dataKey="mes" type="category" tickLine={false} tickMargin={10} axisLine={false} hide />
            <XAxis dataKey="ingresos" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Bar dataKey="ingresos" fill="#0ea5e9" radius={4}>
              <LabelList dataKey="mes" position="insideLeft" offset={8} className="fill-white font-medium" fontSize={12} />
              <LabelList dataKey="ingresos" position="right" offset={8} className="fill-slate-700 dark:fill-white font-bold" fontSize={12} formatter={(v: any) => `$${(v/1000)}k`} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm border-t border-slate-200 dark:border-white/10 pt-4">
        <div className="flex gap-2 leading-none font-medium text-green-500">
          Tendencia alcista detectada <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-slate-500">
          Mostrando recaudación histórica mensual.
        </div>
      </CardFooter>
    </Card>
  );
}