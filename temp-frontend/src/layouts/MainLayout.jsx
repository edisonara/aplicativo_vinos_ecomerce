import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button, IconButton, Badge, useTheme } from '@mui/material';
import { ShoppingCart, Person, Menu as MenuIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onClick={() => navigate('/')}
          >
            E-Commerce
          </Typography>

          <IconButton 
            color="inherit"
            onClick={() => navigate('/cart')}
          >
            <Badge badgeContent={cartItems.length} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {isAuthenticated ? (
            <IconButton 
              color="inherit"
              onClick={() => navigate('/profile')}
            >
              <Person />
            </IconButton>
          ) : (
            <Button 
              color="inherit"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          mt: '64px', // height of AppBar
          p: 3,
        }}
      >
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: theme.palette.primary.main,
          color: 'white',
        }}
      >
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} E-Commerce. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default MainLayout;
