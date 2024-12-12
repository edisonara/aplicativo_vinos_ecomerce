const Product = require('../models/Product');

// Obtener todos los productos con filtros
exports.getProducts = async (req, res) => {
    try {
        const { 
            search,
            category,
            minPrice,
            maxPrice,
            sortBy,
            sortOrder = 'asc',
            page = 1,
            limit = 10
        } = req.query;

        // Construir el query
        const query = {};

        // Búsqueda por nombre o descripción
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Filtro por categoría
        if (category) {
            query.category = category;
        }

        // Filtro por rango de precio
        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined) query.price.$gte = Number(minPrice);
            if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
        }

        // Configurar ordenamiento
        let sort = {};
        if (sortBy) {
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        }

        // Calcular skip para paginación
        const skip = (page - 1) * limit;

        // Ejecutar query con filtros y ordenamiento
        const products = await Product.find(query)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        // Obtener total de productos para paginación
        const total = await Product.countDocuments(query);

        res.status(200).json({
            products,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener los productos',
            error: error.message 
        });
    }
};

// Obtener un producto por ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el producto',
            error: error.message
        });
    }
};

// Crear un nuevo producto
exports.createProduct = async (req, res) => {
    try {
        const { 
            name, 
            description, 
            price, 
            category, 
            stock, 
            brand, 
            alcoholContent, 
            image 
        } = req.body;
        
        // Validaciones
        if (!name || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, precio y categoría son requeridos'
            });
        }

        const product = new Product({
            name,
            description,
            price: Number(price),
            category,
            stock: Number(stock) || 0,
            brand,
            alcoholContent,
            image
        });

        const newProduct = await product.save();
        
        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear el producto',
            error: error.message
        });
    }
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
    try {
        const updates = req.body;
        const productId = req.params.id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        // Actualizar solo los campos proporcionados
        Object.keys(updates).forEach((update) => {
            if (update !== '_id') { // Evitar actualizar el _id
                product[update] = updates[update];
            }
        });

        const updatedProduct = await product.save();
        
        res.status(200).json({
            success: true,
            message: 'Producto actualizado exitosamente',
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el producto',
            error: error.message
        });
    }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Producto eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el producto',
            error: error.message
        });
    }
};

// Buscar productos por categoría
exports.getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category });
        
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar productos por categoría',
            error: error.message
        });
    }
};

// Agregar una reseña a un producto
exports.addProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        // Verificar si el usuario ya ha hecho una reseña
        const alreadyReviewed = product.reviews.find(
            (review) => review.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: 'Ya has hecho una reseña de este producto'
            });
        }

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        
        res.status(201).json({
            success: true,
            message: 'Reseña agregada exitosamente',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al agregar la reseña',
            error: error.message
        });
    }
};
