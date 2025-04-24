const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const authMiddleware = require('./auth');

// Add or update item in cart
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }
    if (quantity > product.stock) {
      return res.status(400).json({ msg: 'Quantité demandée supérieure au stock' });
    }

    // Find or create cart for authenticated user
    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }

    // Check if product exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex > -1) {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    } else {
      // Add new item
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart);
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error);
    res.status(500).json({ msg: 'Erreur serveur', error: error.message });
  }
});

// Get cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    console.error('Erreur lors de la récupération du panier:', error);
    res.status(500).json({ msg: 'Erreur serveur', error: error.message });
  }
});

// Remove item from cart
router.delete('/item/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ msg: 'Panier non trouvé' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error);
    res.status(500).json({ msg: 'Erreur serveur', error: error.message });
  }
});

// Delete cart
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ msg: 'Panier non trouvé' });
    }
    res.json({ msg: 'Panier supprimé avec succès' });
  } catch (error) {
    console.error('Cart deletion error:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

module.exports = router;