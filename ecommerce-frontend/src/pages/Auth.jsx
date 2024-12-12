import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { login, register, clearError } from '../redux/slices/authSlice';

function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [tab, setTab] = useState(0);
  const [localError, setLocalError] = useState('');

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      // Redirigir al usuario a la página anterior o a la página principal
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    dispatch(clearError());

    if (!loginData.email || !loginData.password) {
      setLocalError('Por favor, complete todos los campos');
      return;
    }

    try {
      await dispatch(login(loginData)).unwrap();
    } catch (err) {
      setLocalError(err.message || 'Error al iniciar sesión');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    dispatch(clearError());

    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      setLocalError('Por favor, complete todos los campos');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }

    if (registerData.password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const { confirmPassword, ...userData } = registerData;
      await dispatch(register(userData)).unwrap();
    } catch (err) {
      setLocalError(err.message || 'Error al registrarse');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setLocalError('');
    dispatch(clearError());
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Iniciar Sesión" />
          <Tab label="Registrarse" />
        </Tabs>

        {(error || localError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || localError}
          </Alert>
        )}

        {tab === 0 ? (
          // Login Form
          <form onSubmit={handleLoginSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              margin="normal"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
            </Button>
          </form>
        ) : (
          // Register Form
          <form onSubmit={handleRegisterSubmit}>
            <TextField
              fullWidth
              label="Nombre"
              value={registerData.name}
              onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Confirmar Contraseña"
              type="password"
              value={registerData.confirmPassword}
              onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
              margin="normal"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Registrarse'}
            </Button>
          </form>
        )}
      </Paper>
    </Container>
  );
}

export default Auth;
