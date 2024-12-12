import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Información de la empresa */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Sobre Nosotros
            </Typography>
            <Typography variant="body2">
              Somos tu tienda de licores de confianza, ofreciendo una amplia selección
              de bebidas premium y un servicio excepcional desde 2023.
            </Typography>
          </Grid>

          {/* Enlaces rápidos */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Enlaces Rápidos
            </Typography>
            <Link href="/products" color="inherit" display="block" sx={{ mb: 1 }}>
              Productos
            </Link>
            <Link href="/cart" color="inherit" display="block" sx={{ mb: 1 }}>
              Carrito
            </Link>
            <Link href="/orders" color="inherit" display="block" sx={{ mb: 1 }}>
              Mis Pedidos
            </Link>
            <Link href="/profile" color="inherit" display="block">
              Mi Perfil
            </Link>
          </Grid>

          {/* Contacto y redes sociales */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Síguenos
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="YouTube">
                <YouTubeIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Contacto: info@licoreria.com
              <br />
              Teléfono: (123) 456-7890
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, backgroundColor: 'rgba(255,255,255,0.2)' }} />

        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} Licorería Premium. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
