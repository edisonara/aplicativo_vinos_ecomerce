import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  TextField,
  Rating,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { addToCart } from '../redux/slices/cartSlice';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0 && value <= (product?.stock || 0)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/auth?mode=login');
      return;
    }

    try {
      await dispatch(addToCart({ 
        productId: product._id, 
        quantity 
      })).unwrap();
      setSuccessMessage('Producto agregado al carrito');
    } catch (err) {
      setError(err.message || 'Error al agregar al carrito');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate('/auth?mode=login');
      return;
    }

    try {
      await dispatch(addToCart({ 
        productId: product._id, 
        quantity 
      })).unwrap();
      navigate('/cart');
    } catch (err) {
      setError(err.message || 'Error al procesar la compra');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">Producto no encontrado</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Imagen del Producto */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Box
              component="img"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: 500,
                objectFit: 'contain',
              }}
              src={product.imageUrl || 'https://via.placeholder.com/400'}
              alt={product.name}
            />
          </Paper>
        </Grid>

        {/* Detalles del Producto */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Rating value={product.rating || 0} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({product.reviews?.length || 0} reseñas)
              </Typography>
            </Box>

            <Typography variant="h5" color="primary" gutterBottom>
              ${(product.price || 0).toFixed(2)}
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              {product.description}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Stock disponible: {product.stock || 0}
              </Typography>
              <TextField
                type="number"
                label="Cantidad"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ min: 1, max: product.stock }}
                sx={{ width: 100 }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                startIcon={<AddShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={!product.stock}
                fullWidth
              >
                Agregar al Carrito
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<ShoppingBagIcon />}
                onClick={handleBuyNow}
                disabled={!product.stock}
                fullWidth
              >
                Comprar Ahora
              </Button>
            </Box>
          </Box>

          {/* Características del Producto */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Características
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Categoría
                  </Typography>
                  <Typography>{product.category}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Marca
                  </Typography>
                  <Typography>{product.brand || 'No especificada'}</Typography>
                </Grid>
                {product.alcohol && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Contenido de Alcohol
                    </Typography>
                    <Typography>{product.alcohol}%</Typography>
                  </Grid>
                )}
                {product.volume && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Volumen
                    </Typography>
                    <Typography>{product.volume}ml</Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar para mensajes de éxito */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert 
          onClose={() => setSuccessMessage('')} 
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ProductDetail;
