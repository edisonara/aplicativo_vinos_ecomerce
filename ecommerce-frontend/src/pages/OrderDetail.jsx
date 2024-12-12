import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Divider,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getOrderById } from '../redux/slices/orderSlice';

const getStatusColor = (status) => {
  const statusColors = {
    pending: 'warning',
    processing: 'info',
    completed: 'success',
    cancelled: 'error',
  };
  return statusColors[status] || 'default';
};

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder: order, loading, error } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (id) {
      dispatch(getOrderById(id));
    }
  }, [dispatch, id, isAuthenticated, navigate]);

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

  if (!order) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">Pedido no encontrado</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/orders')}
        sx={{ mb: 3 }}
      >
        Volver a Pedidos
      </Button>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" component="h1">
                Pedido #{order._id.slice(-8).toUpperCase()}
              </Typography>
              <Chip
                label={order.status}
                color={getStatusColor(order.status)}
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Realizado el{' '}
              {new Date(order.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Productos
            </Typography>
            {order.items.map((item) => (
              <Box key={item._id} sx={{ mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={2} sm={1}>
                    <Typography color="text.secondary">x{item.quantity}</Typography>
                  </Grid>
                  <Grid item xs={7} sm={8}>
                    <Typography>{item.product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${item.price.toFixed(2)} c/u
                    </Typography>
                  </Grid>
                  <Grid item xs={3} sm={3} textAlign="right">
                    <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal</Typography>
              <Typography>${order.subtotal.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Envío</Typography>
              <Typography>${order.shippingCost.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Impuestos</Typography>
              <Typography>${order.tax.toFixed(2)}</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 2,
                pt: 2,
                borderTop: '2px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">${order.total.toFixed(2)}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Información de Envío
              </Typography>
              <Typography>{order.shippingAddress.fullName}</Typography>
              <Typography>{order.shippingAddress.street}</Typography>
              <Typography>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
              </Typography>
              <Typography>{order.shippingAddress.country}</Typography>
              {order.shippingAddress.phone && (
                <Typography sx={{ mt: 1 }}>Tel: {order.shippingAddress.phone}</Typography>
              )}
            </Paper>

            {order.status === 'pending' && (
              <Button
                variant="outlined"
                color="error"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => {
                  // Implementar lógica para cancelar pedido
                }}
              >
                Cancelar Pedido
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default OrderDetail;
