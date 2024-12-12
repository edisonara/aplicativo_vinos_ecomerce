const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Crear una nueva orden
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ 
                message: 'La orden debe contener al menos un producto' 
            });
        }

        // Calcular el total y verificar stock
        let totalAmount = 0;
        const orderItems = [];

        for (let item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ 
                    message: `Producto ${item.product} no encontrado` 
                });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Stock insuficiente para el producto ${product.name}` 
                });
            }

            orderItems.push({
                product: item.product,
                quantity: item.quantity,
                price: product.price
            });

            totalAmount += product.price * item.quantity;
            
            // Actualizar stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Crear la orden
        const order = new Order({
            user: req.user._id, // Usuario autenticado
            items: orderItems,
            shippingAddress,
            totalAmount,
            status: 'pendiente',
            paymentStatus: 'pendiente'
        });

        const newOrder = await order.save();

        // Limpiar el carrito del usuario después de crear la orden
        const user = await User.findById(req.user._id);
        user.cart = [];
        await user.save();

        // Poblar la información necesaria
        await newOrder.populate([
            { path: 'user', select: 'name email' },
            { path: 'items.product', select: 'name price imageUrl' }
        ]);

        res.status(201).json({
            success: true,
            order: newOrder
        });
    } catch (error) {
        console.error('Error al crear orden:', error);
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

// @desc    Obtener todas las órdenes del usuario autenticado
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('user', 'name email')
            .populate('items.product', 'name price imageUrl')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// @desc    Obtener una orden específica
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate('user', 'name email')
          .populate('items.product', 'name price imageUrl');

        if (!order) {
            return res.status(404).json({ 
                success: false,
                message: 'Orden no encontrada' 
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// @desc    Actualizar estado de la orden
// @route   PUT /api/orders/:id
// @access  Private (Admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ 
                success: false,
                message: 'Orden no encontrada' 
            });
        }

        // Verificar si el usuario es admin o es su propia orden
        if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                success: false,
                message: 'No tiene permiso para actualizar esta orden' 
            });
        }

        order.status = req.body.status;
        if (req.body.paymentStatus) {
            order.paymentStatus = req.body.paymentStatus;
        }

        const updatedOrder = await order.save();
        await updatedOrder.populate([
            { path: 'user', select: 'name email' },
            { path: 'items.product', select: 'name price imageUrl' }
        ]);

        res.status(200).json({
            success: true,
            order: updatedOrder
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

// @desc    Cancelar una orden
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({ 
                success: false,
                message: 'Orden no encontrada' 
            });
        }

        if (order.status === 'entregado') {
            return res.status(400).json({ 
                success: false,
                message: 'No se puede cancelar una orden ya entregada' 
            });
        }

        if (order.status === 'cancelado') {
            return res.status(400).json({ 
                success: false,
                message: 'Esta orden ya está cancelada' 
            });
        }

        // Restaurar el stock de los productos
        for (let item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        order.status = 'cancelado';
        const canceledOrder = await order.save();
        
        await canceledOrder.populate([
            { path: 'user', select: 'name email' },
            { path: 'items.product', select: 'name price imageUrl' }
        ]);

        res.status(200).json({
            success: true,
            message: 'Orden cancelada exitosamente',
            order: canceledOrder
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};
