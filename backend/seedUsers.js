const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/parfumDB")
.then(async () => {
    console.log("MongoDB connecté pour le script de seed utilisateurs");

    // Optionnel : vider la collection des utilisateurs pour éviter les doublons avec le même email
    await User.deleteMany({}); 

    // Mot de passe commun "admin123" pour simplifier les tests
    const passwordHash = await bcrypt.hash("admin123", 10);

    const testUsers = [
        {
            name: "Administrateur Principal",
            email: "admin@parfum.com",
            password: passwordHash,
            role: "admin"
        },
        {
            name: "Vendeur Magasin",
            email: "vendeur@parfum.com",
            password: passwordHash,
            role: "vendeur"
        },
        {
            name: "Client Standard",
            email: "client@parfum.com",
            password: passwordHash,
            role: "client"
        }
    ];

    await User.insertMany(testUsers);
    console.log("Les comptes de test ont été insérés avec succès !");
    process.exit(0);
})
.catch(err => {
    console.error("Erreur d'insertion :", err);
    process.exit(1);
});
