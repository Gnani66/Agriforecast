const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Distributor = require("../models/Distributor");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, companyName, fleetSize, warehouseLocation, serviceRegion } = req.body;

    const existing = await Distributor.findOne({ email });
    if (existing) return res.status(400).json({ message: "Distributor already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const distributor = await Distributor.create({
      name, email, password: hashedPassword, companyName, fleetSize, warehouseLocation, serviceRegion,
    });

    const token = jwt.sign({ id: distributor._id, role: "distributor" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ message: "Signup successful", token, distributor });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const distributor = await Distributor.findOne({ email });
    if (!distributor) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, distributor.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: distributor._id, role: "distributor" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful", token, distributor });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;