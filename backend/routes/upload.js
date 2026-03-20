const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Route pour uploader une image
router.post("/", upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Aucun fichier envoyé" });
        }
        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        res.json({ imageUrl });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
