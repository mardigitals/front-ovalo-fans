import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios'; 

export const useAuth = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/usuario-auth/perfil');
        setUserProfile(response.data);
      } catch (error) {
        console.error("Acceso denegado o token expirado", error);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Devolvemos lo que los componentes van a necesitar usar
  return { 
    userProfile, 
    isLoading, 
    handleLogout 
  };
};