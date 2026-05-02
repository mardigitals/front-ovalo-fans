import { useState, useEffect } from 'react';

export const useTheme = () => {
  // Inicializamos el estado leyendo la clase del HTML o el localStorage
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || localStorage.getItem('color-theme') === 'dark';
    }
    return false;
  });

  // Función para alternar los modos
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
      setIsDark(true);
    }
  };

  // Efecto opcional pero recomendado: Sincroniza el estado si cambia en otra pestaña
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  return { isDark, toggleTheme };
};