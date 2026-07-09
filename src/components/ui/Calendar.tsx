import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const obtenerEstadoDinamico = (fechaStr: string) => {
  if (!fechaStr) return 'PROGRAMADO';
  const fechaEv = new Date(fechaStr).getTime();
  const ahora = new Date().getTime();
  return fechaEv > ahora ? 'PROGRAMADO' : 'FINALIZADO';
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
        className={`p-2 min-h-[80px] md:min-h-[100px] border border-slate-200 dark:border-white/5 rounded-lg flex flex-col gap-1 transition-all
        ${isToday ? 'bg-institucional-celeste/5 border-institucional-celeste/30' : 'bg-white dark:bg-[#110c1b]/60 backdrop-blur-sm'}
        `}
      >
        <span className={`text-sm font-bold ${isToday ? 'text-institucional-celeste' : 'text-slate-600 dark:text-slate-400'}`}>
          {dayNumber}
        </span>
        
        <div className="flex flex-col gap-1 overflow-y-auto max-h-[70px] scrollbar-hide">
          {eventosDelDia.map(ev => {
            const estadoVirtual = obtenerEstadoDinamico(ev.fecha_evento);
            let colorBadge = estadoVirtual === 'PROGRAMADO' ? "bg-blue-500" : "bg-slate-500";
            if (ev.estado === 'EN CURSO') colorBadge = "bg-green-500"; // Por si a futuro lo traes de la DB
            if (ev.estado === 'CANCELADO') colorBadge = "bg-red-500";

            return (
              <div 
                key={ev.id} 
                className={`${colorBadge} text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm truncate cursor-help`}
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
    <div className="bg-slate-50/90 dark:bg-[#161024]/90 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-white/10 p-5 shadow-2xl w-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <CalendarIcon size={16} className="text-institucional-celeste" /> Calendario Oficial
        </h2>
        <div className="flex items-center gap-4 bg-white dark:bg-[#08060d] border border-slate-200 dark:border-white/10 rounded-full px-2 py-1 shadow-inner">
          <button type="button" onClick={prevMonth} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <span className="font-black text-slate-800 dark:text-white uppercase tracking-wider min-w-[140px] text-center text-sm md:text-base">
            {meses[month]} {year}
          </span>
          <button type="button" onClick={nextMonth} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
        <button onClick={goToday} className="text-xs font-bold text-institucional-celeste hover:text-sky-400 uppercase tracking-wider transition-colors">
          Ir a Hoy
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {diasSemana.map(d => (
          <div key={d} className="text-center text-xs font-black text-slate-500 dark:text-slate-400 uppercase">{d}</div>
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