const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Configuration pour les proxies (nécessaire sur Vercel)
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

app.use(express.json()); // Middleware to parse JSON bodies
const staticDir = process.env.NODE_ENV === 'production' ? '/tmp' : 'uploads/'; // Servir les fichiers statiques depuis le bon dossier selon l'environnement (Vercel)
app.use('/uploads', express.static(staticDir));

connectDB();

app.use('/api/products', require('./routes/products.routes'));

if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'production') {
    // Démarrage local seulement
    app.listen(process.env.PORT, () => {
        console.log('Server is running on http://localhost:' + process.env.PORT);
    })
}

module.exports = app;