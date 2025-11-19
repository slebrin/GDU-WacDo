const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true },
    status: { type: String, enum: ['en_attente', 'en_preparation', 'preparee', 'livree'], default: 'en_attente' },
    total: { type: Number, required: true },
    items: [{ 
        item: { type: String, required: true },
        type: { type: String, enum: ['product', 'menu'], required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);