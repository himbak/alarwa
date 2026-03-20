const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendVerificationEmail = require("../utils/sendEmail");

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Cet email est déjà utilisé" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            verificationToken,
            isVerified: true // Auto-verify in development for ease of use
        });

        await user.save();
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({ message: "Compte créé ! Veuillez vérifier votre email." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// VERIFY EMAIL
router.get("/verify/:token", async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });
        if (!user) return res.status(400).json({ message: "Lien de vérification invalide ou expiré." });

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.json({ message: "Email vérifié avec succès. Vous pouvez vous connecter." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.isVerified) return res.status(403).json({ message: "Veuillez vérifier votre email avant de vous connecter." });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id, role: user.role }, "SECRET_KEY");

    res.json({ token, role: user.role });
});

module.exports = router;
