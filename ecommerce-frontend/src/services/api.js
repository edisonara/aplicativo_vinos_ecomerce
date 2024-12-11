import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para manejar tokens y errores
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data
    });
    return config;
}, (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
});

API.interceptors.response.use((response) => {
    console.log('Response:', {
        status: response.status,
        data: response.data
    });
    return response;
}, (error) => {
    console.error('Response Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
    });
    return Promise.reject(error);
});

export const authAPI = {
    login: (credentials) => API.post('/auth/login/', credentials),
    register: (userData) => API.post('/auth/register/', userData),
    logout: () => API.post('/auth/logout/'),
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
    clearCart: () => API.delete('/cart/clear/'),
};

export const orderAPI = {
    createOrder: (orderData) => API.post('/orders/', orderData),
    getOrders: () => API.get('/orders/'),
    getOrder: (id) => API.get(`/orders/${id}/`),
};

export default API; 