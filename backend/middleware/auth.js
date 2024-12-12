const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Proteger rutas
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Verificar si hay token en el header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Verificar si existe el token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado para acceder a esta ruta'
            });
        }

        try {
            // Verificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Obtener usuario
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Token no válido'
                });
            }

            // Verificar si el usuario está activo
            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario inactivo'
                });
            }

            // Agregar usuario a la request
            req.user = user;
            next();
        } catch (error) {
            console.error('Error al verificar token:', error);
            return res.status(401).json({
                success: false,
                message: 'Token no válido o expirado'
            });
        }
    } catch (error) {
        console.error('Error en middleware de autenticación:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

// Autorizar roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para acceder a esta ruta'
            });
        }
        next();
    };
};
