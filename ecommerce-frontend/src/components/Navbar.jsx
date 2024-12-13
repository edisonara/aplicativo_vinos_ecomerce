import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  LocalBar as LocalBarIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const cartItems = useSelector(state => state.cart.items);

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/');
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const menuItems = [
    { text: 'Inicio', icon: <HomeIcon />, path: '/' },
    { text: 'Productos', icon: <LocalBarIcon />, path: '/products' },
  ];

  const renderUserMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {user?.name || 'Usuario'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email}
        </Typography>
      </Box>
      <Divider />
      <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Mi Perfil</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Configuración</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Cerrar Sesión</ListItemText>
      </MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    >
      <Box sx={{ width: 250 }} role="presentation">
        {isAuthenticated && (
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {user?.name || 'Usuario'}
            </Typography>
            <Typography variant="body2">
              {user?.email}
            </Typography>
          </Box>
        )}
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          {isAuthenticated ? (
            <>
              <ListItem
                button
                onClick={() => {
                  navigate('/profile');
                  setMobileMenuOpen(false);
                }}
              >
                <ListItemIcon><PersonIcon /></ListItemIcon>
                <ListItemText primary="Mi Perfil" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  navigate('/cart');
                  setMobileMenuOpen(false);
                }}
              >
                <ListItemIcon>
                  <Badge badgeContent={cartItemCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Carrito" />
              </ListItem>
              <ListItem button onClick={handleLogout}>
                <ListItemIcon><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Cerrar Sesión" />
              </ListItem>
            </>
          ) : (
            <ListItem
              button
              onClick={() => {
                navigate('/auth');
                setMobileMenuOpen(false);
              }}
            >
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Iniciar Sesión" />
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Licorería Online
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isMobile && (
            <Tooltip title="Carrito">
              <IconButton
                color="inherit"
                onClick={() => navigate('/cart')}
              >
                <Badge badgeContent={cartItemCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          {isAuthenticated ? (
            <>
              {!isMobile && (
                <Tooltip title="Cuenta">
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <Avatar
                      sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}
                    >
                      {user?.name?.charAt(0) || 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              )}
            </>
          ) : (
            !isMobile && (
              <Button
                color="inherit"
                startIcon={<PersonIcon />}
                onClick={() => navigate('/auth')}
              >
                Iniciar Sesión
              </Button>
            )
          )}

          {isMobile && (
            <IconButton
              color="inherit"
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>

        {renderUserMenu}
        {renderMobileMenu}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
