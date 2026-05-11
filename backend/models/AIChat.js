const mongoose = require("mongoose");

const aiChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userType: { type: String },
  role: { type: String, enum: ["user", "assistant"] },
  content: { type: String },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("AIChat", aiChatSchema);
