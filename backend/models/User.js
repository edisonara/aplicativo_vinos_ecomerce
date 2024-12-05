const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['cliente', 'admin'],
        default: 'cliente'
    },
    phoneNumber: {
        type: String
    },
    addresses: [{
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        isDefault: Boolean
    }],
    purchaseHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
