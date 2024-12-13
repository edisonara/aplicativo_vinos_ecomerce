import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  Chip,
  IconButton,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { addToCart } from '../redux/slices/cartSlice';
import { fetchProductById, clearCurrentProduct } from '../redux/slices/productSlice';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { currentProduct: product, loading, error } = useSelector(state => state.products);
  
  const [quantity, setQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0 && value <= (product?.stock || 0)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Debes iniciar sesión para agregar productos al carrito',
        severity: 'warning'
      });
      navigate('/auth');
      return;
    }

    try {
      await dispatch(addToCart({
        productId: product._id,
        quantity,
        price: product.price
      })).unwrap();
      
      setSnackbar({
        open: true,
        message: 'Producto agregado al carrito',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Error al agregar al carrito',
        severity: 'error'
      });
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Debes iniciar sesión para comprar',
        severity: 'warning'
      });
      navigate('/auth');
      return;
    }
    handleAddToCart();
    navigate('/cart');
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
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
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">Producto no encontrado</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Volver
      </Button>

      <Grid container spacing={4}>
        {/* Imagen del producto */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={product.imageUrl || 'https://via.placeholder.com/400'}
              alt={product.name}
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
              }}
            />
          </Paper>
        </Grid>

        {/* Detalles del producto */}
        <Grid item xs={12} md={6}>
          <Box>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={product.category}
                color="primary"
                variant="outlined"
                size="small"
              />
            </Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating value={product.rating || 0} readOnly precision={0.5} />
              <Typography variant="body2" color="text.secondary">
                ({product.numReviews || 0} reseñas)
              </Typography>
            </Box>
            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price?.toFixed(2)}
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Box sx={{ my: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Stock disponible: {product.stock}
              </Typography>
              {product.stock > 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <TextField
                    type="number"
                    label="Cantidad"
                    value={quantity}
                    onChange={handleQuantityChange}
                    InputProps={{ inputProps: { min: 1, max: product.stock } }}
                    size="small"
                    sx={{ width: 100 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={handleAddToCart}
                    disabled={!product.stock}
                  >
                    Agregar al carrito
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<ShoppingBagIcon />}
                    onClick={handleBuyNow}
                    disabled={!product.stock}
                  >
                    Comprar ahora
                  </Button>
                </Box>
              ) : (
                <Alert severity="error" sx={{ mb: 3 }}>
                  Producto agotado
                </Alert>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Características del producto */}
            <Typography variant="h6" gutterBottom>
              Características
            </Typography>
            <Grid container spacing={2}>
              {product.features?.map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">
                        {feature.name}
                      </Typography>
                      <Typography variant="body2">
                        {feature.value}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ProductDetail;
