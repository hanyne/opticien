const express = require('express');
const router = express.Router();
const LensStock = require('../models/LensStock');
const jwt = require('jsonwebtoken');

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

// Get all lens stock (available to authenticated users)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const lensStock = await LensStock.find();
    res.json(lensStock);
  } catch (error) {
    console.error('Lens stock fetch error:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

// Add to existing lens stock (admin only)
router.post('/add', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, quantity } = req.body;
  try {
    if (!name || !quantity) {
      return res.status(400).json({ msg: 'Le nom et la quantité sont requis' });
    }
    if (isNaN(quantity) || quantity < 0) {
      return res.status(400).json({ msg: 'La quantité doit être un nombre positif' });
    }

    // Check if lens exists
    let lensStock = await LensStock.findOne({ name });
    if (!lensStock) {
      return res.status(400).json({ msg: 'Type de verre non trouvé dans le stock' });
    }

    // Update existing stock
    lensStock.stock += Number(quantity);
    await lensStock.save();
    res.json({ msg: `Stock mis à jour pour ${name}. Nouvelle quantité: ${lensStock.stock}` });
  } catch (error) {
    console.error('Lens stock update error:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

module.exports = router;