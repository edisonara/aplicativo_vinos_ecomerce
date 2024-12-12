import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Rating,
  TextField,
  Avatar,
  Divider,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { addToCart } from '../redux/cartSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    // Aquí irá la llamada a la API para obtener el producto
    // Por ahora usamos datos de ejemplo
    setProduct({
      id: 1,
      name: 'Vino Tinto Reserva',
      price: 25.99,
      image: '/images/vino-tinto.jpg',
      category: 'vinos',
      description: 'Vino tinto reserva de alta calidad, añejado en barricas de roble francés por 18 meses. Notas de frutos rojos, vainilla y especias.',
      stock: 50,
      rating: 4.5,
      details: {
        origen: 'Valle de Napa, California',
        añejamiento: '18 meses en barrica',
        alcohol: '13.5%',
        maridaje: 'Carnes rojas, quesos maduros',
        temperatura: '16-18°C'
      },
      reviews: [
        { id: 1, rating: 5, comment: 'Excelente vino, muy equilibrado', user: 'Juan', date: '2023-12-01' },
        { id: 2, rating: 4, comment: 'Muy bueno, gran relación calidad-precio', user: 'María', date: '2023-11-28' }
      ]
    });
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    // Aquí irá la lógica para enviar la reseña al backend
    console.log('Nueva reseña:', newReview);
  };

  if (!product) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Volver
      </Button>

      <Grid container spacing={4}>
        {/* Imagen y detalles principales */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '500px',
                objectFit: 'contain'
              }}
            />
          </Paper>
        </Grid>

        {/* Información del producto */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>
              <IconButton color="primary">
                <FavoriteIcon />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({product.reviews.length} reseñas)
              </Typography>
            </Box>

            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price}
            </Typography>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Detalles del Producto
              </Typography>
              {Object.entries(product.details).map(([key, value]) => (
                <Typography key={key} variant="body2" sx={{ mb: 1 }}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                </Typography>
              ))}
            </Box>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={!product.stock}
                fullWidth
              >
                {product.stock ? 'Agregar al Carrito' : 'Agotado'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Sección de Reseñas */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Reseñas de Clientes
            </Typography>

            {/* Formulario para nueva reseña */}
            <Box component="form" onSubmit={handleSubmitReview} sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Escribir una Reseña
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography component="legend">Calificación</Typography>
                <Rating
                  value={newReview.rating}
                  onChange={(_, value) => setNewReview(prev => ({ ...prev, rating: value }))}
                />
              </Box>
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
              <Button variant="contained" type="submit">
                Enviar Reseña
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Lista de reseñas */}
            <Grid container spacing={2}>
              {product.reviews.map((review) => (
                <Grid item xs={12} key={review.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ mr: 2 }}>{review.user[0]}</Avatar>
                        <Box>
                          <Typography variant="subtitle1">{review.user}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {review.date}
                          </Typography>
                        </Box>
                      </Box>
                      <Rating value={review.rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {review.comment}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
