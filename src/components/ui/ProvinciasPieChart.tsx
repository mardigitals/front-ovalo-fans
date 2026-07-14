import { useMemo } from "react";
import { Map, MapPin } from "lucide-react";
import { Pie, PieChart, Sector } from "recharts";

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

export function ProvinciasPieChart({ provincias }: { provincias: any[] }) {
  
  // Paleta de colores institucionales
  const colores = ["#0ea5e9", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#64748b"];

  // 1. Formateamos la data de la API dinámicamente
  const chartData = useMemo(() => {
    if (!provincias || provincias.length === 0) return [];
    
    // Asumimos que el backend devuelve un array ordenado de mayor a menor
    return provincias.map((p, index) => ({
      provincia: p.provincia || 'Desconocida',
      cantidad: Number(p.cantidad || 0),
      fill: colores[index % colores.length], // Asigna colores cíclicamente
    }));
  }, [provincias]);

  // 2. Generamos el ChartConfig de Shadcn en base a los datos que llegaron
  const chartConfig = useMemo(() => {
    const config: Record<string, any> = {
      cantidad: { label: "Fans" },
    };
    chartData.forEach((item) => {
      config[item.provincia] = {
        label: item.provincia,
        color: item.fill,
      };
    });
    return config satisfies ChartConfig;
  }, [chartData]);

  const ACTIVE_INDEX = 0; // Destaca siempre el primer resultado
  const provinciaPrincipal = chartData[0]?.provincia || 'tu región';

  // Si aún no hay datos o el array viene vacío
  if (chartData.length === 0) {
      return (
          <Card className="flex flex-col bg-white dark:bg-[#110c1b] border-slate-200 dark:border-white/10 shadow-md h-full w-full justify-center items-center p-6 text-slate-500">
              Cargando demografía provincial...
          </Card>
      );
  }

  return (
    <Card className="flex flex-col bg-white dark:bg-[#110c1b] border-slate-200 dark:border-white/10 shadow-md w-full mx-auto">
      <CardHeader className="items-center pb-0">
        <CardTitle className="dark:text-white uppercase tracking-wider font-black text-sm flex items-center gap-2">
          <Map className="text-institucional-celeste" size={16} /> Distribución Provincial
        </CardTitle>
        <CardDescription>Zonas con mayor concentración de fans</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
            data={chartData}
            dataKey="cantidad"
            nameKey="provincia"
            innerRadius={60}
            strokeWidth={5}
            activeIndex={ACTIVE_INDEX}
            activeShape={(props: any) => (
                <Sector 
                {...props} 
                outerRadius={(props.outerRadius || 0) + 10} 
                />
            )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm border-t border-slate-200 dark:border-white/10 pt-2">
        <div className="flex items-center gap-2 leading-none font-medium text-institucional-celeste">
          Fuerte presencia local en {provinciaPrincipal} <MapPin className="h-4 w-4" />
        </div>
        <div className="leading-none text-slate-500">
          Mostrando datos provistos por los perfiles de usuarios.
        </div>
      </CardFooter>
    </Card>
  );
}