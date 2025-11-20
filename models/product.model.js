const mongoose = require('mongoose');
const { PRODUCT_CATEGORIES } = require('../config/constants');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true },
    image: { type: String },
    category: { type: String, enum: PRODUCT_CATEGORIES, default: 'burger' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);