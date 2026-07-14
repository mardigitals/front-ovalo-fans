import { useMemo } from "react";
import { Pie, PieChart, Label } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function SuscripcionesDonutChart({ metricasEstados }: { metricasEstados: any }) {
  const datosSuscripcionesShadcn = useMemo(() => [
    { estado: "Activo", cantidad: metricasEstados.Activo, fill: "#22c55e" },
    { estado: "Pendiente", cantidad: metricasEstados.Pendiente, fill: "#64748b" },
    { estado: "Vencido", cantidad: metricasEstados.Vencido, fill: "#efde44" },
    { estado: "Cancelado", cantidad: metricasEstados.Cancelado, fill: "#be2323" },
  ].filter(d => d.cantidad > 0), [metricasEstados]);
    
  const configSuscripciones = {
    cantidad: { label: "Suscripciones" },
    Activo: { label: "Activos", color: "#22c55e" },
    Pendiente: { label: "Pendientes", color: "#64748b" },
    Vencido: { label: "Vencidos", color: "#efde44" },
    Cancelado: { label: "Cancelados", color: "#be2323" },
  };

  return (
    <Card className="flex flex-col bg-white dark:bg-[#110c1b] border-slate-200 dark:border-white/10">
      <CardHeader className="items-center pb-0">
        <CardTitle className="dark:text-white text-sm font-black uppercase tracking-wider">Estado de Suscripciones</CardTitle>
        <CardDescription>En tiempo real</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={configSuscripciones} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={datosSuscripcionesShadcn} dataKey="cantidad" nameKey="estado" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-slate-800 dark:fill-white text-3xl font-bold">
                          {metricasEstados.Total.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-slate-500 text-xs">
                          Totales
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}