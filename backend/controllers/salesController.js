const SalesRecord = require("../models/SalesRecord");

const addSale = async (req, res) => {
  try {
    const { productName, product, unitsSold, quantity, unitPrice, totalAmount, revenue, date, region } = req.body;
    const sale = await SalesRecord.create({
      retailerId: req.userId,
      product: productName || product,
      unitsSold: unitsSold || quantity || 0,
      quantity: quantity || unitsSold || 0,
      unitPrice: unitPrice || 0,
      totalAmount: totalAmount || revenue || (unitPrice * (unitsSold || quantity || 0)) || 0,
      revenue: revenue || totalAmount || (unitPrice * (unitsSold || quantity || 0)) || 0,
      date: date || new Date(),
      region: region || "",
    });
    res.status(201).json({ success: true, data: sale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllSales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { retailerId: req.userId };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    const sales = await SalesRecord.find(filter).sort({ date: -1 });
    res.json({ success: true, data: sales, count: sales.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addSale, getAllSales };
