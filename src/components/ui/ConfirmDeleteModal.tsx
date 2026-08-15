import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  warningText?: string; // Es opcional, le ponemos un texto por defecto
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  warningText = "Esta acción no se puede deshacer."
}) => {
  // Si no está abierto, no renderiza nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm md:pl-64 transition-all duration-300">
      <div className="w-full max-w-md bg-white dark:bg-[#08060d] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500">
          <AlertTriangle size={32} />
        </div>
        <h3 className="title-fan text-2xl mb-2 text-slate-800 dark:text-white uppercase tracking-tight">
          {title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          Estás a punto de eliminar <strong>"{itemName}"</strong>. {warningText}
        </p>
        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white rounded-xl transition-colors font-bold"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-black uppercase tracking-wide shadow-lg shadow-red-500/30"
          >
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;