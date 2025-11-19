const express = require('express');
const connectDB = require('./config/db');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Configuration pour les proxies (nécessaire sur Vercel)
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Configuration Helmet avec CSP personnalisée pour Swagger UI
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://unpkg.com",
                "https://cdnjs.cloudflare.com"
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://unpkg.com",
                "https://cdnjs.cloudflare.com"
            ],
            fontSrc: [
                "'self'",
                "https://unpkg.com",
                "https://cdnjs.cloudflare.com"
            ],
            imgSrc: [
                "'self'",
                "data:",
                "https:"
            ]
        }
    }
}));
app.use(cors()); // Active CORS pour toutes les routes
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limite chaque IP à 100 requêtes par fenêtre
}));
app.use(express.json()); // Pour parser le JSON dans les requêtes
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