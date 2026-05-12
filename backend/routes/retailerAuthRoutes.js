const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Retailer = require("../models/Retailer");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, storeName, storeType, region, inventoryCategory } = req.body;

    const normalizedEmail = email.toLowerCase().trim();
    const existingRetailer = await Retailer.findOne({ email: normalizedEmail });

    if (existingRetailer) {
      return res.status(400).json({ message: "Retailer already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const retailer = await Retailer.create({
      name,
      email,
      password: hashedPassword,
      storeName,
      storeType,
      region,
      inventoryCategory,
    });

    const token = jwt.sign({ id: retailer._id, role: "retailer" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Signup successful",
      token,
      retailer,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const retailer = await Retailer.findOne({ email });

    if (!retailer) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, retailer.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: retailer._id, role: "retailer" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      retailer,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;