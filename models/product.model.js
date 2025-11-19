const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true },
    image: { type: String },
    category: { type: String, enum: ['burger', 'salade', 'boisson', 'dessert', 'option'], default: 'burger' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);