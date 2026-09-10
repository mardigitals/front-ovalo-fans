interface NotificationBadgeProps {
  count: number;
  className?: string; // Para permitir ajustes extra de posicionamiento (ej: absolute right-4)
}

const NotificationBadge = ({ count, className = '' }: NotificationBadgeProps) => {
  if (count <= 0) return null; // Si no hay pendientes, ni se renderiza

  return (
    <span className={`bg-red-500 text-white text-[14px] font-black px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-in zoom-in ${className}`}>
      {count}
    </span>
  );
};

export default NotificationBadge;