const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Utilidad para generar token JWT
const generateToken = (userId) => {
    return jwt.sign(
        { user: { id: userId } },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Utilidad para manejar errores
const handleError = (res, error) => {
    console.error('Error:', error);
    return res.status(500).json({
        success: false,
        message: 'Error del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
};

const userController = {
    // Registro de usuario
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            // Validar campos requeridos
            if (!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son requeridos'
                });
            }

            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'El usuario ya existe'
                });
            }

            // Crear nuevo usuario
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = new User({
                name,
                email,
                password: hashedPassword
            });

            await user.save();

            // Generar token
            const token = generateToken(user._id);

            res.status(201).json({
                success: true,
                data: {
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                }
            });
        } catch (error) {
            handleError(res, error);
        }
    },

    // Login de usuario
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Validar campos
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email y contraseña son requeridos'
                });
            }

            // Buscar usuario
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            // Verificar contraseña
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            // Generar token
            const token = generateToken(user._id);

            res.json({
                success: true,
                data: {
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                }
            });
        } catch (error) {
            handleError(res, error);
        }
    },

    // Obtener perfil de usuario
    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            handleError(res, error);
        }
    },

    // Actualizar perfil de usuario
    updateProfile: async (req, res) => {
        try {
            const { name, email, currentPassword, newPassword } = req.body;
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            // Actualizar campos básicos
            if (name) user.name = name;
            if (email) user.email = email;

            // Si se proporciona contraseña actual y nueva, actualizar contraseña
            if (currentPassword && newPassword) {
                const isMatch = await bcrypt.compare(currentPassword, user.password);
                if (!isMatch) {
                    return res.status(400).json({
                        success: false,
                        message: 'Contraseña actual incorrecta'
                    });
                }

                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(newPassword, salt);
            }

            await user.save();

            res.json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                }
            });
        } catch (error) {
            handleError(res, error);
        }
    },

    // Solo para administradores: Obtener todos los usuarios
    getAllUsers: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Acceso denegado'
                });
            }

            const users = await User.find().select('-password');
            res.json({
                success: true,
                data: users
            });
        } catch (error) {
            handleError(res, error);
        }
    }
};

module.exports = userController;
