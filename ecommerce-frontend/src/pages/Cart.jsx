import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Button,
  Divider,
  TextField,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { fetchCart, updateCartItem, removeFromCart } from '../redux/slices/cartSlice';
import { createOrder } from '../redux/slices/orderSlice';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const CartItemImage = styled('img')({
  width: '100%',
  height: '120px',
  objectFit: 'cover',
  borderRadius: '8px',
});

const Summary = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  position: 'sticky',
  top: theme.spacing(2),
}));

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleQuantityChange = (itemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      dispatch(updateCartItem({ itemId, quantity: newQuantity }));
    } else {
      dispatch(removeFromCart(itemId));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const orderData = {
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity
      })),
      total: calculateTotal()
    };

    dispatch(createOrder(orderData))
      .unwrap()
      .then(() => {
        navigate('/orders');
      });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography>Cargando carrito...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!items.length) {
    return (
      <Container sx={{ py: 8 }}>
        <Box textAlign="center">
          <Typography variant="h4" gutterBottom>
            Tu carrito está vacío
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Ir a Productos
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Carrito de Compras
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {items.map((item) => (
            <StyledCard key={item.id}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <CartItemImage src={item.image} alt={item.name} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="h6" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography color="primary" variant="h6">
                      ${item.price}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <IconButton
                        onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        value={item.quantity}
                        size="small"
                        InputProps={{
                          readOnly: true,
                          sx: { width: '60px', textAlign: 'center' }
                        }}
                      />
                      <IconButton
                        onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Box display="flex" justifyContent="flex-end">
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </StyledCard>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <Summary elevation={3}>
            <Typography variant="h5" gutterBottom>
              Resumen del Pedido
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>Subtotal</Typography>
              <Typography>${calculateTotal().toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>Envío</Typography>
              <Typography>Gratis</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">${calculateTotal().toFixed(2)}</Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleCheckout}
              sx={{
                py: 2,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
                },
              }}
            >
              Proceder al Pago
            </Button>
          </Summary>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Cart;