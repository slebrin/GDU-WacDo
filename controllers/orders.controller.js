const Order = require('../models/order.model');
const { calculateOrderTotal } = require('../utils/helpers');

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('items.item').sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes', error });
    }
};

exports.getOrdersByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const orders = await Order.find({ status }).populate('items.item').sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes par statut', error });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const orderNumber = req.params.orderNumber;
        const order = await Order.findOne({ orderNumber }).populate('items.item').sort({ createdAt: -1 });
        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la commande', error });
    }
};

exports.createOrder = async (req, res) => {
    try {
        // aujourd'hui à minuit
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // demain à minuit
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        // trouver la dernière commande du jour
        const lastOrderToday = await Order.findOne({ createdAt: { $gte: today, $lt: tomorrow } }).sort({ createdAt: -1 });
        // générer un numéro de commande unique journalier
        let orderNumber = '001';
        if (lastOrderToday && lastOrderToday.orderNumber) {
            const lastNumber = parseInt(lastOrderToday.orderNumber);
            orderNumber = String(lastNumber + 1).padStart(3, '0');
        }
        const { status, items, total } = req.body;
        const finalTotal = (total == null) ? calculateOrderTotal(items) : total;
        const newOrder = new Order({ orderNumber, status: status || 'en_attente', total: finalTotal, items });
        const savedOrder = await newOrder.save();
        await savedOrder.populate('items.item');
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la commande', error });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }
        order.status = req.body.status;
        const updatedOrder = await order.save();
        await updatedOrder.populate('items.item');
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut de la commande', error });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }
        await order.deleteOne();
        res.status(200).json({ message: 'Commande supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la commande', error });
    }
};
