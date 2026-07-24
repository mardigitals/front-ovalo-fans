import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, User, CreditCard, ShieldAlert } from 'lucide-react';
import api from '@/api/axios';

interface VerificadorProps {
  tituloContexto: string;
}

const VerificadorSuscripcion = ({ tituloContexto }: VerificadorProps) => {
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerificar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni.trim()) return;

    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/suscripcion/admin/dni?dni=${dni}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const suscripciones = res.data;
      if (suscripciones && suscripciones.length > 0) {
        const subActiva = suscripciones.find((s: any) => s.estado === 'Activo') || suscripciones[0];
        setResultado(subActiva);
      } else {
        setError("El DNI ingresado no posee ninguna suscripción registrada.");
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError(`Este DNI no posee una suscripción: ${dni}.`);
      } else {
        setError("Ocurrió un error al consultar la base de datos.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Variable helper para que el HTML quede más limpio
  const esActivo = resultado?.estado === 'Activo'; 

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
              Verificador de DNI
            </h2>
            <p className="text-sm text-slate-500 font-medium">
                <span className="text-institucional-celeste font-bold">{tituloContexto}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleVerificar} className="flex gap-3">
          <input
            type="number"
            placeholder="Ingresar DNI"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="flex-1 bg-slate-50 dark:bg-[#08060d] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-institucional-celeste transition-colors font-medium"
            required
          />
          <button
            type="submit"
            disabled={loading || !dni}
            className="bg-institucional-celeste hover:bg-sky-500 text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-sky-500/20"
          >
            {loading ? 'Buscando...' : 'Verificar'}
          </button>
        </form>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-[#08060d] p-5 rounded-xl border border-slate-200 dark:border-white/5">
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
          
        </div>
      )}
    </div>
  );
};

export default VerificadorSuscripcion;