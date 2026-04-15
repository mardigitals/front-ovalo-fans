import { Outlet, Link } from 'react-router-dom';

const PublicLayout = () => (
  <div className="min-h-screen bg-[#08060d] text-white flex flex-col font-sans">
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 p-4 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-2xl font-bold tracking-tighter text-cyan-400">
        AUTÓDROMO RAFAELA
      </h1>
      <nav className="hidden md:flex space-x-6 text-sm font-medium">
        <Link to="/" className="hover:text-cyan-400 transition-colors">Inicio</Link>
        <Link to="/historia" className="hover:text-cyan-400 transition-colors">Historia</Link>
        <Link to="/calendario" className="hover:text-cyan-400 transition-colors">Calendario</Link>
        <Link to="/noticias" className="hover:text-cyan-400 transition-colors">Noticias</Link>
        <Link to="/contacto" className="hover:text-cyan-400 transition-colors">Contacto</Link>
        <Link to="/login" className="bg-cyan-500 px-4 py-2 rounded-md hover:bg-cyan-600 transition-all text-white font-bold">Login</Link>
      </nav>
    </header>
    <main className="flex-1">
      <Outlet />
    </main>
    <footer className="p-8 text-center text-stone-500 border-t border-white/5 bg-black/20">
      &copy; {new Date().getFullYear()} Autódromo Rafaela. Desarrollo por Mar Digitals.
    </footer>
  </div>
);

export default PublicLayout;