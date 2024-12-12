const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        }
    }]
}, {
    timestamps: true
});

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Métodos del carrito
userSchema.methods.addToCart = function(productId, quantity = 1) {
    const cartItemIndex = this.cart.findIndex(item => 
        item.product.toString() === productId.toString()
    );

    if (cartItemIndex > -1) {
        this.cart[cartItemIndex].quantity += quantity;
    } else {
        this.cart.push({ product: productId, quantity });
    }

    return this.save();
};

userSchema.methods.removeFromCart = function(productId) {
    this.cart = this.cart.filter(item => 
        item.product.toString() !== productId.toString()
    );
    return this.save();
};

userSchema.methods.clearCart = function() {
    this.cart = [];
    return this.save();
};

module.exports = mongoose.model('User', userSchema);
