const mongoose = require('mongoose');

const lensStockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('LensStock', lensStockSchema);