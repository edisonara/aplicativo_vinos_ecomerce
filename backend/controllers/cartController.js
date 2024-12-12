const Product = require('../models/Product');
const User = require('../models/User');

// Obtener el carrito del usuario
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const cart = user.getCart();

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el carrito',
      error: error.message
    });
  }
};

// Agregar producto al carrito
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos'
      });
    }

    // Verificar que el producto existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Verificar stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Stock insuficiente'
      });
    }

    const user = await User.findById(req.user.id);
    await user.addToCart(product, quantity);

    res.json({
      success: true,
      data: user.getCart()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al agregar producto al carrito',
      error: error.message
    });
  }
};

// Actualizar cantidad de un producto en el carrito
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'La cantidad debe ser mayor a 0'
      });
    }

    const user = await User.findById(req.user.id);
    await user.updateCartItem(itemId, quantity);

    res.json({
      success: true,
      data: user.getCart()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar producto en el carrito',
      error: error.message
    });
  }
};

// Eliminar producto del carrito
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user.id);
    await user.removeFromCart(itemId);

    res.json({
      success: true,
      data: user.getCart()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto del carrito',
      error: error.message
    });
  }
};

// Limpiar carrito
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    await user.clearCart();

    res.json({
      success: true,
      message: 'Carrito limpiado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al limpiar el carrito',
      error: error.message
    });
  }
};
