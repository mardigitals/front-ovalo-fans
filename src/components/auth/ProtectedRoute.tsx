import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Buscamos el token en el bolsillo del usuario
  const token = localStorage.getItem('token');

  // Si no hay token, lo mandamos al login inmediatamente y reemplazamos el historial
  // para que no pueda volver atrás con la flecha del navegador
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token, lo dejamos pasar a las rutas hijas (el Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;