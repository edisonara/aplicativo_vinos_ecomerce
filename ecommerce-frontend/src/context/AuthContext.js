import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Configurar axios para usar el token en todas las peticiones
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Forzar recarga solo si no estamos en la página de autenticación
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth?mode=login';
      }
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/users/me');
      
      if (response.data) {
        setUser(response.data);
        setError(null);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password
      });

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return response.data;
      } else {
        throw new Error('No se recibió token de autenticación');
      }
    } catch (err) {
      console.error('Error en autenticación:', err);
      setError(err.response?.data?.message || 'Error en el inicio de sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('http://localhost:5000/api/users/register', {
        name,
        email,
        password
      });

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return response.data;
      } else {
        throw new Error('No se recibió token de registro');
      }
    } catch (err) {
      console.error('Error en registro:', err);
      setError(err.response?.data?.message || 'Error en el registro');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        checkAuthStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
