const FullScreenLoader = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#08060d]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner animado */}
        <div className="w-12 h-12 border-4 border-institucional-celeste/20 border-t-institucional-celeste rounded-full animate-spin"></div>
        {/* Texto de carga */}
        <p className="text-sky-500 animate-pulse font-black tracking-widest uppercase text-sm">
          Verificando credenciales...
        </p>
      </div>
    </div>
  );
};

export default FullScreenLoader;