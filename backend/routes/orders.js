const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { authenticate, authorize } = require("../middleware/auth");

// Create order (Client)
router.post("/", authenticate, async (req, res) => {
    try {
        const order = new Order({
            ...req.body,
            userId: req.user.id
        });
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user orders (Client)
router.get("/my-orders", authenticate, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).populate('products.parfumId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get seller orders (Vendeur)
router.get("/seller-orders", authenticate, authorize(["vendeur"]), async (req, res) => {
    try {
        // Recherche des commandes qui contiennent au moins un produit appartenant à ce vendeur
        const orders = await Order.find({ "products.sellerId": req.user.id })
            .populate('userId', 'name email')
            .populate('products.parfumId');
        
        // Filtrer les produits pour ne garder que ceux de ce vendeur dans l'affichage
        const filteredOrders = orders.map(order => {
            const orderObj = order.toObject();
            orderObj.products = orderObj.products.filter(p => p.sellerId.toString() === req.user.id);
            return orderObj;
        });

        res.json(filteredOrders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all orders (Admin)
router.get("/", authenticate, authorize(["admin"]), async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name email').populate('products.parfumId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update order status (Admin/Vendeur)
router.put("/:id/status", authenticate, authorize(["admin", "vendeur"]), async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
