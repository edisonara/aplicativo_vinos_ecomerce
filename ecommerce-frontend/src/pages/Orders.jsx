import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Chip,
  Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { fetchOrders, cancelOrder, deleteOrder } from '../redux/slices/orderSlice';

function Orders() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setActionType('view');
    setOpenDialog(true);
  };

  const handleCancelOrder = (order) => {
    setSelectedOrder(order);
    setActionType('cancel');
    setOpenDialog(true);
  };

  const handleDeleteOrder = (order) => {
    setSelectedOrder(order);
    setActionType('delete');
    setOpenDialog(true);
  };

  const handleConfirmAction = async () => {
    try {
      if (actionType === 'cancel') {
        await dispatch(cancelOrder(selectedOrder._id)).unwrap();
      } else if (actionType === 'delete') {
        await dispatch(deleteOrder(selectedOrder._id)).unwrap();
      }
      setOpenDialog(false);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente':
        return 'warning';
      case 'completado':
        return 'success';
      case 'cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography>Cargando pedidos...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom>
        Mis Pedidos
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Pedido</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleViewOrder(order)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  {order.status === 'pendiente' && (
                    <IconButton
                      color="warning"
                      onClick={() => handleCancelOrder(order)}
                    >
                      <CancelIcon />
                    </IconButton>
                  )}
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteOrder(order)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {actionType === 'view'
            ? 'Detalles del Pedido'
            : actionType === 'cancel'
            ? 'Cancelar Pedido'
            : 'Eliminar Pedido'}
        </DialogTitle>
        <DialogContent>
          {actionType === 'view' && selectedOrder && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Productos:
              </Typography>
              {selectedOrder.items.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography>
                    {item.product.name} - Cantidad: {item.quantity}
                  </Typography>
                  <Typography color="text.secondary">
                    Precio: ${item.price.toFixed(2)}
                  </Typography>
                </Box>
              ))}
              <Typography variant="h6" sx={{ mt: 2 }}>
                Dirección de envío:
              </Typography>
              <Typography>
                {selectedOrder.shippingAddress.street}
                <br />
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                <br />
                {selectedOrder.shippingAddress.zipCode}
                <br />
                {selectedOrder.shippingAddress.country}
              </Typography>
            </Box>
          )}
          {actionType === 'cancel' && (
            <Typography>
              ¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer.
            </Typography>
          )}
          {actionType === 'delete' && (
            <Typography>
              ¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            {actionType === 'view' ? 'Cerrar' : 'Cancelar'}
          </Button>
          {actionType !== 'view' && (
            <Button
              variant="contained"
              color={actionType === 'delete' ? 'error' : 'warning'}
              onClick={handleConfirmAction}
            >
              {actionType === 'cancel' ? 'Cancelar Pedido' : 'Eliminar'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Orders;
