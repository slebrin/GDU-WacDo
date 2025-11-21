const mongoose = require('mongoose');
const { ORDER_STATUSES, ITEMS_MODELS } = require('../config/constants');

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true },
    status: { type: String, enum: ORDER_STATUSES, default: 'en_attente' },
    total: { type: Number, required: true },
    items: [{ 
        item: { type: mongoose.Schema.Types.ObjectId, refPath: 'items.itemModel', required: true },
        itemModel: { type: String, enum: ITEMS_MODELS, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);