const mongoose = require('mongoose');
const path = require('path');
const Parfum = require('./models/Parfum');

mongoose.connect('mongodb://127.0.0.1:27017/parfumDB')
    .then(async () => {
        console.log("Connecté à MongoDB pour migration finale...");
        const parfums = await Parfum.find();
        let count = 0;

        for (const p of parfums) {
            let changed = false;

            const migrate = (notes) => {
                if (!notes || !Array.isArray(notes)) return [];
                return notes.map(n => {
                    if (typeof n === 'string') {
                        changed = true;
                        return { name: n, image: "" };
                    }
                    if (n && typeof n === 'object' && !n.name && n.toString() !== "[object Object]") {
                        // Handle potential casting issues
                        changed = true;
                        return { name: String(n), image: "" };
                    }
                    return n;
                });
            };

            const top = migrate(p.topNotes);
            const heart = migrate(p.heartNotes);
            const base = migrate(p.baseNotes);

            if (changed) {
                p.topNotes = top;
                p.heartNotes = heart;
                p.baseNotes = base;
                await p.save();
                count++;
            }
        }

        console.log(`${count} produits mis à jour avec la nouvelle structure.`);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
