import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',  // URL de tu backend Django
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para manejar tokens
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    login: (credentials) => API.post('/login/', credentials),
    register: (userData) => API.post('/register/', userData),
    logout: () => API.post('/logout/'),
};

export const productAPI = {
    getAllProducts: () => API.get('/products/'),
    getProduct: (id) => API.get(`/products/${id}/`),
    createProduct: (data) => API.post('/products/', data),
    updateProduct: (id, data) => API.put(`/products/${id}/`, data),
    deleteProduct: (id) => API.delete(`/products/${id}/`),
};

export const cartAPI = {
    getCart: () => API.get('/cart/'),
    addToCart: (productId, quantity) => API.post('/cart/add/', { product_id: productId, quantity }),
    updateCartItem: (itemId, quantity) => API.put(`/cart/items/${itemId}/`, { quantity }),
    removeFromCart: (itemId) => API.delete(`/cart/items/${itemId}/`),
};

export const orderAPI = {
    createOrder: (orderData) => API.post('/orders/', orderData),
    getOrders: () => API.get('/orders/'),
    getOrder: (id) => API.get(`/orders/${id}/`),
};

export default API; 