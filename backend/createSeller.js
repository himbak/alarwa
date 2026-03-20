const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/parfumDB")
.then(async () => {
   const email = "vendeur@vendeur.com";
   const existingUser = await User.findOne({ email });
   
   if(existingUser) {
       console.log("Compte Vendeur déjà existant. isVerified =", existingUser.isVerified);
   } else {
       const hashedPassword = await bcrypt.hash("vendeur123", 10);
       const newUser = new User({
           name: "Vendeur Test",
           email: email,
           password: hashedPassword,
           role: "vendeur",
           isVerified: true
       });
       await newUser.save();
       console.log("Compte Vendeur test créé avec succès.");
   }
   process.exit(0);
}).catch(console.error);
