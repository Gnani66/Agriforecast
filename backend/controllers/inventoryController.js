const InventoryItem = require("../models/InventoryItem");

const addInventory = async (req, res) => {
  try {
    const { productName, product, category, quantity, expiryDate, purchasePrice, sellingPrice, storageType, supplierName } = req.body;
    const item = await InventoryItem.create({
      retailerId: req.userId,
      product: productName || product,
      category,
      quantity,
      expiryDate,
      purchasePrice: purchasePrice || 0,
      sellingPrice: sellingPrice || 0,
      price: sellingPrice || purchasePrice || 0,
      storageType: storageType || "Ambient",
      supplierName: supplierName || "",
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllInventory = async (req, res) => {
  try {
    const items = await InventoryItem.find({ retailerId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: items, count: items.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateInventory = async (req, res) => {
  try {
    const { productName, product, ...rest } = req.body;
    const updateData = { ...rest };
    if (productName || product) updateData.product = productName || product;
    if (rest.sellingPrice) updateData.price = rest.sellingPrice;
    const item = await InventoryItem.findOneAndUpdate(
      { _id: req.params.id, retailerId: req.userId },
      updateData,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ success: false, message: "Inventory item not found" });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteInventory = async (req, res) => {
  try {
    const item = await InventoryItem.findOneAndDelete({ _id: req.params.id, retailerId: req.userId });
    if (!item) return res.status(404).json({ success: false, message: "Inventory item not found" });
    res.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addInventory, getAllInventory, updateInventory, deleteInventory };
