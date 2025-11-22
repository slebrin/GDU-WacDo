const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Accès refusé. Token manquant.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Token invalide.' });
    }
}

exports.authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentification requise.' });
        }
        if (!req.user.role) {
            return res.status(403).json({ error: 'Rôle non défini.' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'Accès refusé. Permissions insuffisantes.',
                requiredRoles: allowedRoles,
                userRole: req.user.role
            });
        }
        next();
    };
};