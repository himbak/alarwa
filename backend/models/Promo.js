const mongoose = require("mongoose");

const PromoSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Promo", PromoSchema);
