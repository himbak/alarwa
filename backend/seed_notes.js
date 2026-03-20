const mongoose = require("mongoose");
const path = require("path");

// Use relative path since we run it from backend/
const Parfum = require("./models/Parfum");

async function seedNotes() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/parfumDB");
        console.log("Connected to DB");

        const parfums = await Parfum.find();
        console.log(`Found ${parfums.length} parfums`);
        
        for (const p of parfums) {
            // Seed if structured notes are missing
            if (!p.topNotes || p.topNotes.length === 0) {
                p.topNotes = ["Citron", "Bergamote", "Lavande"];
                p.heartNotes = ["Rose", "Jasmin", "Géranium"];
                p.baseNotes = ["Santal", "Vanille", "Musc Blanc"];
                await p.save();
                console.log(`Updated notes for ${p.name}`);
            }
        }

        console.log("Seeding complete");
    } catch (error) {
        console.error("Error during seeding:", error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

seedNotes();
