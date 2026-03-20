const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
        {
            parfumId: { type: mongoose.Schema.Types.ObjectId, ref: "Parfum", required: true },
            sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            quantity: { type: Number, required: true },
            priceAtPurchase: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        fullName: String,
        address: String,
        city: String,
        postalCode: String,
        country: String
    },
    status: {
        type: String,
        enum: ["En attente", "Payée", "Expédiée", "Livrée", "Annulée"],
        default: "En attente"
    },
    paymentMethod: { type: String, default: "Carte Bancaire" }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
