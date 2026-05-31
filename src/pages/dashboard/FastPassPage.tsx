import { useEffect, useState } from 'react';
import { QrCode, Download, Share2, Ticket, AlertTriangle, FastForward } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const FastPassPage = () => {
    const { userProfile } = useAuth();
    const [paso, setPaso] = useState(1);
    const [generando, setGenerando] = useState(false);
    const [qrData, setQrData] = useState('');
    const [errorBackend, setErrorBackend] = useState<string | null>(null);
    const [eventosTC, setEventosTC] = useState<any[]>([]);
    const [eventoSeleccionado, setEventoSeleccionado] = useState<string>('');

    const fetchEventos = async () => {
        try {
            const token = localStorage.getItem('token');
            // Asegurate de mandar el token si tu ruta en NestJS tiene @UseGuards(JwtAuthGuard)
            const res = await fetch('http://localhost:3000/evento/tc-disponibles', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Error al obtener eventos disponibles');
            
            const data = await res.json();
            setEventosTC(data); 
        } catch (error) {
            console.error("Error cargando eventos TC disponibles:", error);
        }
    };

    useEffect (() => {
        fetchEventos();
    }, []);

    const generarFastPass = async () => {
        if (!eventoSeleccionado) {
            setErrorBackend('Por favor, seleccioná una fecha de carrera primero.');
            return;
        }

        setGenerando(true);
        setErrorBackend(null);
        try {
            const token = localStorage.getItem('token');
      
            const res = await fetch('http://localhost:3000/uso-beneficio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    tipo_beneficio: 'FAST_ACCESS', 
                    evento_id: Number(eventoSeleccionado)
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Error al registrar el beneficio en el backend');
            }
      
            const codigoUnico = data.codigo_qr || `OVALO-FASTPASS-${userProfile?.id || 'VIP'}-${Date.now()}`;
            setQrData(codigoUnico);
            setPaso(2);
        } catch (error: any) {
            console.error("Falla de telemetría:", error);
            setErrorBackend(error.message);
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
        <div className="max-w-2xl mx-auto space-y-6 pb-12">
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                <FastForward className="text-institucional-celeste" size={32} />
                Fast Access
            </h1>

            <div className="bg-white dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-xl text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-5 pointer-events-none">
                    <QrCode size={250} />
                </div>

                {paso === 1 ? (
                    <div className="relative z-10 flex flex-col items-center py-8 animate-in fade-in zoom-in duration-500">
                        <div className="bg-institucional-celeste/10 p-6 rounded-full mb-6 border-2 border-institucional-celeste/20">
                            <Ticket className="text-institucional-celeste" size={64} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                            Tu Pase VIP Directo a Pista
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm">
                            Generá tu código QR único para saltarte las filas e ingresar al Autódromo de forma rápida y exclusiva.
                        </p>

                        {/* SELECTOR DE EVENTOS */}
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
                                        // Formateamos la fecha para que se vea linda (ej: 15/08/2026)
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
                            <div className="bg-red-500/10 border-l-4 border-red-500 text-red-600 dark:text-red-400 p-4 rounded-r-xl mb-8 max-w-md w-full text-left flex items-start gap-3 animate-in fade-in">
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
                    <div className="relative z-10 flex flex-col items-center animate-in slide-in-from-bottom-8 fade-in duration-500">
                        <h2 className="text-xl font-black text-slate-800 dark:text-white mb-6 uppercase tracking-widest text-institucional-celeste">
                            ¡Ticket Generado con Éxito!
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
                                <strong className="text-institucional-celeste block mb-1 tracking-wider uppercase text-xs">Atención Piloto:</strong>
                                Este QR solo será válido para fecha de Turismo Carretera con su entrada física correspondiente (ingresas 1 hora antes del ingreso general). <br/>
                                <span className="font-bold mt-2 block text-slate-800 dark:text-white">¡Disfruta de tu ingreso VIP para encontrar tu mejor lugar!</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FastPassPage;