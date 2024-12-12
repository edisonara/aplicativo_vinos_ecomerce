import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// API de usuarios y autenticación
export const authAPI = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
  logout: () => api.post('/users/logout'),
  getProfile: () => api.get('/users/me'),
  updateProfile: (userData) => api.put('/users/me', userData),
};

// API de productos
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  search: (query) => api.get(`/products/search`, { params: { query } }),
};

// API del carrito usando órdenes
export const cartAPI = {
  // Obtener items del carrito (órdenes con status 'cart')
  getCart: () => api.get('/orders?status=cart'),
  
  // Agregar al carrito (crear una nueva orden con status 'cart')
  addToCart: (productId, quantity, price) => api.post('/orders', {
    items: [{
      product: productId,
      quantity,
      price
    }],
    status: 'cart',
    totalAmount: price * quantity
  }),
  
  // Actualizar item del carrito
  updateCartItem: (orderId, itemId, quantity, price) => api.put(`/orders/${orderId}`, {
    items: [{
      _id: itemId,
      quantity
    }],
    totalAmount: price * quantity
  }),
  
  // Eliminar item del carrito
  removeFromCart: (orderId) => api.delete(`/orders/${orderId}`),
  
  // Limpiar carrito (eliminar todas las órdenes con status 'cart')
  clearCart: () => api.delete('/orders?status=cart'),
  
  // Convertir item del carrito a orden de compra
  checkout: (orderId, shippingAddress, paymentMethod) => api.put(`/orders/${orderId}`, {
    status: 'pending',
    shippingAddress,
    paymentMethod
  })
};

// API de órdenes
export const orderAPI = {
  // Crear nueva orden
  create: (orderData) => api.post('/orders', {
    ...orderData,
    status: 'pending' // Asegurar que la orden se crea como pendiente
  }),
  
  // Obtener todas las órdenes (excluyendo items del carrito)
  getAll: () => api.get('/orders?status=!cart'),
  
  // Obtener orden por ID
  getById: (id) => api.get(`/orders/${id}`),
  
  // Actualizar estado de la orden
  updateStatus: (id, status) => api.put(`/orders/${id}`, { status }),
  
  // Cancelar orden
  cancel: (id) => api.put(`/orders/${id}`, { status: 'cancelled' }),
  
  // Confirmar pago de la orden
  confirmPayment: (id) => api.put(`/orders/${id}`, { status: 'paid' }),
  
  // Actualizar dirección de envío
  updateShipping: (id, shippingAddress) => api.put(`/orders/${id}`, { shippingAddress })
};

export default api;