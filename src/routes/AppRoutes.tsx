import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import TermsConditionsPage from '@/pages/TermsConditionsPage';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
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
          <Route index element={<div className="sub-title-fan">Bienvenido al Panel de Fan o staff</div>} />
          {/* Aquí irán las secciones del dashboard(staff o fan), etc. */}
        </Route>

      </Route>

    </Routes>
  </BrowserRouter>
);
export default AppRoutes;