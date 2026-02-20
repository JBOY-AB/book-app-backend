const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true,
}));

const bookRoutes = require('./src/books/book.route');
const orderRoutes = require('./src/orders/order.route');
const userRoutes = require('./src/users/user.route');
const adminRoutes = require('./src/stats/admin.stats');

app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);

app.get("/test-db", async (req, res) => {
  try {
    const booksCount = await mongoose.connection.db.collection("books").countDocuments();
    res.send(`MongoDB connected! Books in DB: ${booksCount}`);
  } catch (err) {
    res.status(500).send("MongoDB connection failed: " + err.message);
  }
});

app.get("/", (req, res) => {
  res.send("Book Store Server is running!");
});

async function main() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err); // full error, no .message
  }
}

main();