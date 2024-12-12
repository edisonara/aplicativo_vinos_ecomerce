import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  IconButton,
  Container,
  Rating,
  CardActionArea,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const dispatch = useDispatch();

  useEffect(() => {
    // Aquí irá la llamada a la API para obtener los productos
    setProducts([
      {
        id: 1,
        name: 'Vino Tinto Reserva',
        price: 25.99,
        image: '/images/vino-tinto.jpg',
        category: 'vinos',
        description: 'Vino tinto reserva de alta calidad',
        stock: 50,
        rating: 4.5,
        reviews: [
          { id: 1, rating: 5, comment: 'Excelente vino', user: 'Juan' },
          { id: 2, rating: 4, comment: 'Muy bueno', user: 'María' }
        ]
      },
      {
        id: 2,
        name: 'Vino añejado',
        price: 29.99,
        image: '/images/vino-añejado.jpg',
        category: 'vinos',
        description: 'Estén es del vino antiguo',
        stock: 100,
        rating: 4.0,
        reviews: [
          { id: 3, rating: 4, comment: 'Gran sabor', user: 'Pedro' }
        ]
      },
    ]);
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === '' || product.category === category;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Buscar productos"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={category}
                label="Categoría"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="vinos">Vinos</MenuItem>
                <MenuItem value="licores">Licores</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={sortBy}
                label="Ordenar por"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="price_asc">Precio: Menor a Mayor</MenuItem>
                <MenuItem value="price_desc">Precio: Mayor a Menor</MenuItem>
                <MenuItem value="name">Nombre</MenuItem>
                <MenuItem value="rating">Mejor Valorados</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography gutterBottom>Rango de Precio</Typography>
            <Slider
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
            />
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 6,
                }
              }}
            >
              <CardActionArea onClick={() => handleProductClick(product.id)}>
                <CardMedia
                  component="img"
                  height="280"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: 'cover', p: 2 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={product.rating} precision={0.5} readOnly />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.reviews?.length || 0} reseñas)
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    ${product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stock: {product.stock}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                <Button
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  disabled={!product.stock}
                >
                  {product.stock ? 'Agregar' : 'Agotado'}
                </Button>
                <IconButton 
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Manejar favoritos
                  }}
                >
                  <FavoriteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products;