const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shipping: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  paymentMethod: { type: String, enum: ['cash_on_delivery'], default: 'cash_on_delivery' },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['en attente', 'validée'],
    default: 'en attente',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }, // Track status updates
});

// Update updatedAt on save
orderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);