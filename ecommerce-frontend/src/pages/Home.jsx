import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import { useNavigate } from 'react-router-dom';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  padding: theme.spacing(15, 0),
  textAlign: 'center',
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(6),
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
  },
}));

const StyledIcon = styled(Box)(({ theme }) => ({
  fontSize: '3rem',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      title: 'Compra Fácil',
      description: 'Proceso de compra simple y seguro'
    },
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
      title: 'Envío Rápido',
      description: 'Entrega a todo el país'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Compra Segura',
      description: 'Transacciones 100% seguras'
    },
  ];

  return (
    <Box>
      <HeroSection>
        <Container>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              mb: 4
            }}
          >
            Bienvenido a Nuestra Tienda
          </Typography>
          <Typography
            variant="h5"
            sx={{ mb: 4 }}
          >
            Descubre productos increíbles a precios inmejorables
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              },
              px: 4,
              py: 2,
              borderRadius: 2,
            }}
          >
            Ver Productos
          </Button>
        </Container>
      </HeroSection>

      <Container>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <FeatureCard elevation={3}>
                <StyledIcon>{feature.icon}</StyledIcon>
                <Typography variant="h5" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;