import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Container, 
    Grid, 
    Card, 
    CardMedia, 
    CardContent, 
    Typography, 
    Button,
    CircularProgress,
    Box,
    Rating,
    styled
} from '@mui/material';
import { fetchProducts } from '../redux/slices/productSlice';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 20px rgba(0,0,0,0.2)',
    },
    borderRadius: '15px',
    overflow: 'hidden',
}));

const StyledCardMedia = styled(CardMedia)({
    paddingTop: '56.25%', // 16:9
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)',
    },
});

const StyledButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    border: 0,
    borderRadius: '20px',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: '10px 0',
    '&:hover': {
        background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
        transform: 'scale(1.02)',
    },
}));

function Products() {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector(state => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Typography color="error" variant="h5">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                align="center"
                sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 6
                }}
            >
                Nuestros Productos
            </Typography>
            <Grid container spacing={4}>
                {items.map((product) => (
                    <Grid item key={product._id} xs={12} sm={6} md={4}>
                        <StyledCard>
                            <StyledCardMedia
                                image={product.image}
                                title={product.name}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                                    {product.name}
                                </Typography>
                                <Typography 
                                    variant="h6" 
                                    color="primary" 
                                    sx={{ 
                                        mb: 2,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    ${product.price.toFixed(2)}
                                </Typography>
                                <Rating 
                                    value={product.rating || 4.5} 
                                    precision={0.5} 
                                    readOnly 
                                    sx={{ mb: 2 }}
                                />
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary" 
                                    sx={{ mb: 2 }}
                                >
                                    {product.description}
                                </Typography>
                                <StyledButton 
                                    fullWidth 
                                    variant="contained" 
                                    startIcon={<ShoppingCartIcon />}
                                >
                                    Añadir al Carrito
                                </StyledButton>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Products;