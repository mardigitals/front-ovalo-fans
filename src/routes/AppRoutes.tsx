import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import HomePage from '@/pages/public/HomePage';
import LoginPage from '@/pages/public/LoginPage';
import RegisterPage from '@/pages/public/RegisterPage';
import TermsConditionsPage from '@/pages/public/TermsConditionsPage';
import PrivacyPolicy from '@/pages/public/PrivacyPolicy';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ComerciosPage from '@/pages/dashboard/ComerciosPage';
import CuentasPage from '@/pages/dashboard/CuentasPage';
import ResetPasswordPage from '@/pages/public/ResetPasswordPage';
import PagoExitoPage from '@/pages/public/PagoExitoPage';
import PagoErrorPage from '@/pages/public/PagoErrorPage';
import PagoPendientePage from '@/pages/public/PagoPendientePage';
import MiPerfilPage from '@/pages/dashboard/MiPerfilPage';
import MiCuentaPage from '@/pages/dashboard/MiCuentaPage';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>

      {/* Rutas Públicas */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/terms-conditions" element={<TermsConditionsPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      {/* RUTAS DE RETORNO DE MERCADO PAGO (Públicas) */}
      <Route path="/pago/exito" element={<PagoExitoPage />} />
      <Route path="/pago/error" element={<PagoErrorPage />} />
      <Route path="/pago/pendiente" element={<PagoPendientePage />} />
      

      {/* Rutas Privadas */}
      <Route element={<ProtectedRoute />}>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<div className="sub-title-fan">Bienvenido al Panel de Óvalo Fans</div>} />
          <Route path="comercios" element={<ComerciosPage />} />
          <Route path="cuentas" element={<CuentasPage />} />
          <Route path="mi-cuenta" element={<MiCuentaPage />} />
          <Route path="mi-perfil" element={<MiPerfilPage />} />
        </Route>

      </Route>

    </Routes>
  </BrowserRouter>
);
export default AppRoutes;