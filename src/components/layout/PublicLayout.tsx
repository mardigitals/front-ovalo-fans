// import { Outlet, Link } from 'react-router-dom';

// const PublicLayout = () => (
//   <div className="min-h-screen bg-[#08060d] text-white flex flex-col font-sans">
//     <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 p-4 flex justify-between items-center sticky top-0 z-50">
//       <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-200 tracking-tighter uppercase">
//         AUTÓDROMO RAFAELA
//       </h1>
//       <nav className="hidden md:flex space-x-6 text-sm font-medium">
//         <Link to="/" className="hover:text-cyan-400 transition-colors">Inicio</Link>
//         <Link to="/historia" className="hover:text-cyan-400 transition-colors">Historia</Link>
//         <Link to="/calendario" className="hover:text-cyan-400 transition-colors">Calendario</Link>
//         <Link to="/noticias" className="hover:text-cyan-400 transition-colors">Noticias</Link>
//         <Link to="/contacto" className="hover:text-cyan-400 transition-colors">Contacto</Link>
//         <Link to="/login" className="bg-cyan-500 px-4 py-2 rounded-md hover:bg-cyan-600 transition-all text-white font-bold">Login</Link>
//       </nav>
//     </header>
//     <main className="flex-1">
//       <Outlet />
//     </main>
//     <footer className="p-8 text-center text-stone-500 border-t border-white/5 bg-black/20">
//       &copy; {new Date().getFullYear()} Autódromo Rafaela. Desarrollo por Mar Digitals.
//     </footer>
//   </div>
// );

// export default PublicLayout;
// import { Outlet, Link } from 'react-router-dom';

// const PublicLayout = () => (
//   // 1. Quitamos el bg fijo y text-white. El index.css se encarga del fondo base.
//   <div className="min-h-screen flex flex-col font-sans">
    
//     {/* 2. Header con efecto Glass preparado para Modo Claro y Oscuro */}
//     <header className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 p-4 flex justify-between items-center sticky top-0 z-50 transition-colors duration-300">
      
//       {/* 3. ¡Usamos title-fan! Le agregamos un text-2xl/4xl extra para pisar el tamaño y que no quede TAN gigante en el header */}
//       <h1 className="title-fan text-2xl md:text-4xl">
//         AUTÓDROMO RAFAELA
//       </h1>
      
//       {/* 4. Menú de navegación. Color base gris, hover en celeste */}
//       <nav className="hidden md:flex space-x-6 text-sm font-bold items-center text-slate-600 dark:text-slate-300 uppercase tracking-wider">
//         <Link to="/" className="hover:text-sky-500 transition-colors">Inicio</Link>
//         <Link to="/historia" className="hover:text-sky-500 transition-colors">Historia</Link>
//         <Link to="/calendario" className="hover:text-sky-500 transition-colors">Calendario</Link>
//         <Link to="/noticias" className="hover:text-sky-500 transition-colors">Noticias</Link>
//         <Link to="/contacto" className="hover:text-sky-500 transition-colors">Contacto</Link>
        
//         {/* 5. Botón de Login con el efecto Neón premium en chiquito */}
//         <Link 
//           to="/login" 
//           className="bg-sky-500 text-black px-5 py-2 rounded-md hover:bg-sky-400 transition-all font-black shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)]"
//         >
//           LOGIN
//         </Link>
//       </nav>
//     </header>
    
//     <main className="flex-1">
//       <Outlet />
//     </main>
    
//     {/* 6. Footer adaptado a Light/Dark Mode */}
//     <footer className="p-8 text-center text-slate-500 text-sm border-t border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-black/20 transition-colors duration-300">
//       &copy; {new Date().getFullYear()} Autódromo Rafaela. Desarrollo por MAR digitals.
//     </footer>
//   </div>
// );

// export default PublicLayout;
import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

const PublicLayout = () => {
  // Estado para saber en qué modo estamos
  const [isDark, setIsDark] = useState(true);

  // Al cargar la página, revisamos si el HTML tiene la clase 'dark'
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  // Función que se ejecuta al apretar el botón
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 p-4 flex justify-between items-center sticky top-0 z-50 transition-colors duration-300">
        
        <h1 className="title-fan text-2xl md:text-4xl">
          AUTÓDROMO RAFAELA
        </h1>
        
        <nav className="hidden md:flex space-x-6 text-sm font-bold items-center text-slate-600 dark:text-slate-300 uppercase tracking-wider">
          <Link to="/" className="hover:text-sky-500 transition-colors">Inicio</Link>
          <Link to="/historia" className="hover:text-sky-500 transition-colors">Historia</Link>
          <Link to="/calendario" className="hover:text-sky-500 transition-colors">Calendario</Link>
          <Link to="/noticias" className="hover:text-sky-500 transition-colors">Noticias</Link>
          <Link to="/contacto" className="hover:text-sky-500 transition-colors">Contacto</Link>
          
          {/* --- BOTÓN SOL / LUNA --- */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-xl"
            title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          
          <Link 
            to="/login" 
            className="bg-sky-500 text-black px-5 py-2 rounded-md hover:bg-sky-400 transition-all font-black shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] ml-2"
          >
            LOGIN
          </Link>
        </nav>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="p-8 text-center text-slate-500 text-sm border-t border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-black/20 transition-colors duration-300">
        &copy; {new Date().getFullYear()} Autódromo Rafaela. Desarrollo por MAR digitals.
      </footer>
    </div>
  );
};

export default PublicLayout;