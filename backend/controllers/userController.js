const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Validar datos de usuario
const validateUserData = (data) => {
    const errors = [];
    
    // Validar nombre
    if (!data.name || data.name.length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }

    // Validar email
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Email inválido');
    }

    // Validar contraseña
    if (!data.password || data.password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    // Validar teléfono si está presente
    if (data.phoneNumber) {
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(data.phoneNumber)) {
            errors.push('Número de teléfono inválido');
        }
    }

    // Validar rol si está presente
    if (data.role && !['cliente', 'admin'].includes(data.role)) {
        errors.push('Rol inválido. Debe ser "cliente" o "admin"');
    }

    return errors;
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, addresses, role } = req.body;

        // Validar datos
        const validationErrors = validateUserData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                message: 'Error de validación', 
                errors: validationErrors 
            });
        }

        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear el usuario
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            addresses,
            role: role || 'cliente' // Si no se especifica rol, será 'cliente'
        });

        const savedUser = await user.save();
        res.status(201).json(savedUser);

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Error de validación', 
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ 
            message: 'Error al crear el usuario', 
            error: error.message 
        });
    }
};

// Obtener todos los usuarios
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ active: true });
        res.json(users);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener usuarios', 
            error: error.message 
        });
    }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, active: true });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID de usuario inválido' });
        }
        res.status(500).json({ 
            message: 'Error al obtener el usuario', 
            error: error.message 
        });
    }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
    try {
        const { name, email, phoneNumber, addresses, role } = req.body;

        // Validar datos si están presentes
        const validationErrors = validateUserData({
            name: name || '',
            email: email || '',
            password: 'dummypassword', // Para pasar la validación si no se actualiza la contraseña
            phoneNumber,
            role
        });

        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                message: 'Error de validación', 
                errors: validationErrors 
            });
        }

        const user = await User.findOne({ _id: req.params.id, active: true });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si el nuevo email ya existe
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'El email ya está en uso' });
            }
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.addresses = addresses || user.addresses;
        if (role) user.role = role;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Error de validación', 
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID de usuario inválido' });
        }
        res.status(500).json({ 
            message: 'Error al actualizar el usuario', 
            error: error.message 
        });
    }
};

// Cambiar rol de usuario
exports.changeUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        
        if (!role || !['cliente', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Rol inválido. Debe ser "cliente" o "admin"' });
        }

        const user = await User.findOne({ _id: req.params.id, active: true });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.role = role;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID de usuario inválido' });
        }
        res.status(500).json({ 
            message: 'Error al cambiar el rol del usuario', 
            error: error.message 
        });
    }
};

// Eliminar usuario (soft delete)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.active = false;
        await user.save();
        
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID de usuario inválido' });
        }
        res.status(500).json({ 
            message: 'Error al eliminar el usuario', 
            error: error.message 
        });
    }
};
