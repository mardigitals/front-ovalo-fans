import { useState, useEffect } from 'react';
import { Thermometer, InfoIcon, MapPinIcon, Droplets, Wind, Loader2, CloudSun } from 'lucide-react';
import api from '@/api/axios';

export function ClimaInfo() {
  const [clima, setClima] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClima = async () => {
      try {
        const response = await api.get('/clima/rafaela');
        // Adaptá estas propiedades según cómo devuelva los datos tu ClimaService de NestJS
        setClima(response.data);
      } catch (error) {
        console.error("Error al cargar el clima:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClima();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-sm bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10">
        <Loader2 className="h-4 w-4 animate-spin text-institucional-celeste" /> 
        <span className="font-mono uppercase tracking-widest text-xs">Cargando radar...</span>
      </div>
    );
  }

  // Si falla la API, no mostramos nada para no romper el diseño
  if (!clima) return null; 

  return (
    <div className="flex items-center gap-4 bg-white/80 dark:bg-[#110c1b]/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm text-sm transition-all hover:border-institucional-celeste/30">
      {/*Titulo de la ciudad */}
      <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-white text-xl">
        <CloudSun size={26} className="text-institucional-celeste m-1" />
        <span className="flex items-center gap-1" title="Ciudad">
          <MapPinIcon size={18} className="text-slate-400 ml-2" /> 
          {clima.ciudad ?? '--'} 
        </span>
      </div>

      {/* Temperatura y humedad */}
      <div className="flex items-center gap-1.5 font-black text-slate-800 dark:text-white text-lg">
        <span className="flex items-center gap-1" title="Temperatura">
            <Thermometer size={18} className="text-amber-500 ml-2" />
            {clima.temperatura ?? '--'}°C
        </span>
        <span className="flex items-center gap-1" title="Humedad">
          <Droplets size={14} className="text-sky-400 ml-2" /> 
          {clima.humedad ?? '--'}%
        </span>
      </div>

       
      {/* Detalles Extras (Ocultos en celulares muy chicos, visibles en PC/Tablet) */}
      <div className="hidden sm:flex items-center gap-3 text-slate-500 font-medium border-l border-slate-200 dark:border-white/10 pl-4 text-xs font-mono">
        <span className="flex items-center gap-1" title="Viento">
          <Wind size={14} className="text-slate-400" /> 
          {clima.viento ?? '--'} km/h
        </span>
        <span className="flex items-center gap-1" title="Descripción">
           <InfoIcon className="h-4 w-4 text-slate-400" />
           {clima.descripcion ?? '--'}          
        </span>
      </div>
    </div>
  );
}