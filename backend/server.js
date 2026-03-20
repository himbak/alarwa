const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API Parfum fonctionne 🚀");
});



const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const parfumsRoutes = require("./routes/parfums");
const ordersRoutes = require("./routes/orders");
const reviewsRoutes = require("./routes/reviews");
const usersRoutes = require("./routes/users");
const promosRoutes = require("./routes/promos");
const uploadRoutes = require("./routes/upload");
const path = require("path");

app.use("/api/auth", authRoutes);
app.use("/api/parfums", parfumsRoutes);
app.use("/api/account", require("./routes/account"));
app.use("/api/orders", ordersRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/promos", promosRoutes);
app.use("/api/upload", uploadRoutes);

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/parfumDB";
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
.then(() => {
    console.log("MongoDB connecté");
    app.listen(PORT, () => {
        console.log(`Serveur lancé sur le port ${PORT}`);
    });
})
.catch(err => console.log(err));
