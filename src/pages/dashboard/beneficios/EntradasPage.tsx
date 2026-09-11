import { useEffect, useState } from 'react';
import { QrCode, Ticket, AlertTriangle, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import api from '@/api/axios';

const EntradasPage = () => {
    const { userProfile } = useAuth();
    const [paso, setPaso] = useState(1);
    const [generando, setGenerando] = useState(false);
    const [qrData, setQrData] = useState('');
    const [errorBackend, setErrorBackend] = useState<string | null>(null);
    const [eventos, setEventos] = useState<any[]>([]);
    const [eventoSeleccionado, setEventoSeleccionado] = useState<string>('');

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                // Asumiendo que tenés un endpoint para traer eventos. Podés filtrar acá los que son tipo 'Carrera'
                const res = await api.get('/evento');
                const carreras = res.data.filter((e: any) => e.tipo_evento === 'Carrera');
                setEventos(carreras); 
            } catch (error) {
                console.error("Error cargando carreras:", error);
            }
        };
        fetchEventos();
    }, []);

    const generarVoucher = async () => {
        if (!eventoSeleccionado) {
            setErrorBackend('Seleccioná una carrera primero.');
            return;
        }

        setGenerando(true);
        setErrorBackend(null);
        try {
            const res = await api.post('/uso-beneficio', {
                tipo_beneficio: 'DESC_CARRERAS', 
                evento_id: Number(eventoSeleccionado)
            });

            const codigoUnico = res.data.codigo_qr || `DESC-CARRERA-${userProfile?.id}-${Date.now()}`;
            setQrData(codigoUnico);
            setPaso(2);
        } catch (error: any) {
            setErrorBackend(error.response?.data?.message || 'Error al generar el descuento');
        } finally {
            setGenerando(false);
        }
    };

    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}&margin=10`;

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
            <Link to="/dashboard/beneficios" className="inline-flex items-center gap-2 text-slate-500 hover:text-institucional-celeste transition-colors font-bold uppercase text-xs tracking-widest">
              <ChevronLeft size={16} /> Volver a Beneficios
            </Link>

            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                <Ticket className="text-orange-500" size={32} />
                Descuento Carreras
            </h1>

            <div className="bg-white dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-xl text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-5 pointer-events-none">
                    <Ticket size={250} />
                </div>

                {paso === 1 ? (
                    <div className="relative z-10 flex flex-col items-center py-8">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                            Tu Voucher de Descuento
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm">
                            Generá tu código QR y presentalo en la boletería del autódromo junto con tu DNI para aplicar el descuento.
                        </p>

                        <div className="w-full max-w-md mb-8">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 text-left">
                                Seleccioná la Carrera
                            </label>
                            <select 
                                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:border-orange-500 focus:ring-2 outline-none"
                                value={eventoSeleccionado}
                                onChange={(e) => setEventoSeleccionado(e.target.value)}
                            >
                                <option value="" disabled>Elegí una fecha...</option>
                                {eventos.map(evento => (
                                    <option key={evento.id} value={evento.id}>
                                        {evento.titulo} ({new Date(evento.fecha_evento).toLocaleDateString('es-AR')})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {errorBackend && (
                            <div className="bg-red-500/10 border-l-4 border-red-500 text-red-600 dark:text-red-400 p-4 rounded-r-xl mb-8 w-full text-left flex items-start gap-3">
                                <AlertTriangle className="flex-shrink-0 mt-0.5" size={20} />
                                <span className="text-sm font-medium">{errorBackend}</span>
                            </div>
                        )}
                        
                        <button 
                            onClick={generarVoucher}
                            disabled={generando || eventos.length === 0}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xl py-4 px-8 rounded-2xl transition-all flex items-center justify-center gap-3 w-full sm:w-auto disabled:opacity-50"
                        >
                            <QrCode size={28} />
                            {generando ? 'Procesando...' : 'Generar Voucher QR'}
                        </button>
                    </div>
                ) : (
                    <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-500">
                        <h2 className="text-xl font-black text-slate-800 dark:text-white mb-6 uppercase tracking-widest text-orange-500">
                            ¡Voucher Listo!
                        </h2>
                        
                        <div className="bg-white p-4 rounded-3xl border-4 border-slate-900 shadow-2xl mb-8 max-w-[280px] w-full">
                            <img src={qrImageUrl} alt="QR Descuento" className="w-full h-auto rounded-xl" />
                            <p className="text-slate-500 text-xs font-mono font-bold mt-4 tracking-widest text-center uppercase">
                                ID: {qrData.substring(0, 12)}
                            </p>
                        </div>

                        <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded-r-xl text-left flex gap-4 max-w-lg w-full">
                            <AlertTriangle className="text-orange-500 flex-shrink-0 mt-1" size={24} />
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                <strong className="text-orange-500 block mb-1 tracking-wider uppercase text-xs">Instrucciones:</strong>
                                Presentá este código QR directamente en la boletería. El boletero lo escaneará o te pedirá tu DNI para validar tu identidad y aplicar el descuento automáticamente.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EntradasPage;