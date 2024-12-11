import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Divider,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { fetchOrders } from '../redux/slices/orderSlice';
import { useNavigate } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const OrderStatus = styled(Chip)(({ theme, status }) => {
  const colors = {
    pending: theme.palette.warning.main,
    processing: theme.palette.info.main,
    shipped: theme.palette.primary.main,
    delivered: theme.palette.success.main,
  };

  return {
    backgroundColor: colors[status] || theme.palette.grey[500],
    color: 'white',
    fontWeight: 'bold',
  };
});

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending':
      return <PendingIcon />;
    case 'shipped':
      return <LocalShippingIcon />;
    case 'delivered':
      return <CheckCircleIcon />;
    default:
      return <PendingIcon />;
  }
};

function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchOrders());
    } else {
      navigate('/login');
    }
  }, [dispatch, isAuthenticated, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography>Cargando órdenes...</Typography>
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

  if (!orders.length) {
    return (
      <Container sx={{ py: 8 }}>
        <Box textAlign="center">
          <Typography variant="h4" gutterBottom>
            No tienes órdenes todavía
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Ir a Comprar
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Mis Órdenes
      </Typography>
      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order.id}>
            <StyledCard>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6">
                        Orden #{order.id}
                      </Typography>
                      <OrderStatus
                        label={order.status.toUpperCase()}
                        status={order.status}
                        icon={getStatusIcon(order.status)}
                      />
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Box>
                      {order.items.map((item) => (
                        <Box key={item.id} mb={1} display="flex" justifyContent="space-between">
                          <Typography>
                            {item.quantity}x {item.name}
                          </Typography>
                          <Typography>
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Detalles del Pedido
                      </Typography>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography>Fecha:</Typography>
                        <Typography>{new Date(order.createdAt).toLocaleDateString()}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography>Total:</Typography>
                        <Typography fontWeight="bold">${order.total.toFixed(2)}</Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate(`/orders/${order.id}`)}
                        sx={{ mt: 2 }}
                      >
                        Ver Detalles
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Orders;
