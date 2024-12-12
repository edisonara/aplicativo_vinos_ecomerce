import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  Box,
  CircularProgress,
  Rating,
  Divider,
  Button,
  TextField,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { 
  ShoppingCart, 
  Add as AddIcon, 
  Remove as RemoveIcon,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { fetchProductById } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct: product, loading, error } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'Debes iniciar sesión para agregar productos al carrito',
        severity: 'warning'
      });
      navigate('/auth');
      return;
    }

    dispatch(addToCart({ productId: product._id, quantity }));
    setSnackbar({
      open: true,
      message: 'Producto agregado al carrito exitosamente',
      severity: 'success'
    });
  };

  const handleReviewSubmit = () => {
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'Debes iniciar sesión para dejar una reseña',
        severity: 'warning'
      });
      navigate('/auth');
      return;
    }

    // Aquí iría la lógica para enviar la reseña
    setNewReview({ rating: 0, comment: '' });
    setSnackbar({
      open: true,
      message: 'Reseña enviada exitosamente',
      severity: 'success'
    });
  };

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

  if (!product) {
    return (
      <Container>
        <Typography variant="h6">Producto no encontrado</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              sx={{
                height: 400,
                objectFit: 'contain',
                p: 2
              }}
              image={product.image}
              alt={product.name}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            ${product.price.toFixed(2)}
          </Typography>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1">
              Categoría: {product.category}
            </Typography>
            <Typography variant="subtitle1">
              Marca: {product.brand}
            </Typography>
            <Typography variant="subtitle1">
              Contenido alcohólico: {product.alcoholContent}%
            </Typography>
            <Typography 
              variant="subtitle1" 
              color={product.stock > 0 ? 'success.main' : 'error.main'}
              sx={{ fontWeight: 'bold' }}
            >
              Stock disponible: {product.stock}
            </Typography>
          </Box>

          {product.stock > 0 && (
            <Box sx={{ my: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ mx: 2 }}>{quantity}</Typography>
                <IconButton onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock}>
                  <AddIcon />
                </IconButton>
              </Box>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                fullWidth
              >
                Agregar al Carrito
              </Button>
            </Box>
          )}
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Agregar Reseña
            </Typography>
            <Rating
              value={newReview.rating}
              onChange={(_, value) => setNewReview(prev => ({ ...prev, rating: value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Escribe tu reseña aquí..."
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleReviewSubmit}
              disabled={!newReview.rating || !newReview.comment}
            >
              Enviar Reseña
            </Button>
          </Box>
          
          <Typography variant="h6" gutterBottom>
            Reseñas de Clientes
          </Typography>
          {product.ratings && product.ratings.length > 0 ? (
            product.ratings.map((rating, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Rating value={rating.rating} readOnly />
                <Typography variant="body2">{rating.review}</Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body2">
              No hay reseñas disponibles para este producto.
            </Typography>
          )}
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetail;
