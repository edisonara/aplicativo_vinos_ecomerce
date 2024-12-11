import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  Rating,
  TextField,
  Snackbar,
  Alert,
  Card,
  CardMedia,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { addToCart } from '../redux/slices/cartSlice';
import { fetchProductById } from '../redux/slices/productSlice';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const { currentProduct, loading, error } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (quantity > currentProduct.stock) {
      setNotification({
        open: true,
        message: 'No hay suficiente stock disponible',
        severity: 'error'
      });
      return;
    }

    dispatch(addToCart({
      id: currentProduct._id,
      name: currentProduct.name,
      price: currentProduct.price,
      quantity,
      image: currentProduct.image
    }));

    setNotification({
      open: true,
      message: 'Producto agregado al carrito',
      severity: 'success'
    });
  };

  if (loading) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography>Cargando producto...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!currentProduct) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography>Producto no encontrado</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={currentProduct.image}
              alt={currentProduct.name}
              sx={{ objectFit: 'contain' }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {currentProduct.name}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ${currentProduct.price.toFixed(2)}
            </Typography>
            <Box sx={{ my: 2 }}>
              <Rating value={currentProduct.averageRating || 0} readOnly precision={0.5} />
              <Typography variant="body2" color="text.secondary">
                ({currentProduct.ratings?.length || 0} valoraciones)
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              {currentProduct.description}
            </Typography>
            <Box sx={{ my: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Detalles del producto:
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">Categoría:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {currentProduct.category}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Marca:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {currentProduct.brand}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Contenido de alcohol:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {currentProduct.alcoholContent}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Stock disponible:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {currentProduct.stock} unidades
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 3 }}>
              <TextField
                type="number"
                label="Cantidad"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                InputProps={{ inputProps: { min: 1, max: currentProduct.stock } }}
                sx={{ width: 100 }}
              />
              <Button
                variant="contained"
                size="large"
                startIcon={<AddShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={currentProduct.stock === 0}
                sx={{ flex: 1 }}
              >
                {currentProduct.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ProductDetail;
