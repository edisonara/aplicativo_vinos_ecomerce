import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          cursor: 'pointer',
        },
      }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: 'contain', p: 2 }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {product.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={product.rating} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.reviews} reviews)
          </Typography>
        </Box>

        {product.discount > 0 && (
          <Chip
            label={`${product.discount}% OFF`}
            color="secondary"
            size="small"
            sx={{ alignSelf: 'flex-start', mb: 1 }}
          />
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
            ${product.price.toFixed(2)}
          </Typography>
          {product.discount > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'line-through', ml: 1 }}
            >
              ${(product.price / (1 - product.discount / 100)).toFixed(2)}
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddToCart}
          sx={{ mt: 'auto' }}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
