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
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ msg: 'Token invalide' });
  }
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

module.exports = router;