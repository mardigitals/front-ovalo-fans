import { Map } from 'lucide-react'; // O el ícono que prefieras

// Este componente recibe el string exacto que guardaste en la base de datos (ej: "Chicana 1")
const ChicanaFavorita = ({ chicanaEscogida }: { chicanaEscogida: string }) => {
  
  // Mapeamos el texto de la base de datos con la imagen y un pequeño texto
  const getChicanaData = (chicana: string) => {
    switch (chicana) {
      case '1 de adentro':
        return {
          nombre: 'CHICANA 1 (Adentro)',
          img: '/public/images/chicana 1 tc.jpg', 
          desc: ''
        };
      case '1 de afuera':
        return {
          nombre: 'CHICANA 1 (Afuera)',
          img: '/public/images/chicana 1 afuera.jpg',
          desc: ''
        };
      case '2 de adentro':
        return {
          nombre: 'CHICANA 2 (Adentro)',
          img: '/public/images/chicana 2.jpg',
          desc: ''
        };
      case '2 de afuera':
        return {
          nombre: 'CHICANA 2 (Afuera)',
          img: '/public/images/chicana 2.jpg',
          desc: ''
        };
      case '3':
        return {
          nombre: 'CHICANA 3',
          img: '/public/images/chicana tres.jpg',
          desc: ''
        };
      default:
        return {
          nombre: 'Sin definir',
          img: '/chicanas/default.png',
          desc: 'Aún no elegiste tu chicana favorita.'
        };
    }
  };

  const data = getChicanaData(chicanaEscogida);

  return (
    <div className="bg-white dark:bg-[#161024] border border-slate-200 dark:border-white/10 p-5 rounded-3xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Círculo con la imagen de la chicana */}
      <div className="w-40 h-20 rounded-full bg-slate-100 dark:bg-white/5 border-2 border-institucional-celeste/80 flex-shrink-0 overflow-hidden relative flex items-center justify-center">
        {data.img ? (
           <img src={data.img} alt={data.nombre} className="w-full h-full object-cover" />
        ) : (
           <Map className="text-institucional-celeste/50" size={32} />
        )}
      </div>

      {/* Textos */}
      <div>
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">Favorita</h4>
        <p className="text-lg font-black text-slate-800 dark:text-white uppercase leading-none mb-1">
          {data.nombre}
        </p>
        <p className="text-xs font-medium text-slate-500">
          {data.desc}
        </p>
      </div>
    </div>
  );
};

export default ChicanaFavorita;