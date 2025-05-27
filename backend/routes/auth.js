const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'Aucun token fourni' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Accès refusé. Admin requis.' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(401).json({ msg: 'Token invalide' });
  }
};

// Route pour la connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed: Email ${email} not found`);
      return res.status(400).json({ msg: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login failed: Incorrect password for ${email}`);
      return res.status(400).json({ msg: 'Mot de passe incorrect' });
    }

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    user.loginHistory.push({ timestamp: new Date(), ip: req.ip });
    await user.save();
    console.log(`Login successful: ${email}, Role: ${user.role}, Token: ${token}`);

    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

// Route pour vérifier l'utilisateur
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ msg: 'Aucun token fourni' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ msg: 'Utilisateur non trouvé' });
    }
    res.json({ user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(401).json({ msg: 'Token invalide' });
  }
});

// Route pour l'auto-inscription (non admin)
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Utilisateur déjà existant' });
    }

    user = new User({
      email,
      password,
      role: 'client', // Default to client for self-registration
    });

    await user.save();
    console.log(`User registered: ${email}, Role: client`);
    res.json({ msg: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

// Route pour ajouter un utilisateur par l'admin
router.post('/admin/register', isAdmin, async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Utilisateur déjà existant' });
    }

    const validRoles = ['client', 'opticien'];
    const userRole = validRoles.includes(role) ? role : 'client';

    user = new User({
      email,
      password,
      role: userRole,
    });

    await user.save();
    console.log(`Admin registered user: ${email}, Role: ${userRole}`);
    res.json({ msg: 'Utilisateur créé avec succès par l\'admin' });
  } catch (error) {
    console.error('Admin register error:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

module.exports = router;