import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ProductCard from '../components/ProductCard';

function Products() {
  const { user } = useSelector(state => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name'
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = 'http://localhost:5000/api/products';
      let params = {};

      // Aplicar filtros
      if (filters.category !== 'all') {
        params.category = filters.category;
      }
      if (filters.minPrice) {
        params.minPrice = filters.minPrice;
      }
      if (filters.maxPrice) {
        params.maxPrice = filters.maxPrice;
      }
      if (filters.sortBy) {
        params.sort = filters.sortBy;
      }

      const response = await axios.get(url, { params });
      const allProducts = Array.isArray(response.data) ? response.data : 
                         response.data.products ? response.data.products : [];
      setProducts(allProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    });
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [
    'all',
    'Vinos',
    'Cervezas',
    'Licores',
    'Whisky',
    'Ron',
    'Vodka',
    'Tequila'
  ];

  const sortOptions = [
    { value: 'name', label: 'Nombre' },
    { value: 'price', label: 'Precio: Menor a Mayor' },
    { value: '-price', label: 'Precio: Mayor a Menor' },
    { value: '-rating', label: 'Mejor Valorados' }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Barra de búsqueda y filtros */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="flex-end">
              <IconButton onClick={() => setDrawerOpen(true)}>
                <FilterListIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Drawer de Filtros */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filtros
          </Typography>
          <List>
            <ListItem>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={filters.category}
                  name="category"
                  onChange={handleFilterChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category === 'all' ? 'Todas las categorías' : category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItem>
            <ListItem>
              <FormControl fullWidth>
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={filters.sortBy}
                  name="sortBy"
                  onChange={handleFilterChange}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItem>
            <ListItem>
              <TextField
                fullWidth
                type="number"
                label="Precio mínimo"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
            </ListItem>
            <ListItem>
              <TextField
                fullWidth
                type="number"
                label="Precio máximo"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Filtros activos */}
      {(filters.category !== 'all' || filters.minPrice || filters.maxPrice) && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Filtros activos:
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {filters.category !== 'all' && (
              <Chip
                label={`Categoría: ${filters.category}`}
                onDelete={() => handleFilterChange({ target: { name: 'category', value: 'all' } })}
              />
            )}
            {filters.minPrice && (
              <Chip
                label={`Precio mín: $${filters.minPrice}`}
                onDelete={() => handleFilterChange({ target: { name: 'minPrice', value: '' } })}
              />
            )}
            {filters.maxPrice && (
              <Chip
                label={`Precio máx: $${filters.maxPrice}`}
                onDelete={() => handleFilterChange({ target: { name: 'maxPrice', value: '' } })}
              />
            )}
          </Box>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : filteredProducts.length > 0 ? (
        <Grid container spacing={4}>
          {filteredProducts.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info">
          No se encontraron productos que coincidan con tu búsqueda.
        </Alert>
      )}
    </Container>
  );
}

export default Products;