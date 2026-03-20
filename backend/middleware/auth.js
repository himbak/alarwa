const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    // Expected header: "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");
        req.user = decoded; // Stocke { id, role } dans req.user
        next();
    } catch (err) {
        res.status(403).json({ message: "Token invalide ou expiré." });
    }
};

const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Permissions insuffisantes." });
        }
        next();
    };
};

module.exports = { authenticate, authorize };
