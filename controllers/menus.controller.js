const { default: mongoose } = require('mongoose');
const Menu = require('../models/menu.model');

exports.getMenus = async (req, res) => {
    try {
        const menus = await Menu.find().populate('products').sort({ createdAt: -1 });
        res.status(200).json(menus);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des menus', error });
    }
};

exports.getMenu = async (req, res) => {
    try {
        const menuId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(menuId)) {
            return res.status(400).json({ message: 'ID de menu invalide' });
        }
        const menu = await Menu.findById(menuId).populate('products');
        if (!menu) {
            return res.status(404).json({ message: 'Menu non trouvé' });
        }
        res.status(200).json(menu);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du menu', error });
    }
};

exports.createMenu = async (req, res) => {
    try {
        const { name, description, products, price, available } = req.body;
        const newMenu = new Menu({ name, description, products, price, available });
        const savedMenu = await newMenu.save();
        await savedMenu.populate('products');
        res.status(201).json(savedMenu);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du menu', error });
    }
};

exports.updateMenu = async (req, res) => {
    try {
        const { name, description, products, price, available } = req.body;
        const menu = await Menu.findById(req.params.id);
        if (!menu) {
            return res.status(404).json({ message: 'Menu non trouvé' });
        }
        if (name) menu.name = name;
        if (description) menu.description = description;
        if (products) menu.products = products;
        if (price) menu.price = price;
        if (available !== undefined) menu.available = available;
        const updatedMenu = await menu.save();
        await updatedMenu.populate('products');
        res.status(200).json(updatedMenu);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du menu', error });
    }
};

exports.updateMenuProducts = async (req, res) => {
    try {
        const { products } = req.body;
        const menu = await Menu.findById(req.params.id);
        if (!menu) {
            return res.status(404).json({ message: 'Menu non trouvé' });
        }
        if (products) menu.products = products;
        const updatedMenu = await menu.save();
        await updatedMenu.populate('products');
        res.status(200).json(updatedMenu);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour des produits du menu', error });
    }
};

exports.deleteMenu = async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id);
        if (!menu) {
            return res.status(404).json({ message: 'Menu non trouvé' });
        }
        await menu.deleteOne();
        res.status(200).json({ message: 'Menu supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du menu', error });
    }
};