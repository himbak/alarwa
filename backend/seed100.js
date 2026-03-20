const mongoose = require("mongoose");
const Parfum = require("./models/Parfum");
const User = require("./models/User");

const brands = ["Chanel", "Dior", "Yves Saint Laurent", "Tom Ford", "Giorgio Armani", "Givenchy", "Lancôme", "Guerlain", "Hermès", "Paco Rabanne", "Versace", "Hugo Boss", "Creed", "Bvlgari", "Prada", "Gucci", "Mugler", "Kenzo", "Jean Paul Gaultier", "Dolce & Gabbana"];
const lines = ["Eau de Parfum", "Intense", "Sport", "Noir", "L'Absolu"];
const images = [
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1592914610354-fd354d45faab?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&q=80&w=800"
];

const categories = ["Homme", "Femme", "Mixte"];

async function seed100() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/parfumDB");
    console.log("Connecté à MongoDB");

    const vendeur = await User.findOne({ role: "vendeur" });
    if (!vendeur) {
      console.log("Veuillez d'abord créer un vendeur.");
      process.exit(1);
    }

    await Parfum.deleteMany({});
    
    const parfumsToInsert = [];
    let imgIndex = 0;
    
    for (let i = 0; i < brands.length; i++) {
      for (let j = 0; j < lines.length; j++) {
        const brand = brands[i];
        const line = lines[j];
        parfumsToInsert.push({
          name: `${brand} ${line}`,
          brand: brand,
          description: `Découvrez l'élégance audacieuse de ${brand} avec la collection ${line}. Un parfum captivant qui laisse un sillage inoubliable, parfait pour toutes les occasions.`,
          price: Math.floor(Math.random() * 2000) + 500, // entre 500 et 2500 MAD
          image: images[imgIndex % images.length],
          stock: Math.floor(Math.random() * 50) + 5,
          sellerId: vendeur._id,
          category: categories[(i+j) % categories.length],
          notes: ["Boisé", "Ambré", "Floral", "Agrumes", "Musc"].sort(() => 0.5 - Math.random()).slice(0, 3)
        });
        imgIndex++;
      }
    }

    await Parfum.insertMany(parfumsToInsert);
    console.log(`${parfumsToInsert.length} parfums ajoutés avec succès !`);
    
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

seed100();
