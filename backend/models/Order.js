const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['client', 'optician'] },
  items: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
  status: { type: String, default: 'pending' },
  assemblyType: { type: String, enum: ['frame', 'half-frame', 'drilled', 'special'], default: null },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Order', orderSchema);