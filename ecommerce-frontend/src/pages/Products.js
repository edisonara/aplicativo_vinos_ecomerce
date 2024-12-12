import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  CircularProgress,
} from '@mui/material';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  height: 200,
                  objectFit: 'contain',
                  bgcolor: 'background.paper'
                }}
                image={product.image || 'https://via.placeholder.com/200'}
                title={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  ${product.price?.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Categoría: {product.category}
                </Typography>
                {product.stock <= 0 ? (
                  <Typography color="error" sx={{ mt: 1 }}>
                    Sin stock
                  </Typography>
                ) : (
                  <Typography color="success.main" sx={{ mt: 1 }}>
                    Stock: {product.stock}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', p: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={product.stock <= 0}
                >
                  {product.stock <= 0 ? 'Sin Stock' : 'Añadir al Carrito'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products;
