import { Eye, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

export function VisualizacionesBarChart({ metricas }: { metricas: any[] }) {
  // Configuramos los 3 colores para nuestras 3 categorías
  const chartConfig = {
    noticia: { label: "Noticias", color: "#8b5cf6" }, // Violeta
    imagen: { label: "Imágenes", color: "#0ea5e9" },  // Celeste
    video: { label: "Videos", color: "#f59e0b" },     // Naranja
  } satisfies ChartConfig;

  // Filtramos los meses vacíos al final del año si lo deseas (opcional)
  // const dataActiva = metricas?.filter(m => m.total > 0) || [];
  
  return (
    <Card className="flex flex-col bg-white dark:bg-[#110c1b] border-slate-200 dark:border-white/10 shadow-md w-full">
      <CardHeader>
        <CardTitle className="dark:text-white uppercase tracking-wider font-black text-sm flex items-center gap-2">
          <Eye className="text-violet-500" size={16} /> Alcance y Visualizaciones Mensuales
        </CardTitle>
        <CardDescription>Tráfico consolidado por formato de contenido</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 pb-4">
        {metricas && metricas.length > 0 ? (
          <ChartContainer config={chartConfig} className="w-full h-[300px]">
            <BarChart data={metricas} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="mes" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={10} 
                tick={{ fill: "#64748b", fontSize: 12 }} 
              />
              <YAxis 
                tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val} 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: "#64748b", fontSize: 12 }}
                width={50}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                content={<ChartTooltipContent />} 
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
              
              {/* stackId="a" apila las barras. Ajustamos el radius solo en la barra superior (video) */}
              <Bar dataKey="noticia" stackId="a" fill="var(--color-noticia)" />
              <Bar dataKey="imagen" stackId="a" fill="var(--color-imagen)" />
              <Bar dataKey="video" stackId="a" fill="var(--color-video)" radius={[4, 4, 0, 0]} />
              
            </BarChart>
          </ChartContainer>
        ) : (
           <div className="flex items-center justify-center h-[300px] text-slate-400 text-xs font-bold uppercase tracking-widest">
            Sin métricas de alcance registradas
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex-col items-start gap-2 text-sm border-t border-slate-200 dark:border-white/5 pt-4">
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