const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/parfumDB")
.then(async () => {
   await User.updateMany({}, { $set: { isVerified: true } });
   console.log("Anciens utilisateurs mis à jour et vérifiés !");
   process.exit(0);
}).catch(console.error);
