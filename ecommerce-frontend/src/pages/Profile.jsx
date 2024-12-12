import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { updateUser, clearUpdateSuccess } from '../redux/slices/authSlice';

function Profile() {
  const dispatch = useDispatch();
  const { user, loading, error, updateSuccess } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (updateSuccess) {
      setTimeout(() => {
        dispatch(clearUpdateSuccess());
      }, 3000);
    }
  }, [updateSuccess, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateData = {
      name: formData.name,
      email: formData.email,
    };

    if (formData.password && formData.newPassword) {
      updateData.currentPassword = formData.password;
      updateData.newPassword = formData.newPassword;
    }

    dispatch(updateUser(updateData));
  };

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{ width: 100, height: 100, mb: 2 }}
            src={user.avatar}
          >
            {user.name?.charAt(0)}
          </Avatar>
          <Typography component="h1" variant="h5">
            Perfil de Usuario
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Cambiar Contraseña (opcional)
              </Typography>
              <TextField
                fullWidth
                label="Contraseña Actual"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Nueva Contraseña"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Actualizar Perfil'}
              </Button>
            </Grid>
          </Grid>
        </form>

        <Snackbar
          open={!!error || updateSuccess}
          autoHideDuration={6000}
          onClose={() => dispatch(clearUpdateSuccess())}
        >
          <Alert
            severity={error ? 'error' : 'success'}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {error || 'Perfil actualizado exitosamente'}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}

export default Profile;
