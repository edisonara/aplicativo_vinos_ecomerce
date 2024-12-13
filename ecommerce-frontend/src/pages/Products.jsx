import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Slider,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  AddShoppingCart as AddShoppingCartIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../redux/slices/cartSlice';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Products = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  
  // Estados para filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/products', {
        params: {
          search: searchQuery,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          categories: selectedCategories.join(','),
        },
      });
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      navigate('/auth?mode=login');
      return;
    }

    try {
      await dispatch(addToCart({
        productId: product._id,
        quantity: 1
      })).unwrap();
      setSuccessMessage('Producto agregado al carrito');
    } catch (err) {
      setError(err.message || 'Error al agregar al carrito');
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      }
      return [...prev, category];
    });
  };

  const applyFilters = () => {
    fetchProducts();
    setFilterDrawerOpen(false);
  };

  const filterDrawer = (
    <Drawer
      anchor="right"
      open={filterDrawerOpen}
      onClose={() => setFilterDrawerOpen(false)}
    >
      <Box sx={{ width: 250, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Filtros
        </Typography>
        
        <Typography gutterBottom>
          Rango de Precio
        </Typography>
        <Box sx={{ px: 2 }}>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={1000}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>${priceRange[0]}</Typography>
            <Typography>${priceRange[1]}</Typography>
          </Box>
        </Box>

        <Typography sx={{ mt: 2 }} gutterBottom>
          Categorías
        </Typography>
        <List>
          {categories.map((category) => (
            <ListItem key={category._id} dense>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => handleCategoryChange(category._id)}
                  />
                }
                label={category.name}
              />
            </ListItem>
          ))}
        </List>

        <Button
          variant="contained"
          fullWidth
          onClick={applyFilters}
          sx={{ mt: 2 }}
        >
          Aplicar Filtros
        </Button>
      </Box>
    </Drawer>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Productos
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setFilterDrawerOpen(true)}
          >
            Filtros
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                  transition: 'all 0.3s ease-in-out',
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.imageUrl || 'https://via.placeholder.com/200'}
                alt={product.name}
                sx={{ objectFit: 'contain', p: 2, cursor: 'pointer' }}
                onClick={() => navigate(`/products/${product._id}`)}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="h2"
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { color: 'primary.main' },
                  }}
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  {product.name}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {product.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    ${product.price.toFixed(2)}
                  </Typography>
                  <IconButton
                    color="primary"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.stock}
                  >
                    <AddShoppingCartIcon />
                  </IconButton>
                </Box>
                {!product.stock && (
                  <Typography color="error" variant="body2">
                    Agotado
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filterDrawer}

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert
          onClose={() => setSuccessMessage('')}
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Products;