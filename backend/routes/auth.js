// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Route pour la connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Mot de passe incorrect' });
    }

    // Créer un token JWT
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

// Route pour créer un utilisateur (pour les tests)
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Utilisateur déjà existant' });
    }

    user = new User({
      email,
      password: await bcrypt.hash(password, 10),
      role,
    });

    await user.save();
    res.json({ msg: 'Utilisateur créé avec succès' });
  } catch (error) {
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

module.exports = router;