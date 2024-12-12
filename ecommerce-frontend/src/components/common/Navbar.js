import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          Licores E-commerce
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/products"
            sx={{ mr: 2 }}
          >
            Productos
          </Button>

          {user ? (
            <>
              <IconButton
                color="inherit"
                component={RouterLink}
                to="/cart"
                sx={{ mr: 2 }}
              >
                <Badge color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              <Button
                color="inherit"
                component={RouterLink}
                to="/profile"
                sx={{ mr: 2 }}
              >
                {user.name}
              </Button>

              <Button color="inherit" onClick={logout}>
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              component={RouterLink}
              to="/auth"
            >
              Iniciar Sesión
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
