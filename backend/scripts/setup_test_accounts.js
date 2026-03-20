const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/parfumDB";

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["client", "vendeur", "admin"], default: "client" },
    isVerified: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

const testAccounts = [
    { name: 'Test Client', email: 'client@test.com', password: 'password123', role: 'client' },
    { name: 'Test Vendeur', email: 'vendeur@test.com', password: 'password123', role: 'vendeur' },
    { name: 'Test Admin', email: 'admin@test.com', password: 'password123', role: 'admin' }
];

async function setup() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected.");

        for (const account of testAccounts) {
            const existing = await User.findOne({ email: account.email });
            if (!existing) {
                const hashedPassword = await bcrypt.hash(account.password, 10);
                const newUser = new User({
                    ...account,
                    password: hashedPassword,
                    isVerified: true
                });
                await newUser.save();
                console.log(`Created ${account.role} account: ${account.email}`);
            } else {
                existing.isVerified = true;
                existing.role = account.role; // Ensure role is correct
                await existing.save();
                console.log(`${account.role} account already exists: ${account.email} (Verified)`);
            }
        }

        console.log("Setup complete.");
    } catch (err) {
        console.error("Error setting up accounts:", err);
    } finally {
        await mongoose.disconnect();
    }
}

setup();
