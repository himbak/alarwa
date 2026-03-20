const mongoose = require("mongoose");
const path = require("path");

const Parfum = require("./models/Parfum");

async function migrateNotes() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/parfumDB");
        console.log("Connected to DB");

        const parfums = await Parfum.find();
        console.log(`Checking ${parfums.length} parfums for migration...`);
        
        let migratedCount = 0;
        for (const p of parfums) {
            let needsSave = false;
            
            // Check topNotes
            if (p.topNotes && p.topNotes.length > 0 && typeof p.topNotes[0] !== 'object') {
                p.topNotes = p.topNotes.map(n => ({ name: String(n), image: "" }));
                needsSave = true;
            }
            // Check heartNotes
            if (p.heartNotes && p.heartNotes.length > 0 && typeof p.heartNotes[0] !== 'object') {
                p.heartNotes = p.heartNotes.map(n => ({ name: String(n), image: "" }));
                needsSave = true;
            }
            // Check baseNotes
            if (p.baseNotes && p.baseNotes.length > 0 && typeof p.baseNotes[0] !== 'object') {
                p.baseNotes = p.baseNotes.map(n => ({ name: String(n), image: "" }));
                needsSave = true;
            }

            if (needsSave) {
                await p.save();
                migratedCount++;
                console.log(`Migrated: ${p.name}`);
            }
        }

        console.log(`Migration complete. ${migratedCount} products updated.`);
    } catch (error) {
        console.error("Error during migration:", error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

migrateNotes();
