const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Middleware to verify token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ msg: 'Aucun token fourni' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ msg: 'Token invalide' });
  }
};

// Middleware to restrict to admins
const adminMiddleware = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ msg: 'Accès réservé aux administrateurs' });
  }
  next();
};

// Get all orders (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const query = {};
    if (req.query.date) {
      const start = new Date(req.query.date);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      query.createdAt = { $gte: start, $lt: end };
    } else if (req.query.month) {
      const [year, month] = req.query.month.split('-').map(Number);
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      query.createdAt = { $gte: start, $lt: end };
    }
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: 'cartId',
        populate: {
          path: 'items.product',
          model: 'Product',
        },
      })
      .populate('userId', 'email');
    res.json(orders);
  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const orders = await Order.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'cartId',
        populate: { path: 'items.product', model: 'Product' },
      });
    res.json(orders);
  } catch (error) {
    console.error('User orders fetch error:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});
// Create order
router.post('/', authMiddleware, async (req, res) => {
  const { cartId, shipping, paymentMethod, total } = req.body;
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ msg: 'Panier non trouvé' });
    }
    const order = new Order({
      cartId,
      userId: req.userId,
      shipping,
      paymentMethod,
      total,
      status: 'en attente',
    });
    await order.save();
    res.json({ msg: 'Commande créée avec succès', order });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

// Update order status (validate only)
router.put('/:orderId/status', authMiddleware, adminMiddleware, async (req, res) => {
  const { status } = req.body;
  const { orderId } = req.params;
  try {
    if (!['en attente', 'validée'].includes(status)) {
      return res.status(400).json({ msg: 'Statut invalide' });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: 'Commande non trouvée' });
    }
    order.status = status;
    await order.save();
    res.json({ msg: `Commande ${status} avec succès`, order });
  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

// Delete order (cancel)
router.delete('/:orderId', authMiddleware, adminMiddleware, async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ msg: 'Commande non trouvée' });
    }
    res.json({ msg: 'Commande supprimée avec succès' });
  } catch (error) {
    console.error('Order deletion error:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

module.exports = router;