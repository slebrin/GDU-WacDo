const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Utiliser le dossier temporaire sur Vercel, uploads/ en local
const uploadDir = process.env.NODE_ENV === 'production' ? '/tmp' : 'uploads/';

// Créer le dossier uploads s'il n'existe pas (seulement en local)
if (process.env.NODE_ENV !== 'production' && !fs.existsSync('uploads/')) {
    fs.mkdirSync('uploads/');
}

const upload = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error('Type de fichier non autorisé'), false);
    }
};
    
const uploadMiddleware = multer({ storage: upload, fileFilter: fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // Limite à 5MB

module.exports = uploadMiddleware;