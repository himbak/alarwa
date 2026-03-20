const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const { authenticate } = require("../middleware/auth");

// Add a review
router.post("/", authenticate, async (req, res) => {
    try {
        const review = new Review({
            ...req.body,
            userId: req.user.id
        });
        await review.save();
        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get reviews for a product
router.get("/parfum/:parfumId", async (req, res) => {
    try {
        const reviews = await Review.find({ parfumId: req.params.parfumId }).populate("userId", "name");
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
