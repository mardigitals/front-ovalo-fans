import { useEffect, useState } from 'react';
import { QrCode, Download, Share2, AlertTriangle, ChevronLeft, AudioLines } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import api from '@/api/axios';

const RecitalesPage = () => {
    const { userProfile } = useAuth();
    const [paso, setPaso] = useState(1);
    const [generando, setGenerando] = useState(false);
    const [qrData, setQrData] = useState('');
    const [errorBackend, setErrorBackend] = useState<string | null>(null);
    const [eventos, setEventos] = useState<any[]>([]);
    const [eventoSeleccionado, setEventoSeleccionado] = useState<string>('');
    const [historial, setHistorial] = useState<any[]>([]);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const resEventos = await api.get('/evento');
                const recitales = resEventos.data.filter((e: any) => e.tipo_evento === 'Recital');
                setEventos(recitales); 

                const resHistorial = await api.get('/uso-beneficio/mis-usos');
                const misRecitales = resHistorial.data.filter((u: any) => u.tipo_beneficio === 'DESC_RECITALES');
                setHistorial(misRecitales);
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };
        cargarDatos();
    }, []);

    useEffect(() => {
        if (eventoSeleccionado) {
            const qrExistente = historial.find(uso => uso.evento?.id === Number(eventoSeleccionado));
            if (qrExistente) {
                setQrData(qrExistente.codigo_qr || `DESC-RECITAL-${qrExistente.id}-${userProfile?.id}`);
                setPaso(2);
                setErrorBackend(null);
            } else {
                setPaso(1);
                setQrData('');
            }
        }
    }, [eventoSeleccionado, historial]);

    const generarVoucher = async () => {
        if (!eventoSeleccionado) {
            setErrorBackend('Seleccioná un recital primero.');
            return;
        }

        setGenerando(true);
        setErrorBackend(null);
        try {
            const res = await api.post('/uso-beneficio', {
                tipo_beneficio: 'DESC_RECITALES', 
                evento_id: Number(eventoSeleccionado)
            });

            const codigoUnico = res.data.codigo_qr || `DESC-RECITAL-${userProfile?.id}-${Date.now()}`;
            setQrData(codigoUnico);
            setHistorial(prev => [...prev, { ...res.data, evento: { id: Number(eventoSeleccionado) }, codigo_qr: codigoUnico }]);
            setPaso(2);
        } catch (error: any) {
            setErrorBackend(error.response?.data?.message || 'Error al generar el descuento');
        } finally {
            setGenerando(false);
        }
    };

    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}&margin=10`;

    const descargarQR = async () => {
        try {
            const response = await fetch(qrImageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `VoucherRecital-OvaloFans-${userProfile?.alias || 'Socio'}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al descargar el QR', error);
        }
    };

    const compartirQR = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Mi Voucher de Descuento - Óvalo Fans',
                    text: 'Acá está mi código QR de descuento para el recital en el Autódromo.',
                    url: qrImageUrl,
                });
            } catch (error) {
                console.error('Error compartiendo', error);
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
            <Link to="/dashboard/beneficios" className="inline-flex items-center gap-2 text-slate-500 hover:text-institucional-celeste transition-colors font-bold uppercase text-xs tracking-widest">
              <ChevronLeft size={16} /> Volver a Beneficios
            </Link>

            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                <AudioLines className="text-purple-500" size={32} />
                Descuento Recitales
            </h1>

            <div className="bg-white dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-xl text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-5 pointer-events-none">
                    <AudioLines size={250} />
                </div>

                {paso === 1 ? (
                    <div className="relative z-10 flex flex-col items-center py-8">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                            Tu Voucher de Descuento
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm">
                            Generá tu código QR y presentalo en la boletería del predio junto con tu DNI para aplicar el descuento en tu entrada.
                        </p>

                        <div className="w-full max-w-md mb-8">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 text-left">
                                Seleccioná el Recital
                            </label>
                            <select 
                                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:border-purple-500 focus:ring-2 outline-none"
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
                            className="bg-purple-500 hover:bg-purple-600 text-white font-extrabold text-xl py-4 px-8 rounded-2xl transition-all flex items-center justify-center gap-3 w-full sm:w-auto disabled:opacity-50 shadow-[0_0_30px_-5px] shadow-purple-500/50"
                        >
                            <QrCode size={28} />
                            {generando ? 'Procesando...' : 'Generar Voucher QR'}
                        </button>
                    </div>
                ) : (
                    <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-500">
                        <h2 className="text-xl font-black text-slate-800 dark:text-white mb-6 uppercase tracking-widest text-purple-500">
                            ¡Voucher Recuperado!
                        </h2>
                        
                        <div className="bg-white p-4 rounded-3xl border-4 border-slate-900 shadow-2xl mb-8 relative max-w-[280px] w-full">
                            <div className="absolute top-1/2 -left-5 w-8 h-8 bg-slate-100 dark:bg-[#110c1b] rounded-full transform -translate-y-1/2"></div>
                            <div className="absolute top-1/2 -right-5 w-8 h-8 bg-slate-100 dark:bg-[#110c1b] rounded-full transform -translate-y-1/2"></div>
                            <img src={qrImageUrl} alt="QR Descuento" className="w-full h-auto rounded-xl" />
                            <p className="text-slate-500 text-xs font-mono font-bold mt-4 tracking-widest text-center uppercase">
                                ID: {qrData.substring(0, 12)}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full justify-center">
                            <button 
                                onClick={descargarQR}
                                className="flex items-center justify-center gap-2 bg-slate-800 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors shadow-lg flex-1 sm:flex-none"
                            >
                                <Download size={20} /> Guardar Imagen
                            </button>
                            <button 
                                onClick={compartirQR}
                                className="flex items-center justify-center gap-2 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex-1 sm:flex-none"
                            >
                                <Share2 size={20} /> Compartir
                            </button>
                        </div>

                        <div className="bg-purple-500/10 border-l-4 border-purple-500 p-4 rounded-r-xl text-left flex gap-4 max-w-lg w-full">
                            <AlertTriangle className="text-purple-500 flex-shrink-0 mt-1" size={24} />
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                <strong className="text-purple-500 block mb-1 tracking-wider uppercase text-xs">Instrucciones:</strong>
                                Presentá este código QR en la boletería del evento. El staff lo validará junto con tu DNI para aplicar el descuento especial para socios.
                            </p>
                        </div>

                        <button 
                            onClick={() => setPaso(1)}
                            className="mt-6 text-sm font-bold text-slate-500 hover:text-purple-500 transition-colors underline"
                        >
                            Ver otro recital
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecitalesPage;