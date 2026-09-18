import { useEffect, useState } from 'react';
import { QrCode, Download, Share2, Ticket, AlertTriangle, ChevronLeft, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import api from '@/api/axios';

const FastPassPage = () => {
    const { userProfile } = useAuth();
    const [paso, setPaso] = useState(1);
    const [generando, setGenerando] = useState(false);
    const [qrData, setQrData] = useState('');
    const [errorBackend, setErrorBackend] = useState<string | null>(null);
    const [eventosTC, setEventosTC] = useState<any[]>([]);
    const [eventoSeleccionado, setEventoSeleccionado] = useState<string>('');
    const [historial, setHistorial] = useState<any[]>([]);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // 1. Cargamos los eventos de TC disponibles
                const resEventos = await api.get('/evento/tc-disponibles');
                setEventosTC(resEventos.data);

                // 2. Cargamos el historial de beneficios del usuario
                const resHistorial = await api.get('/uso-beneficio/mis-usos');
                const misFastPasses = resHistorial.data.filter((u: any) => u.tipo_beneficio === 'FAST_ACCESS');
                setHistorial(misFastPasses);
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };
        cargarDatos();
    }, []);

    // Si cambia el evento seleccionado, revisamos si ya tiene un QR
    useEffect(() => {
        if (eventoSeleccionado) {
            const qrExistente = historial.find(uso => uso.evento?.id === Number(eventoSeleccionado));
            if (qrExistente) {
                // Si ya lo tiene, saltamos al paso 2 y mostramos su código
                setQrData(qrExistente.codigo_qr || `FASTPASS-${qrExistente.id}-${userProfile?.id}`);
                setPaso(2);
                setErrorBackend(null);
            } else {
                setPaso(1);
                setQrData('');
            }
        }
    }, [eventoSeleccionado, historial]);

    const generarFastPass = async () => {
        if (!eventoSeleccionado) {
            setErrorBackend('Por favor, seleccioná una fecha de carrera primero.');
            return;
        }

        setGenerando(true);
        setErrorBackend(null);
        try {
            const res = await api.post('/uso-beneficio', {
                tipo_beneficio: 'FAST_ACCESS', 
                evento_id: Number(eventoSeleccionado)
            });

            const codigoUnico = res.data.codigo_qr || `OVALO-FASTPASS-${userProfile?.id}-${Date.now()}`;
            setQrData(codigoUnico);
            
            // Actualizamos el historial localmente para que ya quede registrado en la vista
            setHistorial(prev => [...prev, { ...res.data, evento: { id: Number(eventoSeleccionado) }, codigo_qr: codigoUnico }]);
            setPaso(2);
        } catch (error: any) {
            setErrorBackend(error.response?.data?.message || 'Error al registrar el beneficio.');
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
            link.download = `FastAccess-OvaloFans-${userProfile?.alias || 'VIP'}.png`;
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
                    title: 'Mi Fast Access - Óvalo Fans',
                    text: '¡Tengo mi Fast Access P1/P2 para el Autódromo Ciudad de Rafaela!',
                    url: qrImageUrl,
                });
            } catch (error) {
                console.error('Error compartiendo', error);
            }
        } else {
            alert('Tu dispositivo no soporta la función de compartir directa. Usá el botón de descargar.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
            <Link to="/dashboard/beneficios" className="inline-flex items-center gap-2 text-slate-500 hover:text-institucional-celeste transition-colors font-bold uppercase text-xs tracking-widest">
              <ChevronLeft size={16} /> Volver a Beneficios
            </Link>

            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                <Zap className="text-institucional-celeste" size={32} />
                Fast Access
            </h1>

            <div className="bg-white dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-xl text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-5 pointer-events-none">
                    <QrCode size={250} />
                </div>

                {paso === 1 ? (
                    <div className="relative z-10 flex flex-col items-center py-8">
                        <div className="bg-institucional-celeste/10 p-6 rounded-full mb-6 border-2 border-institucional-celeste/20">
                            <Ticket className="text-institucional-celeste" size={64} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                            Tu PASE rápido Directo a Pista
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm">
                            Generá tu código QR único para saltarte las filas e ingresar al Autódromo de forma rápida y exclusiva.
                        </p>

                        <div className="w-full max-w-md mb-8">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 text-left">
                                Seleccioná la Fecha de la Carrera
                            </label>
                            {eventosTC.length > 0 ? (
                                <select 
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:border-institucional-celeste focus:ring-2 outline-none transition-colors"
                                    value={eventoSeleccionado}
                                    onChange={(e) => setEventoSeleccionado(e.target.value)}
                                >
                                    <option value="" disabled>Elegí una fecha de TC...</option>
                                    {eventosTC.map(evento => {
                                        const fechaFormateada = new Date(evento.fecha_evento).toLocaleDateString('es-AR');
                                        return (
                                            <option key={evento.id} value={evento.id}>
                                                {evento.titulo} ({fechaFormateada})
                                            </option>
                                        )
                                    })}
                                </select>
                            ) : (
                                <div className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 p-3 rounded-xl">
                                    Cargando carreras disponibles... (O no hay fechas próximas)
                                </div>
                            )}
                        </div>

                        {errorBackend && (
                            <div className="bg-red-500/10 border-l-4 border-red-500 text-red-600 dark:text-red-400 p-4 rounded-r-xl mb-8 max-w-md w-full text-left flex items-start gap-3">
                                <AlertTriangle className="flex-shrink-0 mt-0.5" size={20} />
                                <span className="text-sm font-medium leading-tight">{errorBackend}</span>
                            </div>
                        )}
                        
                        <button 
                            onClick={generarFastPass}
                            disabled={generando || eventosTC.length === 0}
                            className="group bg-institucional-celeste hover:bg-blue-600 text-white font-extrabold text-xl py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_30px_-5px] shadow-institucional-celeste/50 hover:shadow-institucional-celeste disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                            <QrCode size={28} className={generando ? "animate-pulse" : "group-hover:scale-110 transition-transform"} />
                            {generando ? 'Iniciando telemetría...' : 'Generar Fast Access QR'}
                        </button>
                    </div>
                ) : (
                    <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-500">
                        <h2 className="text-xl font-black text-slate-800 dark:text-white mb-6 uppercase tracking-widest text-institucional-celeste">
                            QR generado con éxito!
                        </h2>
                        
                        <div className="bg-white p-4 rounded-3xl border-4 border-slate-900 shadow-2xl mb-8 relative max-w-[280px] w-full">
                            <div className="absolute top-1/2 -left-5 w-8 h-8 bg-slate-100 dark:bg-[#110c1b] rounded-full transform -translate-y-1/2"></div>
                            <div className="absolute top-1/2 -right-5 w-8 h-8 bg-slate-100 dark:bg-[#110c1b] rounded-full transform -translate-y-1/2"></div>
                            
                            <img 
                                src={qrImageUrl} 
                                alt="Fast Access QR" 
                                className="w-full h-auto rounded-xl"
                            />
                            <p className="text-slate-500 text-xs font-mono font-bold mt-4 tracking-widest text-center uppercase">
                                ID: {qrData.substring(0, 12)}...
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

                        <div className="bg-institucional-celeste/10 border-l-4 border-institucional-celeste p-4 rounded-r-xl text-left flex gap-4 max-w-lg w-full">
                            <AlertTriangle className="text-institucional-celeste flex-shrink-0 mt-1" size={24} />
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                <strong className="text-institucional-celeste block mb-1 tracking-wider uppercase text-xs">Atención Fan:</strong>
                                Este QR solo será válido para fecha de Turismo Carretera con su entrada física correspondiente (ingresas 1 hora antes del ingreso general). <br/>
                                <span className="font-bold mt-2 block text-slate-800 dark:text-white">¡Disfruta de tu ingreso VIP para encontrar tu mejor lugar!</span>
                            </p>
                        </div>

                        <button 
                            onClick={() => setPaso(1)}
                            className="mt-6 text-sm font-bold text-slate-500 hover:text-institucional-celeste transition-colors underline"
                        >
                            Ver otra fecha de carrera
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FastPassPage;