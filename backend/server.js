const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

const farmerAuthRoutes = require("./routes/farmerAuthRoutes");
const retailerAuthRoutes = require("./routes/retailerAuthRoutes");
const distributorAuthRoutes = require("./routes/distributorAuthRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const aiRoutes = require("./routes/aiRoutes");

const farmerRoutes = require("./routes/farmerRoutes");
const retailerRoutes = require("./routes/retailerRoutes");
const distributorRoutes = require("./routes/distributorRoutes");
const seedRoutes = require("./routes/seedRoutes");

const inventoryRoutes = require("./routes/inventoryRoutes");
const salesRoutes = require("./routes/salesRoutes");
const forecastRoutes = require("./routes/forecastRoutes");
const wasteRoutes = require("./routes/wasteRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const retailerAiRoutes = require("./routes/retailerAiRoutes");

app.use("/api/farmer", farmerAuthRoutes);
app.use("/api/retailer", retailerAuthRoutes);
app.use("/api/distributor", distributorAuthRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/retailer", retailerRoutes);
app.use("/api/distributor", distributorRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", seedRoutes);

app.use("/api/inventory", inventoryRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/forecast", forecastRoutes);
app.use("/api/waste", wasteRoutes);
app.use("/api/retailer/dashboard", dashboardRoutes);
app.use("/api/retail-ai", retailerAiRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});