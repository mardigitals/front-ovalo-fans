import React from 'react';

// Le decimos a TypeScript qué datos va a recibir este componente
interface Option {
  value: string | number;
  label: string;
}

interface FormFieldProps {
  label: string;
  name?: string;
  type?: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  disabled?: boolean;
  options?: Option[];
  isTextarea?: boolean;
  placeholder?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled = false,
  options,
  isTextarea = false,
  placeholder = ""
}) => {
  // Unificamos tu lógica de Tailwind: si está bloqueado, se pone gris; si no, brilla celeste
  const baseClasses = `w-full border rounded-xl px-4 py-2 transition-colors ${
    !disabled 
      ? 'bg-slate-50 dark:bg-black/20 text-slate-800 dark:text-white border-institucional-celeste focus:ring-2' 
      : 'bg-slate-100 dark:bg-black/20 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 opacity-70 cursor-not-allowed'
  }`;

  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </label>
      
      {isTextarea ? (
        <textarea 
          name={name} 
          disabled={disabled} 
          value={value} 
          onChange={onChange} 
          rows={3} 
          placeholder={placeholder}
          className={baseClasses} 
        />
      ) : options ? (
        <select 
          name={name} 
          disabled={disabled} 
          value={value} 
          onChange={onChange} 
          className={baseClasses}
        >
          <option value="">Seleccionar...</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input 
          type={type} 
          name={name} 
          disabled={disabled} 
          value={value} 
          onChange={onChange} 
          placeholder={placeholder}
          className={baseClasses} 
        />
      )}
    </div>
  );
};

export default FormField;