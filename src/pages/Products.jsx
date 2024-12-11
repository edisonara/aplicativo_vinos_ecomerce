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
    CircularProgress 
} from '@mui/material';
import { fetchProducts } from '../redux/slices/productSlice';

function Products() {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector(state => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography color="error">Error: {error}</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h2" component="h1" gutterBottom>
                Our Products
            </Typography>
            <Grid container spacing={4}>
                {items.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={product.image}
                                alt={product.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {product.description}
                                </Typography>
                                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                                    ${product.price}
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    fullWidth 
                                    sx={{ mt: 2 }}
                                >
                                    Add to Cart
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Products; 