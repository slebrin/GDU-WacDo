const mongoose = require('mongoose');

const operatorSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'preparateur', 'accueil'], default: 'accueil' }
}, { timestamps: true });

module.exports = mongoose.model('Operator', operatorSchema);