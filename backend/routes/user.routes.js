const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getProfile,
    updateProfile,
    getCart,
    addToCart,
    removeFromCart,
    clearCart
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas
router.use(protect); // Aplicar middleware de autenticación a todas las rutas siguientes

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Rutas del carrito
router.get('/cart', getCart);
router.post('/cart', addToCart);
router.delete('/cart/:productId', removeFromCart);
router.delete('/cart', clearCart);

module.exports = router;
