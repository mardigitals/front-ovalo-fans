import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import RoleGuard from '@/components/auth/RoleGuard';
import NivelGuard from '@/components/auth/NivelGuard';
import FastPassPage from '@/pages/dashboard/FastPassPage';
import PagosPage from '@/pages/dashboard/PagosPage';
import ResumenPage from '@/pages/dashboard/ResumenPage';
import ComerciosFanPage from '@/pages/dashboard/ComerciosFanPage';
import EventosPage from '@/pages/dashboard/EventosPage';
import CalendarPage from '@/pages/public/CalendarPage';
import SuscripcionesMetricasPage from '@/pages/dashboard/SuscripcionMetricasPage';
import PruebasPage from '@/pages/dashboard/PruebasPage';
import BeneficiosPage from '@/pages/dashboard/BeneficiosPage';
import HistoriaPage from '@/pages/public/HistoriaPage';

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
      <Route path="/calendario" element={<CalendarPage />} />
      <Route path="/historia" element={<HistoriaPage  />} />
      {/* RUTAS DE RETORNO DE MERCADO PAGO (Públicas) */}
      <Route path="/pago/exito" element={<PagoExitoPage />} />
      <Route path="/pago/error" element={<PagoErrorPage />} />
      <Route path="/pago/pendiente" element={<PagoPendientePage />} />
      

      {/* Rutas Privadas */}
      <Route element={<ProtectedRoute />}>

        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* SECTOR COMUN (Todos los niveles, P1 - P2 - P3, incluidos los vencidos) */}
        
          <Route index element={<Navigate to="resumen" replace />} />
          <Route path="resumen" element={<ResumenPage />} />
          <Route path="mi-cuenta" element={<MiCuentaPage />} />
          <Route path="mi-perfil" element={<MiPerfilPage />} />
          <Route path="pagos" element={<PagosPage />} />

          {/*  SECTOR BAJO (P1, P2 y P3, activos) */}
          <Route element={<NivelGuard allowedNiveles={['P1', 'P2', 'P3']} />}>
            {/* Cuando crees los componentes, los ponés acá */}
            <Route path="beneficios" element={<BeneficiosPage />} />
            <Route path="comercios-fan" element={<ComerciosFanPage />} />
            <Route path="eventos" element={<EventosPage />} />
            <Route path="pruebas" element={<PruebasPage />} />
            {/* <Route path="promociones" element={<PromocionesPage />} /> */}
          </Route>
          
          {/*  SECTOR MEDIO (P1 y P2) */}
          <Route element={<NivelGuard allowedNiveles={['P1', 'P2']} />}>
            {/* Cuando crees los componentes, los ponés acá */}
            <Route path="fast-pass" element={<FastPassPage />} />
            {/* <Route path="fotos-exclusivas" element={<FotosExclusivasPage />} /> */}
          </Route>

          {/*  SECTOR ALTO (P1) */}
          <Route element={<NivelGuard allowedNiveles={['P1']} />}>
            {/* <Route path="vip" element={<VipBoxesPage />} /> */}
            {/* <Route path="experience-race" element={<ExperienceRacePage />} /> */}
          </Route>

          {/*  SuperAdmin y Administrativo */}
          <Route element={<RoleGuard allowedRoles={['superadmin', 'administrativo']} />}>
            <Route path="comercios" element={<ComerciosPage />} />
            <Route path="eventos" element={<EventosPage />} />
            <Route path="metricas" element={<SuscripcionesMetricasPage />} />
          </Route>

          {/*  SuperAdmin y Prensa */}
          <Route element={<RoleGuard allowedRoles={['superadmin', 'prensa']} />}>
          {/*aca van las rutas de prensa */}
            <Route path="eventos" element={<EventosPage />} />
          </Route>

          {/* Solo SuperAdmin */}
          <Route element={<RoleGuard allowedRoles={['superadmin']} />}>
            <Route path="cuentas" element={<CuentasPage />} />  
          </Route>

        </Route>

      </Route>

    </Routes>
  </BrowserRouter>
);
export default AppRoutes;