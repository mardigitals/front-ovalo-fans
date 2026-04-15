import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';


const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rutas Privadas (Dashboard) */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<div className="p-8 text-white">Bienvenido al Panel de Socio</div>} />
        {/* Aquí irán las secciones de Socios, Mapa, etc. */}
      </Route>
    </Routes>
  </BrowserRouter>
);
export default AppRoutes;