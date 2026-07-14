import { useMemo } from "react";
import { Pie, PieChart, Label } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function ChicanasPieChart({ chicanas }: { chicanas: any[] }) {
  const coloresSectores = ["#0b97f5", "#0b97f5d5", "#0b97f58f", "#0b97f557", "#0b97f527"];
  
  const datosSectoresShadcn = useMemo(() => {
    const sorted = [...chicanas].sort((a, b) => b.fans - a.fans);
    return sorted.map((c, i) => ({
      browser: c.nombre,
      visitors: c.fans,
      fill: coloresSectores[i % coloresSectores.length]
    }));
  }, [chicanas]);

  const configSectores = { visitors: { label: "Fans" } };

  return (
    <Card className="flex flex-col bg-white dark:bg-[#110c1b] border-slate-200 dark:border-white/10">
      <CardHeader className="items-center pb-0">
        <CardTitle className="dark:text-white text-sm font-black uppercase tracking-wider">Sectores Favoritos</CardTitle>
        <CardDescription>Top Chicanas elegidas</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={configSectores} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={datosSectoresShadcn} dataKey="visitors" nameKey="browser" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-institucional-celeste text-xl font-bold">
                          {datosSectoresShadcn[0]?.browser || "-"}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-slate-500 text-[10px] uppercase">
                          Favorito
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