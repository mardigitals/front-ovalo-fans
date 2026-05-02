import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import HomePage from '@/pages/public/HomePage';
import LoginPage from '@/pages/public/LoginPage';
import RegisterPage from '@/pages/public/RegisterPage';
import TermsConditionsPage from '@/pages/public/TermsConditionsPage';
import PrivacyPolicy from '@/pages/public/PrivacyPolicy';
import ProtectedRoute from '@/components/auth/ProtectedRoute';


const AppRoutes = () => (
  <BrowserRouter>
    <Routes>

      {/* Rutas Públicas */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/terms-conditions" element={<TermsConditionsPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      

      {/* Rutas Privadas */}
      <Route element={<ProtectedRoute />}>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<div className="sub-title-fan">Bienvenido al Panel de Óvalo Fans</div>} />
          {/* Aquí irán las secciones del dashboard */}
        </Route>

      </Route>

    </Routes>
  </BrowserRouter>
);
export default AppRoutes;