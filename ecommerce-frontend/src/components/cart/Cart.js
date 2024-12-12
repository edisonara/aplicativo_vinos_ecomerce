import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Box,
  Alert,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAuth } from '../../context/AuthContext';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../../redux/slices/cartSlice';
import { createOrder } from '../../redux/slices/orderSlice';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, total, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      await dispatch(updateCartItem({ itemId, quantity })).unwrap();
    } catch (err) {
      console.error('Error al actualizar cantidad:', err);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await dispatch(removeFromCart(itemId)).unwrap();
    } catch (err) {
      console.error('Error al eliminar item:', err);
    }
  };

  const handleCheckout = async () => {
    try {
      const orderData = {
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || ''
        },
        totalAmount: total,
        paymentMethod: 'credit_card' // Por defecto
      };

      await dispatch(createOrder(orderData)).unwrap();
      await dispatch(clearCart());
      navigate('/orders'); // Redirigir a la página de órdenes
    } catch (err) {
      console.error('Error al procesar el pedido:', err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Typography>Cargando carrito...</Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md">
        <Alert severity="info">
          Por favor, inicia sesión para ver tu carrito
        </Alert>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="md">
        <Alert severity="info">
          Tu carrito está vacío
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Ver Productos
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Mi Carrito
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <List>
              {items.map((item) => (
                <ListItem key={item._id} divider>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <ListItemText
                        primary={item.product.name}
                        secondary={`Precio: $${item.product.price}`}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <IconButton
                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                      <IconButton 
                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </Typography>
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveItem(item._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom>
                Resumen del Pedido
              </Typography>
              <Box sx={{ my: 2 }}>
                <Grid container justifyContent="space-between">
                  <Typography>Subtotal:</Typography>
                  <Typography>${total.toFixed(2)}</Typography>
                </Grid>
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleCheckout}
                disabled={items.length === 0}
                sx={{ mt: 2 }}
              >
                Proceder al Pago
              </Button>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={() => dispatch(clearCart())}
                sx={{ mt: 2 }}
              >
                Vaciar Carrito
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Cart;
