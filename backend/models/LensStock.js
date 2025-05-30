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
});

module.exports = mongoose.model('LensStock', lensStockSchema);