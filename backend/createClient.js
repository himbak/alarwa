const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/parfumDB")
.then(async () => {
   const email = "client@client.com";
   const existingUser = await User.findOne({ email });
   
   if(existingUser) {
       console.log("Compte déjà existant. isVerified =", existingUser.isVerified);
   } else {
       const hashedPassword = await bcrypt.hash("client123", 10);
       const newUser = new User({
           name: "Client Test",
           email: email,
           password: hashedPassword,
           role: "client",
           isVerified: true
       });
       await newUser.save();
       console.log("Compte client test créé avec succès.");
   }
   process.exit(0);
}).catch(console.error);
