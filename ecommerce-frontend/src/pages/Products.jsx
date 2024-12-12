import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  CircularProgress,
  Alert,
  Rating,
  Pagination,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error, pagination } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (productId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(addToCart({ productId, quantity: 1 }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <Container sx={{ py: 8 }}>
        <Box textAlign="center">
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No hay productos disponibles
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3,
                },
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  height: 250,
                  objectFit: 'cover',
                }}
                image={product.imageUrl || 'https://via.placeholder.com/300x200'}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {product.description}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography variant="h6" color="primary">
                    ${product.price?.toFixed(2)}
                  </Typography>
                  {product.rating !== undefined && (
                    <Rating value={product.rating} readOnly precision={0.5} />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Stock: {product.stock || 0}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddShoppingCartIcon />}
                  onClick={() => handleAddToCart(product._id)}
                  disabled={!product.stock || product.stock === 0}
                >
                  {!product.stock || product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={(_, page) => dispatch(fetchProducts({ page }))}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
}

export default Products;