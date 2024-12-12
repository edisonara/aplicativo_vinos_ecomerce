import React from 'react';
import {
  Container,
  Typography,
  List,
  IconButton,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, clearCart } from '../redux/slices/cartSlice';

function Cart() {
  const dispatch = useDispatch();
  const { cart, loading } = useSelector((state) => state.cart);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (loading) {
    return (
      <Container>
        <Typography>Cargando...</Typography>
      </Container>
    );
  }

  if (cart.length === 0) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Tu carrito está vacío
        </Typography>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="contained" color="primary" href="/">
            Ir a Productos
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom>
        Tu Carrito
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <List>
              {cart.map((item) => (
                <React.Fragment key={item._id}>
                  <Box p={2}>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={3}>
                        <img
                          src={item.imageUrl || 'https://via.placeholder.com/100'}
                          alt={item.name}
                          style={{ width: '100%', maxWidth: '100px', height: 'auto' }}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography color="textSecondary">
                          Cantidad: {item.quantity}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="h6">
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveFromCart(item._id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen del Pedido
              </Typography>
              <Box my={2}>
                <Grid container justifyContent="space-between">
                  <Typography>Subtotal:</Typography>
                  <Typography>${cartTotal.toFixed(2)}</Typography>
                </Grid>
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Proceder al Pago
              </Button>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleClearCart}
              >
                Vaciar Carrito
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Cart;