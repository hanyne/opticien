const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const OrderOpt = require('../models/OrderOpt');
const auth = require('../middleware/auth');

// GET /api/orders/monthly-sales - Fetch monthly sales for the current year
router.get('/monthly-sales', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Accès non autorisé' });
    }

    const currentYear = new Date().getFullYear();
    const monthlySales = Array(12).fill(0); // Initialize array for 12 months

    // Fetch client orders
    const clientOrders = await Order.find({
      status: 'delivered',
      createdAt: {
        $gte: new Date(currentYear, 0, 1),
        $lte: new Date(currentYear, 11, 31, 23, 59, 59),
      },
    });

    // Fetch optician orders
    const opticianOrders = await OrderOpt.find({
      status: 'delivered',
      createdAt: {
        $gte: new Date(currzentYear, 0, 1),
        $lte: new Date(currentYear, 11, 31, 23, 59, 59),
      },
    });

    // Aggregate client order sales by month
    clientOrders.forEach(order => {
      const month = new Date(order.createdAt).getMonth(); // 0-11
      monthlySales[month] += order.totalPrice || 0;
    });

    // Aggregate optician order sales by month (using placeholder price)
    opticianOrders.forEach(order => {
      const month = new Date(order.createdAt).getMonth();
      monthlySales[month] += 100; // Placeholder price (adjust based on your pricing model)
    });

    res.json(monthlySales);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

module.exports = router;