const mongoose = require("mongoose");

const parfumSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    images: [{ type: String }], // Optional gallery
    stock: { type: Number, default: 10 },
    category: { type: String, enum: ["Homme", "Femme", "Mixte"], default: "Mixte" },
    notes: [{ type: String }], // Generic/Legacy notes
    topNotes: [{ name: { type: String }, image: { type: String } }], // Notes de tête
    heartNotes: [{ name: { type: String }, image: { type: String } }], // Notes de cœur
    baseNotes: [{ name: { type: String }, image: { type: String } }], // Notes de fond
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Parfum", parfumSchema);
