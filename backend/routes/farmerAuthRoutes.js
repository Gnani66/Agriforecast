const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Farmer = require("../models/Farmer");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, region, farmType } = req.body;

    const existingFarmer = await Farmer.findOne({ email });

    if (existingFarmer) {
      return res.status(400).json({
        message: "Farmer already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const farmer = await Farmer.create({
      name,
      email,
      password: hashedPassword,
      region,
      farmType,
    });

    const token = jwt.sign({ id: farmer._id, role: "farmer" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Signup successful",
      token,
      farmer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const farmer = await Farmer.findOne({ email });

    if (!farmer) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, farmer.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: farmer._id,
        role: "farmer",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      farmer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;