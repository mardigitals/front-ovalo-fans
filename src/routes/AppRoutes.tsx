import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';

// Componente placeholder para el layout público
// Aquí puedes añadir tu header, footer, etc. comunes a las páginas públicas
const PublicLayout = () => (
  <div className="min-h-screen bg-[#08060d] text-white flex flex-col">
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-tighter text-institucional-celeste">
        AUTÓDROMO RAFAELA
      </h1>
      <nav className="space-x-4">
        <Link to="/" className="text-institucional-gris hover:text-institucional-celeste transition-colors">Inicio</Link>
        <Link to="/historia" className="text-institucional-gris hover:text-institucional-celeste transition-colors">Historia</Link>
        <Link to="/calendario" className="text-institucional-gris hover:text-institucional-celeste transition-colors">Calendario</Link>
        <Link to="/noticias" className="text-institucional-gris hover:text-institucional-celeste transition-colors">Noticias</Link>
        <Link to="/contacto" className="text-institucional-gris hover:text-institucional-celeste transition-colors">Contacto</Link>
        <Link to="/login" className="text-institucional-celeste hover:underline ml-4">Login</Link>
      </nav>
    </header>
    <main className="flex-1 p-8">
      <Outlet /> {/* Aquí se renderizarán las páginas públicas específicas */}
    </main>
    <footer className="bg-black/40 backdrop-blur-xl border-t border-white/10 p-4 text-center text-institucional-gris">
      &copy; 2024 Autódromo Rafaela. Todos los derechos reservados.
    </footer>
  </div>
);

// Páginas públicas de ejemplo
const HomePagePublic = () => (
  <div className="text-white p-8 text-center">
    <h2 className="text-4xl font-bold mb-4 text-institucional-celeste">¡Vive la pasión del automovilismo!</h2>
    <p className="text-lg mb-6">Explora nuestra historia, calendario de eventos y las últimas noticias.</p>
    <p className="text-xl mb-8">¡No te pierdas nada! Gestiona tu experiencia como fan y sé parte de la comunidad.</p>
    <Link to="/login" className="inline-block bg-institucional-celeste text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-institucional-celeste/80 transition-colors shadow-lg">
      ¡Únete a ÓVALO FANS! Inicia Sesión
    </Link>
  </div>
);
const HistoriaPage = () => <div className="text-white p-8"><h2>Nuestra Historia</h2><p>Un legado de velocidad y pasión.</p></div>;
const CalendarioPage = () => <div className="text-white p-8"><h2>Calendario de Eventos</h2><p>Próximas carreras y actividades.</p></div>;
const NoticiasPage = () => <div className="text-white p-8"><h2>Últimas Noticias</h2><p>Mantente al día con el autódromo.</p></div>;
const ContactoPage = () => <div className="text-white p-8"><h2>Contacto</h2><p>Envíanos tus consultas.</p></div>;

// Página de Login
const LoginPage = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
    <div className="p-8 rounded-lg bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg text-center">
      <h1 className="text-3xl font-bold mb-4 text-institucional-celeste">Iniciar Sesión</h1>
      <p className="mb-6">Aquí irá tu formulario de login.</p>
      {/* Simulación de login exitoso */}
      <Link to="/dashboard" className="inline-block bg-institucional-celeste text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-institucional-celeste/80 transition-colors">
        Entrar al Dashboard (simulado)
      </Link>
    </div>
  </div>
);

// Páginas del Dashboard (pueden estar en archivos separados si crecen mucho)
const DashboardHome = () => (
  <div className="text-white">
    <h2 className="text-3xl font-bold mb-4">Bienvenido a tu Dashboard, Fan!</h2>
    <p>Aquí verás contenido personalizado según tu perfil.</p>
    {/* Contenido del dashboard */}
  </div>
);

const DashboardMap = () => (
    <div className="text-white">
        <h2 className="text-3xl font-bold mb-4">Mapa Interactivo</h2>
        <p>Aquí irá el mapa con Leaflet.</p>
    </div>
);

const DashboardSocios = () => (
    <div className="text-white">
        <h2 className="text-3xl font-bold mb-4">Gestión de Socios</h2>
        <p>Aquí irá la tabla de socios.</p>
    </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas - Usan PublicLayout */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePagePublic />} />
          <Route path="historia" element={<HistoriaPage />} />
          <Route path="calendario" element={<CalendarioPage />} />
          <Route path="noticias" element={<NoticiasPage />} />
          <Route path="contacto" element={<ContactoPage />} />
        </Route>

        {/* Ruta de Login (no usa PublicLayout ni DashboardLayout) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas Privadas - Usan DashboardLayout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="mapa" element={<DashboardMap />} />
          <Route path="socios" element={<DashboardSocios />} />
          {/* Aquí irían más rutas del dashboard */}
        </Route>

        {/* Ruta para 404 - Página no encontrada */}
        <Route path="*" element={
          <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-4xl">404 - Página no encontrada</h1>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;