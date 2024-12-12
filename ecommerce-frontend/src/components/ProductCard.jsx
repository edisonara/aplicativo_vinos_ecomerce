import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  IconButton,
  Chip,
  Rating,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { addToCart } from '../redux/slices/cartSlice';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/auth?mode=login');
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.imageUrl || 'https://via.placeholder.com/200'}
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 1 }}>
          <Chip
            label={product.category}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
        <Typography gutterBottom variant="h6" component="h2" sx={{ mb: 1 }}>
          {product.name}
        </Typography>
        <Rating value={product.rating || 0} readOnly size="small" sx={{ mb: 1 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {product.description?.substring(0, 100)}
          {product.description?.length > 100 ? '...' : ''}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary">
            ${product.price?.toFixed(2)}
          </Typography>
          <Box>
            <IconButton
              color="primary"
              onClick={handleAddToCart}
              disabled={!product.stock || product.stock <= 0}
            >
              <AddShoppingCartIcon />
            </IconButton>
          </Box>
        </Box>
        {product.stock <= 0 && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Agotado
          </Typography>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
            ¡Últimas {product.stock} unidades!
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default ProductCard;
