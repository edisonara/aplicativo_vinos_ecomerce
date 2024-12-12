const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generar Token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Registrar usuario
// @route   POST /api/users/register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validar campos requeridos
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Por favor complete todos los campos'
            });
        }

        // Validar longitud de contraseña
        if (password.length < 6) {
            return res.status(400).json({
                message: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        // Verificar si el email ya existe
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({
                message: 'El correo electrónico ya está registrado'
            });
        }

        // Crear usuario
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password
        });

        if (user) {
            const token = generateToken(user._id);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            });
        }
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(400).json({
            message: error.message || 'Error al registrar usuario'
        });
    }
};

// @desc    Login usuario
// @route   POST /api/users/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar campos requeridos
        if (!email || !password) {
            return res.status(400).json({
                message: 'Por favor complete todos los campos'
            });
        }

        // Buscar usuario por email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                message: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Credenciales inválidas'
            });
        }

        // Generar token y enviar respuesta
        const token = generateToken(user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(400).json({
            message: error.message || 'Error al iniciar sesión'
        });
    }
};

// @desc    Obtener perfil de usuario
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.product');
        
        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            cart: user.cart,
            shippingAddress: user.shippingAddress
        });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            message: error.message || 'Error al obtener perfil'
        });
    }
};

// @desc    Actualizar perfil de usuario
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        
        if (req.body.shippingAddress) {
            user.shippingAddress = req.body.shippingAddress;
        }

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            shippingAddress: updatedUser.shippingAddress,
            token: generateToken(updatedUser._id)
        });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({
            message: error.message || 'Error al actualizar perfil'
        });
    }
};

// @desc    Obtener carrito del usuario
// @route   GET /api/users/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.product');
        
        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            cart: user.cart
        });
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).json({
            message: error.message || 'Error al obtener carrito'
        });
    }
};

// @desc    Agregar producto al carrito
// @route   POST /api/users/cart
// @access  Private
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({
                message: 'Por favor proporcione producto y cantidad válida'
            });
        }

        const user = await User.findById(req.user._id);
        await user.addToCart(productId, quantity);
        
        const updatedUser = await User.findById(user._id).populate('cart.product');

        res.json({
            cart: updatedUser.cart
        });
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).json({
            message: error.message || 'Error al agregar al carrito'
        });
    }
};

// @desc    Remover producto del carrito
// @route   DELETE /api/users/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        await user.removeFromCart(req.params.productId);
        
        const updatedUser = await User.findById(user._id).populate('cart.product');

        res.json({
            cart: updatedUser.cart
        });
    } catch (error) {
        console.error('Error al remover del carrito:', error);
        res.status(500).json({
            message: error.message || 'Error al remover del carrito'
        });
    }
};

// @desc    Limpiar carrito
// @route   DELETE /api/users/cart
// @access  Private
const clearCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        await user.clearCart();

        res.json({
            message: 'Carrito limpiado exitosamente'
        });
    } catch (error) {
        console.error('Error al limpiar carrito:', error);
        res.status(500).json({
            message: error.message || 'Error al limpiar carrito'
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    getCart,
    addToCart,
    removeFromCart,
    clearCart
};
