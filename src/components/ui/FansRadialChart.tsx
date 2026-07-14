import { PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart, Label } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

export function FansRadialChart({ activos }: { activos: number }) {
  const radialData = [{ browser: "fans", visitors: activos, fill: "#0b97f5" }];
  const configRadial = { visitors: { label: "Fans Activos" }, fans: { label: "Fans", color: "#0b97f5" } };

  return (
    <Card className="flex flex-col bg-white dark:bg-[#110c1b] border-slate-200 dark:border-white/10">
      <CardHeader className="items-center pb-0">
        <CardTitle className="dark:text-white text-sm font-black uppercase tracking-wider">Comunidad Óvalo Activa</CardTitle>
        <CardDescription>P1 + P2 + P3 FANS</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={configRadial} className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart data={radialData} endAngle={100} innerRadius={65} outerRadius={95}>
            <PolarGrid gridType="circle" radialLines={false} stroke="none" className="first:fill-slate-100 dark:first:fill-white/5 last:fill-transparent" polarRadius={[86, 74]} />
            <RadialBar dataKey="visitors" background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-institucional-celeste text-4xl font-bold">
                          {activos.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-slate-500 text-xs">
                          Fans
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}