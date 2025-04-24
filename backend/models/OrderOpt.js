const mongoose = require('mongoose');

const orderOptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  frameType: {
    type: String,
    enum: ['montage cadre', 'demi cadre', 'percé', 'spécial'],
    required: true,
  },
  additionalNotes: {
    type: String,
    default: '',
  },
  corrections: {
    OD: { // Right eye
      sphere: { type: String, default: '' },
      cylindre: { type: String, default: '' },
      axe: { type: String, default: '' },
      addition: { type: String, default: '' },
    },
    OG: { // Left eye
      sphere: { type: String, default: '' },
      cylindre: { type: String, default: '' },
      axe: { type: String, default: '' },
      addition: { type: String, default: '' },
    },
  },
  wearer: {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    telephone: { type: String, required: true },
    email: { type: String, required: true },
  },
  lensType: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('OrderOpt', orderOptSchema);