const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [50, 'El nombre no puede exceder los 50 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un email válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    role: {
        type: String,
        enum: {
            values: ['cliente', 'admin'],
            message: '{VALUE} no es un rol válido'
        },
        default: 'cliente'
    },
    phoneNumber: {
        type: String,
        match: [/^\+?[\d\s-]{10,}$/, 'Por favor ingrese un número de teléfono válido']
    },
    addresses: [{
        street: {
            type: String,
            required: [true, 'La calle es requerida']
        },
        city: {
            type: String,
            required: [true, 'La ciudad es requerida']
        },
        state: {
            type: String,
            required: [true, 'El estado/provincia es requerido']
        },
        zipCode: {
            type: String,
            required: [true, 'El código postal es requerido']
        },
        country: {
            type: String,
            required: [true, 'El país es requerido']
        },
        isDefault: {
            type: Boolean,
            default: false
        }
    }],
    purchaseHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Método para no devolver la contraseña
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', userSchema);
