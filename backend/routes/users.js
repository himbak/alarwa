const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { authenticate, authorize } = require("../middleware/auth");

// Add user (Admin only)
router.post("/", authenticate, authorize(["admin"]), async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Cet email est déjà utilisé" });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        user = new User({ name, email, password: hashedPassword, role: role || "client" });
        await user.save();
        
        const userWithoutPassword = await User.findById(user._id).select("-password");
        res.status(201).json(userWithoutPassword);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all users (Admin only)
router.get("/", authenticate, authorize(["admin"]), async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete user (Admin only)
router.delete("/:id", authenticate, authorize(["admin"]), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Utilisateur supprimé" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user role (Admin only)
router.put("/:id/role", authenticate, authorize(["admin"]), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
