const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const OrderOpt = require('../models/OrderOpt');
const LensStock = require('../models/LensStock');

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

// Middleware to restrict to opticians
const opticianMiddleware = (req, res, next) => {
  if (req.userRole !== 'opticien') {
    return res.status(403).json({ msg: 'Accès réservé aux opticiens' });
  }
  next();
};

// Middleware to restrict to admins
const adminMiddleware = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ msg: 'Accès réservé aux administrateurs' });
  }
  next();
};

// Create a new optician order and reduce lens stock
router.post('/', authMiddleware, opticianMiddleware, async (req, res) => {
  const { frameType, additionalNotes, corrections, wearer, lensType, status, totalPrice } = req.body;
  try {
    if (!frameType) {
      return res.status(400).json({ msg: 'Le type de montage est requis' });
    }
    if (!wearer || !wearer.nom || !wearer.prenom || !wearer.telephone || !wearer.email) {
      return res.status(400).json({ msg: 'Les informations du porteur sont requises' });
    }
    if (!lensType) {
      return res.status(400).json({ msg: 'Le type de verre est requis' });
    }

    // Check lens stock availability
    const lensStock = await LensStock.findOne({ name: lensType });
    if (!lensStock) {
      return res.status(400).json({ msg: 'Type de verre non trouvé dans le stock' });
    }
    if (lensStock.stock < 1) {
      return res.status(400).json({ msg: 'Stock insuffisant pour ce type de verre' });
    }

    // Reduce stock (assuming 1 pair of lenses per order)
    lensStock.stock -= 1;
    await lensStock.save();

    const orderOpt = new OrderOpt({
      userId: req.userId,
      frameType,
      additionalNotes: additionalNotes || '',
      corrections: corrections || { OD: {}, OG: {} },
      wearer,
      lensType: lensType || '',
      status: status || 'pending',
      totalPrice,
    });

    await orderOpt.save();
    res.json({ msg: 'Commande opticien créée avec succès, stock mis à jour', order: orderOpt });
  } catch (error) {
    console.error('Optician order creation error:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

// Get all optician orders (admin only)
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
    const orders = await OrderOpt.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'email');
    res.json(orders);
  } catch (error) {
    console.error('Optician orders fetch error:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

// Get optician's own orders
router.get('/my-orders', authMiddleware, opticianMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const orders = await OrderOpt.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'email');
    res.json(orders);
  } catch (error) {
    console.error('User optician orders fetch error:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

// Update optician order status and handle stock adjustments (admin only)
router.put('/:orderId/status', authMiddleware, adminMiddleware, async (req, res) => {
  const { status } = req.body;
  const { orderId } = req.params;
  try {
    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ msg: 'Statut invalide' });
    }
    const order = await OrderOpt.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: 'Commande opticien non trouvée' });
    }

    // Handle stock adjustments based on status change
    const lensStock = await LensStock.findOne({ name: order.lensType });
    if (!lensStock) {
      return res.status(400).json({ msg: 'Type de verre non trouvé dans le stock' });
    }

    // If status changes to 'cancelled' and was not previously cancelled, restore stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      lensStock.stock += 1;
      await lensStock.save();
      console.log(`Stock restored for ${order.lensType}: ${lensStock.stock}`);
    }

    // If status changes to 'delivered', log confirmation
    if (status === 'delivered' && order.status !== 'delivered') {
      console.log(`Order ${orderId} delivered. Stock for ${order.lensType} confirmed as updated: ${lensStock.stock}`);
    }

    order.status = status;
    await order.save();
    res.json({ msg: `Commande opticien ${status} avec succès`, order });
  } catch (error) {
    console.error('Optician order status update error:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

// Delete optician order (admin only)
router.delete('/:orderId', authMiddleware, adminMiddleware, async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await OrderOpt.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: 'Commande opticien non trouvée' });
    }

    // If the order wasn't cancelled, restore stock upon deletion
    if (order.status !== 'cancelled') {
      const lensStock = await LensStock.findOne({ name: order.lensType });
      if (lensStock) {
        lensStock.stock += 1;
        await lensStock.save();
        console.log(`Stock restored for ${order.lensType} upon deletion: ${lensStock.stock}`);
      }
    }

    await order.deleteOne();
    res.json({ msg: 'Commande opticien supprimée avec succès' });
  } catch (error) {
    console.error('Optician order deletion error:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

module.exports = router;