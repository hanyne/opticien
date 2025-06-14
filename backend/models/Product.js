const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String },
  image: { type: String },
  model3D: { type: String }, // New field for 3D model file (e.g., .glb)
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  majorityRating: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', productSchema);