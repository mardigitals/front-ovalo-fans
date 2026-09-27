import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Apagamos la memoria de scroll del navegador para el F5
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Forzamos el scroll arriba de todo cuando cambia la URL
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Este componente es invisible
};

export default ScrollToTop;