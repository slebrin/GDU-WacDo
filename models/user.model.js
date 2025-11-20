const mongoose = require('mongoose');
const { USER_ROLES } = require('../config/constants');

const operatorSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: USER_ROLES, default: 'accueil' }
}, { timestamps: true });

module.exports = mongoose.model('Operator', operatorSchema);