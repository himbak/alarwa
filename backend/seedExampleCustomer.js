const mongoose = require("mongoose");
const User = require("./models/User");
const Order = require("./models/Order");
const Parfum = require("./models/Parfum");

mongoose.connect("mongodb://127.0.0.1:27017/parfumDB")
.then(async () => {
    console.log("🚀 Création d'un compte client exemple ALARWA...");

    // Nettoyer l'ancien compte s'il existe
    await User.deleteMany({ email: "luxury.customer@alarwa.com" });

    // Récupérer quelques parfums pour le wishlist et les commandes
    const allParfums = await Parfum.find().limit(3);
    const wishlistIds = allParfums.map(p => p._id);

    const exampleCustomer = new User({
        name: "Yassine Al-Arwa",
        email: "luxury.customer@alarwa.com",
        password: "password123", // Non-haché pour la simplicité du test local
        role: "client",
        phone: "+212 6 12 34 56 78",
        addresses: [
            {
                type: "livraison",
                street: "12 Avenue Mohammed V, Angle Rue Al Fourat",
                city: "Rabat",
                zip: "10000",
                country: "Maroc",
                instructions: "Appelez à l'arrivée, 4ème étage.",
                isDefault: true
            },
            {
                type: "facturation",
                street: "Res. Les Jardins, Appt 42",
                city: "Casablanca",
                zip: "20000",
                country: "Maroc",
                isDefault: false
            }
        ],
        scentProfile: ["Oud", "Musc", "Vanille", "Bois de Santal"],
        wishlist: wishlistIds,
        marketingPrefs: {
            newsletter: true,
            stockAlerts: false
        },
        twoFactorEnabled: true
    });

    const savedUser = await exampleCustomer.save();
    console.log("✅ Compte Client créé !");

    // Créer une commande fictive
    if (allParfums.length > 0) {
        await Order.deleteMany({ userId: savedUser._id });
        const order = new Order({
            userId: savedUser._id,
            products: [
                {
                    parfumId: allParfums[0]._id,
                    quantity: 1,
                    priceAtPurchase: allParfums[0].price
                }
            ],
            totalAmount: allParfums[0].price,
            status: "Expédiée"
        });
        await order.save();
        console.log("📦 Commande d'exemple ajoutée !");
    }

    console.log("\nInformations de connexion :");
    console.log("Email : luxury.customer@alarwa.com");
    console.log("Pass : password123");
    
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
