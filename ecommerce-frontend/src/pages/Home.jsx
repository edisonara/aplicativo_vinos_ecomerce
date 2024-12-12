import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import ProductCard from '../components/ProductCard';

const categories = [
  'Todos',
  'Vinos',
  'Cervezas',
  'Licores',
  'Whisky',
  'Ron',
  'Vodka',
  'Tequila'
];

function Home() {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = selectedCategory !== 'Todos' ? { category: selectedCategory } : {};
      const response = await axios.get('http://localhost:5000/api/products', { params });
      
      // Asegurarnos de que response.data sea un array
      const allProducts = Array.isArray(response.data) ? response.data : 
                         response.data.products ? response.data.products : [];
      
      setProducts(allProducts);
      
      // Obtener productos destacados (los 4 más vendidos o con mejor rating)
      const featured = [...allProducts]
        .sort((a, b) => ((b.rating || 0) - (a.rating || 0)))
        .slice(0, 4);
      
      setFeaturedProducts(featured);
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                component="h1"
                variant="h2"
                color="inherit"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                Licorería Online
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                Descubre nuestra selección premium de licores y bebidas
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/products')}
                sx={{ mt: 2 }}
              >
                Ver Productos
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <LocalBarIcon sx={{ fontSize: 200, opacity: 0.8 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Categorías */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="categorías de productos"
          >
            {categories.map((category) => (
              <Tab
                key={category}
                label={category}
                value={category}
                sx={{ fontWeight: 'bold' }}
              />
            ))}
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Productos Destacados */}
        {featuredProducts.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
              Productos Destacados
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={4}>
                {featuredProducts.map((product) => (
                  <Grid item key={product._id} xs={12} sm={6} md={3}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Lista de Productos */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            {selectedCategory === 'Todos' ? 'Todos los Productos' : selectedCategory}
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : products.length > 0 ? (
            <Grid container spacing={4}>
              {products.map((product) => (
                <Grid item key={product._id} xs={12} sm={6} md={3}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">
              No hay productos disponibles en esta categoría.
            </Alert>
          )}
        </Box>

        {/* Características */}
        <Box sx={{ py: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Envío Rápido
                  </Typography>
                  <Typography>
                    Entrega a domicilio en menos de 24 horas en la ciudad.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Productos Premium
                  </Typography>
                  <Typography>
                    Selección de las mejores marcas nacionales e internacionales.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Pago Seguro
                  </Typography>
                  <Typography>
                    Múltiples métodos de pago con la mayor seguridad.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;