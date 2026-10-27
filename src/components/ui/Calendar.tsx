import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import  logo  from "@/assets/icons/logo-autodromo-color.png";


const obtenerEstadoDinamico = (fechaInicioStr: string, fechaFinStr?: string) => {
  if (!fechaInicioStr) return 'PROGRAMADO';

  const ahora = new Date().getTime();
  const inicio = new Date(fechaInicioStr).getTime();
  // Si no hay fecha fin, asumimos que dura el mismo día hasta medianoche
  const fin = fechaFinStr ? new Date(fechaFinStr).getTime() : inicio + (24 * 60 * 60 * 1000) - 1;

  if (ahora >= inicio && ahora <= fin) {
    return 'EN CURSO';
  }
  if (ahora > fin) {
    return 'FINALIZADO';
  }
  return 'PROGRAMADO';
};

const Calendar = ({ eventos }: { eventos: any[] }) => {
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Domingo

  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const goToday = () => setViewDate(new Date());

  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const emptyDays = Array.from({ length: firstDayIndex }).map((_, i) => <div key={`empty-${i}`} className="p-2" />);
  
  const days = Array.from({ length: daysInMonth }).map((_, i) => {
    const dayNumber = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
    const isToday = new Date().toISOString().split('T')[0] === dateStr;

    const getLocalYYYYMMDD = (dateString: string) => {
      const d = new Date(dateString);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    const eventosDelDia = eventos.filter(e => {
      if (!e.fecha_evento) return false;
      const inicioStr = getLocalYYYYMMDD(e.fecha_evento);
      const finStr = e.fecha_evento_fin ? getLocalYYYYMMDD(e.fecha_evento_fin) : inicioStr;
      return dateStr >= inicioStr && dateStr <= finStr;
    });

    return (
      <div
        key={dayNumber}
        className={`p-2 min-h-[80px] md:min-h-[100px] border rounded-xl flex flex-col gap-1 transition-all backdrop-blur-md
        ${isToday 
          ? 'bg-institucional-celeste/10 border-institucional-celeste/40 shadow-[0_0_15px_rgba(14,165,233,0.3)]' 
          : 'bg-white/70 dark:bg-black/90 border-slate-200 dark:border-white/5 shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:border-slate-300 dark:hover:border-white/10'}
        `}
      >
        <span className={`text-sm font-bold ${isToday ? 'text-institucional-celeste' : 'text-slate-700 dark:text-slate-300'}`}>
          {dayNumber}
        </span>
        
        <div className="flex flex-col gap-1 overflow-y-auto max-h-[70px] scrollbar-hidden">
         {eventosDelDia.map(ev => {
            const estadoVirtual = obtenerEstadoDinamico(ev.fecha_evento);
            
            let glassStyle = "bg-cyan-500/20 dark:bg-cyan-400/20 subtitle-fan shadow-[0_0_15px_rgba(14,165,233,0.3)] border-cyan-500/30";
            if (estadoVirtual === 'FINALIZADO') {
               glassStyle = "bg-slate-500/15 dark:bg-slate-400/20 text-slate-700 dark:text-slate-300 border-slate-500/30";
            }

           return (
              <div 
                key={ev.id} 
                className={`${glassStyle} backdrop-blur-md border text-[10px] md:text-xs font-bold uppercase px-1.5 py-1 rounded-lg shadow-sm whitespace-normal break-words leading-tight cursor-pointer transition-all hover:scale-[1.02]`}
                title={`${ev.titulo} - ${new Date(ev.fecha_evento).toLocaleTimeString('es-AR', {hour: '2-digit', minute:'2-digit'})}`}
              >
                {ev.titulo}
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  return (
    <div className="subtitle-fan text-sm  bg-sky-500 px-2 py-1 rounded-2xl hover:text-sky-500 transition-colors shadow-[0_0_15px_rgba(14,165,233,0.3)] p-5 md:p-8 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="subtitle-fan md:text-lg flex items-center gap-2">
           <div className="flex items-center gap-2">
              <img src={logo} alt="Logo Autódromo" className="h-4 md:h-7 w-auto" />
            </div>
         Calendario Oficial
        </h2>

       
          
        
        <div className="flex items-center gap-4 bg-slate-100/80 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-full px-3 py-1.5 shadow-[0_0_15px_rgba(14,165,233,0.3)] backdrop-blur-md">
          <button type="button" onClick={prevMonth} className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors">
            <ChevronLeft size={18} />
          </button>
          
          <span className="title-fan text-base md:text-lg text-slate-800 dark:text-white uppercase tracking-wider min-w-[160px] text-center">
            {meses[month]} <span className="text-institucional-celeste">{year}</span>
          </span>
          
          <button type="button" onClick={nextMonth} className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>

        <button onClick={goToday} className="text-xs subtitle-fan hover:text-sky-400 uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(14,165,233,0.3)] py-1 px-3 rounded-full hover:bg-institucional-celeste/10">
          Ir a Hoy
        </button>
      </div>

      <div className="md:flex-row justify-between gap-4 mb-8">
        <span className="bg-slate-500/15 m-2 dark:bg-slate-400/20 text-slate-700 dark:text-slate-300 border-slate-500/30 backdrop-blur-md border text-[11px] md:text-xs font-bold uppercase px-2 py-1 rounded-lg shadow-sm truncate cursor-help transition-all hover:scale-[1.02]">
           FINALIZADO
        </span>
        <span className="bg-cyan-500/20 dark:bg-cyan-400/20 subtitle-fan shadow-[0_0_15px_rgba(14,165,233,0.3)] border-cyan-500/30 backdrop-blur-md border text-[11px] md:text-xs font-bold uppercase px-2 py-1 rounded-lg shadow-sm truncate cursor-help transition-all hover:scale-[1.02]">
           PROGRAMADO
        </span>
      
      </div>

      <div className="grid grid-cols-7 gap-2 mb-3">
        {diasSemana.map(d => (
          <div key={d} className="text-center text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {emptyDays}
        {days}
      </div>
    </div>
  );
};

export default Calendar;