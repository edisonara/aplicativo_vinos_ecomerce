import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  TextField,
  IconButton,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import ProductCard from '../components/ProductCard';
import {
  fetchProducts,
  fetchFeaturedProducts,
  setFilters,
  clearFilters,
  setPage,
} from '../redux/slices/productSlice';

const categories = [
  'Todos',
  'Vinos',
  'Cervezas',
  'Licores',
  'Whisky',
  'Ron',
  'Vodka',
  'Tequila'
];

const sortOptions = [
  { value: 'createdAt_desc', label: 'Más recientes' },
  { value: 'createdAt_asc', label: 'Más antiguos' },
  { value: 'price_asc', label: 'Menor precio' },
  { value: 'price_desc', label: 'Mayor precio' },
  { value: 'rating_desc', label: 'Mejor valorados' },
];

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    products, 
    featuredProducts, 
    loading, 
    error,
    filters,
    pagination 
  } = useSelector(state => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(filters.priceRange);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  useEffect(() => {
    // Actualizar productos cuando cambien los filtros o la página
    dispatch(fetchProducts());
  }, [dispatch, filters, pagination.page]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
  };

  const handleCategoryChange = (_, newValue) => {
    dispatch(setFilters({ category: newValue === 'Todos' ? '' : newValue }));
  };

  const handleSortChange = (event) => {
    const [sortBy, order] = event.target.value.split('_');
    dispatch(setFilters({ sortBy, order }));
  };

  const handlePriceChange = (_, newValue) => {
    setPriceRange(newValue);
  };

  const handlePriceChangeCommitted = () => {
    dispatch(setFilters({ priceRange }));
  };

  const handlePageChange = (_, value) => {
    dispatch(setPage(value));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchTerm('');
    setPriceRange([0, 1000]);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                component="h1"
                variant="h2"
                color="inherit"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                Licorería Online
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                Descubre nuestra selección premium de licores y bebidas
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/products')}
                sx={{ mt: 2 }}
              >
                Ver Productos
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <LocalBarIcon sx={{ fontSize: 200, opacity: 0.8 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Barra de búsqueda y filtros */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <form onSubmit={handleSearch}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar productos..."
                    size="small"
                  />
                  <IconButton type="submit" color="primary">
                    <SearchIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <FilterListIcon />
                  </IconButton>
                </Box>
              </form>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={`${filters.sortBy}_${filters.order}`}
                  onChange={handleSortChange}
                  label="Ordenar por"
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Filtros expandibles */}
          {showFilters && (
            <Box sx={{ mt: 2 }}>
              <Typography gutterBottom>Rango de precios</Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                onChangeCommitted={handlePriceChangeCommitted}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                sx={{ width: '100%', maxWidth: 300 }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={handleClearFilters}
                sx={{ mt: 1 }}
              >
                Limpiar filtros
              </Button>
            </Box>
          )}
        </Box>

        {/* Categorías */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={filters.category || 'Todos'}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="categorías de productos"
          >
            {categories.map((category) => (
              <Tab
                key={category}
                label={category}
                value={category}
                sx={{ fontWeight: 'bold' }}
              />
            ))}
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Productos Destacados */}
        {featuredProducts.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
              Productos Destacados
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={4}>
                {featuredProducts.map((product) => (
                  <Grid item key={product._id} xs={12} sm={6} md={3}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Lista de Productos */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            {filters.category || 'Todos los Productos'}
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : products.length > 0 ? (
            <>
              <Grid container spacing={4}>
                {products.map((product) => (
                  <Grid item key={product._id} xs={12} sm={6} md={3}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
              {pagination.totalPages > 1 && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          ) : (
            <Alert severity="info">No se encontraron productos</Alert>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default Home;