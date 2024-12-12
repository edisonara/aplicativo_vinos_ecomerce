import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCart(response.data.data);
    } catch (err) {
      setError('Error al cargar el carrito');
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const updateQuantity = async (itemId, change) => {
    try {
      await axios.put(
        `http://localhost:5000/api/cart/items/${itemId}`,
        { quantity: change },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchCart();
    } catch (err) {
      setError('Error al actualizar cantidad');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/items/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchCart();
    } catch (err) {
      setError('Error al eliminar item');
    }
  };

  const handleCheckout = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/orders',
        { items: cart.items },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setCart({ items: [], total: 0 });
    } catch (err) {
      setError('Error al procesar el pedido');
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md">
        <Alert severity="info">
          Por favor, inicia sesión para ver tu carrito
        </Alert>
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

        {cart.items.length === 0 ? (
          <Typography>Tu carrito está vacío</Typography>
        ) : (
          <>
            <List>
              {cart.items.map((item) => (
                <ListItem key={item._id}>
                  <ListItemText
                    primary={item.product.name}
                    secondary={`Precio: $${item.product.price}`}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <IconButton
                      onClick={() => updateQuantity(item._id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                    <IconButton onClick={() => updateQuantity(item._id, 1)}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => removeItem(item._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            <Box sx={{ mt: 3, textAlign: 'right' }}>
              <Typography variant="h6" gutterBottom>
                Total: ${cart.total}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCheckout}
              >
                Proceder al Pago
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Cart;
