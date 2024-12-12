const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { auth, isAdmin } = require('../middleware/auth');

// Middleware de validación
const validateRegistration = (req, res, next) => {
    const { name, email, password } = req.body;
    
    // Validar campos requeridos
    if (!name || !email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Todos los campos son requeridos' 
        });
    }

    // Validar formato de email
    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email inválido' 
        });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
        return res.status(400).json({ 
            success: false, 
            message: 'La contraseña debe tener al menos 6 caracteres' 
        });
    }

    next();
};

// Rutas públicas
router.post('/register', validateRegistration, userController.register);
router.post('/login', userController.login);

// Rutas protegidas
router.get('/me', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

// Rutas de administrador
router.get('/users', auth, isAdmin, userController.getAllUsers);

module.exports = router;
