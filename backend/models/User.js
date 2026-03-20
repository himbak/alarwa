const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    role: {
        type: String,
        enum: ["client", "vendeur", "admin"],
        default: "client"
    },
    addresses: [
        {
            type: { type: String, enum: ["livraison", "facturation"], default: "livraison" },
            street: String,
            city: String,
            zip: String,
            country: String,
            instructions: String,
            isDefault: { type: Boolean, default: false }
        }
    ],
    scentProfile: [String],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Parfum" }],
    marketingPrefs: {
        newsletter: { type: Boolean, default: true },
        stockAlerts: { type: Boolean, default: true }
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: String
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
