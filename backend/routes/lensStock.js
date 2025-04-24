const express = require('express');
const router = express.Router();
const LensStock = require('../models/LensStock');
const auth = require('../middleware/auth'); // Keep the auth middleware

// GET /api/lens-stock - Fetch all lens stock
router.get('/', auth, async (req, res) => {
  try {
    const lensStock = await LensStock.find();
    res.json(lensStock);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

module.exports = router;