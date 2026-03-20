const express = require("express");
const router = express.Router();
const Promo = require("../models/Promo");
const { authenticate, authorize } = require("../middleware/auth");

// Client: Apply promo
router.post("/apply", async (req, res) => {
  const { code } = req.body;
  try {
    const promo = await Promo.findOne({ code, isActive: true });
    if (!promo) return res.status(404).json({ message: "Code promo invalide ou inactif." });
    if (new Date(promo.expiryDate) < new Date()) {
       promo.isActive = false;
       await promo.save();
       return res.status(400).json({ message: "Ce code promo a expiré." });
    }
    res.json(promo);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Admin: Create promo
router.post("/", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const promo = new Promo(req.body);
    await promo.save();
    res.status(201).json(promo);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la création du code promo. Vérifiez qu'il n'existe pas déjà." });
  }
});

// Admin: Get all promos
router.get("/", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const promos = await Promo.find().sort({ createdAt: -1 });
    res.json(promos);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Admin: Delete promo
router.delete("/:id", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    await Promo.findByIdAndDelete(req.params.id);
    res.json({ message: "Code promo supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
