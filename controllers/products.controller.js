const { default: mongoose } = require('mongoose');
const Product = require('../models/product.model');

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des produits', error });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category }).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des produits par catégorie', error });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'ID de produit invalide' });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du produit', error });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, available, category, imageUrl } = req.body;
        const image = req.file ? req.file.path : imageUrl || null;
        const newProduct = new Product({ name, description, price, available, image, category });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du produit', error });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, available, category, imageUrl } = req.body;
        const image = req.file ? req.file.path : imageUrl || null;
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (available !== undefined) product.available = available;
        if (category) product.category = category;
        if (image) product.image = image;
        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du produit', error });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        await product.deleteOne();
        res.status(200).json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du produit', error });
    }
};