import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  TextField,
  Alert,
  Snackbar
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../redux/slices/authSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      setSnackbar({
        open: true,
        message: 'Las contraseñas nuevas no coinciden',
        severity: 'error'
      });
      return;
    }

    try {
      await dispatch(updateProfile({
        currentPassword: password.current,
        newPassword: password.new
      })).unwrap();

      setSnackbar({
        open: true,
        message: 'Contraseña actualizada exitosamente',
        severity: 'success'
      });
      setPassword({ current: '', new: '', confirm: '' });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Error al actualizar la contraseña',
        severity: 'error'
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Configuración
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Preferencias de la Aplicación
        </Typography>
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
            }
            label="Modo Oscuro"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
            }
            label="Notificaciones"
          />
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Cambiar Contraseña
        </Typography>
        <Box component="form" onSubmit={handlePasswordChange}>
          <TextField
            fullWidth
            type="password"
            label="Contraseña Actual"
            value={password.current}
            onChange={(e) => setPassword({ ...password, current: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            type="password"
            label="Nueva Contraseña"
            value={password.new}
            onChange={(e) => setPassword({ ...password, new: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            type="password"
            label="Confirmar Nueva Contraseña"
            value={password.confirm}
            onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
            margin="normal"
            required
          />
          <Box sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Cambiar Contraseña
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings;
