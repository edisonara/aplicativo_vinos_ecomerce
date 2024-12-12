import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          Licores Store
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/login"
            sx={{ mr: 1 }}
          >
            Iniciar Sesión
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/register"
          >
            Registrarse
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
