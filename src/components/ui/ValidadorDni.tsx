import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, User, CreditCard, ShieldAlert, QrCode, Ticket, Calendar } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import api from '@/api/axios';

interface ValidadorProps {
  tituloContexto: string;
}

const ValidadorDni = ({ tituloContexto }: ValidadorProps) => {
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [modoScanner, setModoScanner] = useState(false);
  const [datosQr, setDatosQr] = useState<any>(null); // Guardamos la info extra del QR acá

  // Manejador del form manual (cuando tipean el DNI)
  const handleValidarForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni.trim()) return;
    verificarSocio('dni', dni);
  };

  // Manejador del escáner
  const handleEscanearQR = (textoQR: string) => {
    setModoScanner(false);
    
    if (!isNaN(Number(textoQR))) {
      setDni(textoQR);
      verificarSocio('dni', textoQR);
    } else {
      verificarSocio('qr', textoQR);
    }
  };

  // Lógica centralizada para buscar en el backend
  const verificarSocio = async (tipoBusqueda: 'dni' | 'qr', valor: string) => {
    setLoading(true);
    setError(null);
    setResultado(null);
    setDatosQr(null); // Reseteamos la info extra por cada búsqueda

    try {
      const token = localStorage.getItem('token');
      
      const endpoint = tipoBusqueda === 'dni' 
        ? `/suscripcion/admin/dni?dni=${valor}`
        : `/uso-beneficio/validar-qr?codigo=${valor}`;

      const res = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      let subActiva = null;

      if (tipoBusqueda === 'dni') {
        const suscripciones = res.data;
        if (suscripciones && suscripciones.length > 0) {
          subActiva = suscripciones.find((s: any) => s.estado === 'Activo') || suscripciones[0];
        }
      } else {
        // SI ES QR: Guardamos la suscripción para la UI verde/roja
        subActiva = res.data?.suscripcion || res.data; 
        
        // Y guardamos la data completa del voucher (tipo de beneficio, evento, fecha, etc.)
        setDatosQr(res.data);
      }

      if (subActiva) {
        setResultado(subActiva);
      } else {
        setError(tipoBusqueda === 'dni' 
          ? "El DNI ingresado no posee ninguna suscripción registrada." 
          : "El Voucher QR es inválido o no fue encontrado.");
      }

    } catch (err: any) {
      if (err.response?.status === 404) {
        setError(`No se encontraron registros para: ${valor}.`);
      } else {
        setError(err.response?.data?.message || "Ocurrió un error al consultar la base de datos.");
      }
    } finally {
      setLoading(false);
    }
  };

  const esActivo = resultado?.estado === 'Activo'; 

  // Función helper para ponerle un nombre lindo al tipo de beneficio
  const formatearBeneficio = (tipo: string) => {
    switch(tipo) {
      case 'FAST_ACCESS': return 'Fast Access (VIP Pista)';
      case 'DESC_CARRERAS': return 'Descuento en Carrera';
      case 'DESC_RECITALES': return 'Descuento en Recital';
      default: return tipo.replace('_', ' ');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* TARJETA DE BÚSQUEDA */}
      <div className="bg-white dark:bg-[#110c1b] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="p-2 bg-institucional-celeste/10 rounded-lg text-institucional-celeste">
            <Search size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
              Verificador de DNI o QR
            </h2>
            <p className="text-sm text-slate-500 font-medium">
                <span className="text-institucional-celeste font-bold">{tituloContexto}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleValidarForm} className="flex gap-3">
          <input
            type="number"
            placeholder="Ingresar DNI"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="flex-1 bg-slate-50 dark:bg-[#08060d] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-institucional-celeste transition-colors font-medium"
            required={!modoScanner}
          />
          <button
            type="submit"
            disabled={loading || !dni}
            className="bg-institucional-celeste hover:bg-sky-500 text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-sky-500/20"
          >
            {loading ? 'Buscando...' : 'Verificar'}
          </button>
        </form>

        {/* DIVISOR */}
        <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10"></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">O TAMBIÉN</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10"></div>
        </div>

        {/* BOTÓN CÁMARA */}
        <button
            type="button"
            onClick={() => setModoScanner(!modoScanner)}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors shadow-lg ${
                modoScanner 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' 
                : 'bg-slate-800 dark:bg-white/5 text-white hover:bg-slate-700 dark:hover:bg-white/10 border border-slate-300 dark:border-transparent'
            }`}
        >
            {modoScanner ? <XCircle size={24} /> : <QrCode size={24} />}
            {modoScanner ? 'Cancelar Escáner' : 'Escanear QR'}
        </button>

        {/* LECTOR DE CÁMARA */}
        {modoScanner && (
            <div className="mt-6 rounded-3xl overflow-hidden border-4 border-institucional-celeste shadow-[0_0_30px_rgba(14,165,233,0.3)] relative aspect-square max-w-sm mx-auto bg-black animate-in zoom-in duration-300">
                <Scanner
                    onScan={(detectedCodes) => {
                        if (detectedCodes && detectedCodes.length > 0) {
                            handleEscanearQR(detectedCodes[0].rawValue);
                        }
                    }}
                    onError={(error) => console.log(error)}
                />
                <div className="absolute inset-0 pointer-events-none border-[50px] border-black/60 flex items-center justify-center">
                    <div className="w-full h-full border-2 border-dashed border-institucional-celeste/70 shadow-[0_0_15px_rgba(14,165,233,0.5)]"></div>
                </div>
            </div>
        )}

        {/* MENSAJE DE ERROR */}
        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3">
            <ShieldAlert size={24} />
            <span className="font-medium">{error}</span>
          </div>
        )}
      </div>

      {/* RESULTADO DE LA BÚSQUEDA */}
      {resultado && (
        <div className={`border rounded-2xl p-6 shadow-xl transition-all duration-500 animate-in slide-in-from-bottom-4 ${
          esActivo 
            ? 'bg-emerald-500/5 border-emerald-500/30' 
            : 'bg-red-500/5 border-red-500/30'
        }`}>
          
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              {esActivo ? (
                <CheckCircle className="text-emerald-500" size={32} />
              ) : (
                <XCircle className="text-red-500" size={32} />
              )}
              <div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase">
                  {esActivo ? 'Beneficio Aprobado' : 'Beneficio Denegado'}
                </h3>
                <p className={`font-bold ${esActivo ? 'text-emerald-500' : 'text-red-500'}`}>
                  Suscripción: {resultado.estado}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-[#08060d] p-5 rounded-xl border border-slate-200 dark:border-white/5 mb-6">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <User size={20} className="text-institucional-celeste" />
              <div>
                <p className="text-xs uppercase font-bold text-slate-400">Titular</p>
                <p className="font-semibold">
                  {resultado.perfilFan?.usuario?.nombre} {resultado.perfilFan?.usuario?.apellido}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <CreditCard size={20} className="text-institucional-celeste" />
              <div>
                <p className="text-xs uppercase font-bold text-slate-400">Documento</p>
                <p className="font-semibold">{resultado.perfilFan?.usuario?.dni}</p>
              </div>
            </div>
          </div>

          {/* 🎟️ SECCIÓN EXCLUSIVA PARA ESCANEO DE QR 🎟️ */}
          {datosQr && esActivo && (
             <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-xl p-5 mt-4">
                 <h4 className="text-orange-500 font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                     <Ticket size={18} /> Detalle del Voucher QR
                 </h4>
                 
                 <div className="space-y-3">
                     <div className="flex justify-between border-b border-orange-500/20 pb-2">
                         <span className="text-slate-500 text-sm font-bold uppercase">Tipo de Pase:</span>
                         <span className="text-slate-800 dark:text-white font-black">{formatearBeneficio(datosQr.tipo_beneficio)}</span>
                     </div>
                     
                     {datosQr.evento && (
                         <div className="flex justify-between border-b border-orange-500/20 pb-2">
                             <span className="text-slate-500 text-sm font-bold uppercase flex items-center gap-1">
                                 <Calendar size={14}/> Evento:
                             </span>
                             <span className="text-slate-800 dark:text-white font-bold text-right">
                                 {datosQr.evento.titulo}
                             </span>
                         </div>
                     )}

                     <div className="flex justify-between pt-1">
                         <span className="text-slate-500 text-sm font-bold uppercase">Generado el:</span>
                         <span className="text-slate-800 dark:text-white font-mono text-sm">
                             {new Date(datosQr.fecha_solicitud).toLocaleDateString('es-AR')}
                         </span>
                     </div>
                 </div>
             </div>
          )}
          
        </div>
      )}
    </div>
  );
};

export default ValidadorDni;