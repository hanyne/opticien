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

// Middleware to authenticate any user
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'Aucun token fourni' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ msg: 'Utilisateur non trouvé' });

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(401).json({ msg: 'Token invalide' });
  }
};

// Route for user login
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

// Route to get current user details
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(401).json({ msg: 'Token invalide' });
  }
});

// Route for self-registration (clients only)
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

// Route for admin to create users
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

    // Trigger notification
    const { sendNotification } = require('./notifications'); // Adjust path if needed
    sendNotification(`Nouvel utilisateur créé: ${email} (${userRole})`);

    res.json({ msg: 'Utilisateur créé avec succès par l\'admin' });
  } catch (error) {
    console.error('Admin register error:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

// Route to get all users (admin only)
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').lean();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

// Route to update user (self or admin)
router.put('/users/:id', auth, async (req, res) => {
  const { email, password } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'Utilisateur non trouvé' });

    // Check permissions
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({ msg: 'Accès refusé' });
    }

    if (email) user.email = email;
    if (password) user.password = password; // bcrypt hashing handled by schema

    await user.save();
    console.log(`User updated: ${user.email}, Role: ${user.role}`);
    res.json({ msg: 'Utilisateur mis à jour avec succès' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

// Route to delete user (admin only)
router.delete('/users/:id', isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Utilisateur non trouvé' });

    console.log(`User deleted: ${user.email}, Role: ${user.role}`);
    res.json({ msg: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

module.exports = router;