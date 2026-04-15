import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        {/* Agregá las demás páginas acá cuando las crees */}
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;