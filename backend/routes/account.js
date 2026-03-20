const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");
const { authenticate } = require("../middleware/auth");

// @route   GET /api/account/profile
// @desc    Get current user profile
router.get("/profile", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password").populate("wishlist");
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   PUT /api/account/profile
// @desc    Update user profile
router.put("/profile", authenticate, async (req, res) => {
    const { name, email, phone, marketingPrefs, scentProfile, twoFactorEnabled } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (marketingPrefs) user.marketingPrefs = marketingPrefs;
        if (scentProfile) user.scentProfile = scentProfile;
        if (twoFactorEnabled !== undefined) user.twoFactorEnabled = twoFactorEnabled;

        await user.save();
        res.json({ message: "Profil mis à jour avec succès", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/account/orders
// @desc    Get user order history
router.get("/orders", authenticate, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 }).populate("products.parfumId");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/account/addresses
// @desc    Add a new address
router.post("/addresses", authenticate, async (req, res) => {
    const { type, street, city, zip, country, instructions, isDefault } = req.body;
    try {
        const user = await User.findById(req.user.id);
        
        // If it's default, unset other defaults of the same type
        if (isDefault) {
            user.addresses.forEach(addr => {
                if (addr.type === type) addr.isDefault = false;
            });
        }

        user.addresses.push({ type, street, city, zip, country, instructions, isDefault });
        await user.save();
        res.json(user.addresses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   DELETE /api/account/addresses/:id
// @desc    Delete an address
router.delete("/addresses/:id", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
        await user.save();
        res.json(user.addresses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/account/wishlist/:pid
// @desc    Add product to wishlist
router.post("/wishlist/:pid", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.wishlist.includes(req.params.pid)) {
            user.wishlist.push(req.params.pid);
            await user.save();
        }
        res.json(user.wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   DELETE /api/account/wishlist/:pid
// @desc    Remove product from wishlist
router.delete("/wishlist/:pid", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.pid);
        await user.save();
        res.json(user.wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   PUT /api/account/password
// @desc    Update user password
router.put("/password", authenticate, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id);
        // Assuming user.password is hashed, in a real app check password
        // For this demo/simplified environment:
        if (currentPassword !== user.password) {
            return res.status(400).json({ message: "Ancien mot de passe incorrect" });
        }
        user.password = newPassword;
        await user.save();
        res.json({ message: "Mot de passe mis à jour" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
