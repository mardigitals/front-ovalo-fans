import React from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

// Definimos la estructura exacta que el CRUD va a recibir
interface Column {
  key: string;
  label: string;
  render?: (item: any) => React.ReactNode; // Permite formatear celdas (ej: fechas, estados, imágenes)
}

interface GenericCrudProps {
  title: string;
  subtitle: string;
  columns: Column[];
  data: any[];
  onAdd?: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  searchTerm?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  canEdit?: boolean; // Controla permisos según el rol del usuario
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const GenericCrud = ({
  title,
  subtitle,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  searchTerm,
  onSearchChange,
  canEdit = true, // Por defecto se puede editar, a menos que el rol diga lo contrario
  currentPage,
  totalPages,
  onPageChange
}: GenericCrudProps) => {
  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* Cabecera del CRUD */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="title-fan text-3xl">{title}</h2>
          <p className="subtitle-fan text-slate-500 dark:text-institucional-gris mt-1">{subtitle}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Buscador */}
          {onSearchChange && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={onSearchChange}
                className="pl-10 pr-4 py-2 rounded-lg bg-white/50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white focus:outline-none focus:border-institucional-celeste/50 transition-colors w-full sm:w-64 input-fan"
              />
            </div>
          )}

          {/* Botón de Agregar (Solo si tiene permisos y se pasa la función) */}
          {canEdit && onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg glass-neon-btn group transition-all"
            >
              <Plus size={18} className="group-hover:text-institucional-celeste" />
              <span className="font-bold">Nuevo</span>
            </button>
          )}
        </div>
      </div>

      {/* Contenedor de la Tabla con efecto Glass */}
      <div className="bg-white/60 dark:bg-[#08060d]/60 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                {columns.map((col) => (
                  <th key={col.key} className="p-4 text-fan text-xs font-bold text-slate-500 dark:text-institucional-gris uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
                {/* Columna de Acciones dinámica */}
                {canEdit && (onEdit || onDelete) && (
                  <th className="p-4 text-fan text-xs font-bold text-slate-500 dark:text-institucional-gris uppercase tracking-wider text-right">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className="p-4 text-sm text-slate-700 dark:text-slate-300">
                        {/* Si la columna tiene un renderizado especial (ej: un badge de estado), lo usa, sino muestra el texto crudo */}
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    ))}
                    
                    {/* Botones de Acción */}
                    {canEdit && (onEdit || onDelete) && (
                      <td className="p-4 text-right flex justify-end gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2 text-slate-400 hover:text-institucional-celeste bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-md transition-all"
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="p-2 text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-md transition-all"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + (canEdit ? 1 : 0)} className="p-8 text-center text-slate-500 text-fan italic">
                    No se encontraron registros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      {/* --- CONTROLES DE PAGINACIÓN --- */}
        {totalPages && totalPages > 1 && onPageChange && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 dark:bg-black/20 border-t border-slate-200 dark:border-white/10 mt-2">
            <span className="text-sm font-medium text-slate-500 dark:text-institucional-gris">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(currentPage! - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-bold rounded-md bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Anterior
              </button>
              <button
                onClick={() => onPageChange(currentPage! + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-bold rounded-md bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Siguiente
              </button>
              <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="hidden sm:block px-3 py-1.5 text-sm font-bold rounded-md bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Última
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericCrud;