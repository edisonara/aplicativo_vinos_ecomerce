const Order = require('../models/Order');
const Product = require('../models/Product');

// Crear una nueva orden
exports.createOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        
        // Verificar y actualizar el stock de productos
        for (let item of order.items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Producto ${item.product} no encontrado` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Stock insuficiente para el producto ${product.name}`
                });
            }
            product.stock -= item.quantity;
            await product.save();
        }

        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener todas las órdenes
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product', 'name price');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una orden por ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product', 'name price');
        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar el estado de una orden
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        order.status = req.body.status;
        if (req.body.paymentStatus) {
            order.paymentStatus = req.body.paymentStatus;
        }

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener órdenes por usuario
exports.getOrdersByUser = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId })
            .populate('items.product', 'name price');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancelar una orden
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        if (order.status === 'entregado') {
            return res.status(400).json({ 
                message: 'No se puede cancelar una orden ya entregada' 
            });
        }

        // Restaurar el stock de productos
        for (let item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        order.status = 'cancelado';
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
