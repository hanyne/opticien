const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const Category = require('../models/Category');
const jwt = require('jsonwebtoken');

// Middleware for authentication
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'Aucun token fourni' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(401).json({ msg: 'Token invalide' });
  }
};

// Middleware to check if user is admin
const admin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Accès refusé. Réservé aux admins.' });
    }
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(403).json({ msg: 'Accès refusé. Réservé aux admins.' });
  }
};

// Configuration de Multer pour images et modèles 3D
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.fieldname === 'model3D' ? 'uploads/models/' : 'uploads/images/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const imageTypes = /jpeg|jpg|png/;
    const modelTypes = /glb|gltf/;
    const extname = path.extname(file.originalname).toLowerCase();
    const isImage = imageTypes.test(extname) && imageTypes.test(file.mimetype);
    const isModel = modelTypes.test(extname);

    if (file.fieldname === 'image' && isImage) {
      return cb(null, true);
    } else if (file.fieldname === 'model3D' && isModel) {
      return cb(null, true);
    } else {
      cb(new Error('Fichier non autorisé. Images: jpeg, jpg, png; Modèles 3D: glb, gltf'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'model3D', maxCount: 1 },
]);

// Middleware pour gérer les erreurs de Multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ msg: `Erreur Multer : ${err.message}` });
  } else if (err) {
    return res.status(400).json({ msg: err.message });
  }
  next();
};

// Ajouter un produit
router.post('/', [auth, admin, upload, handleMulterError], async (req, res) => {
  const { name, description, price, stock, category, brand } = req.body;
  const image = req.files && req.files.image ? `/uploads/images/${req.files.image[0].filename}` : '';
  const model3D = req.files && req.files.model3D ? `/uploads/models/${req.files.model3D[0].filename}` : '';

  try {
    console.log('Données reçues pour ajout produit:', { name, description, price, stock, category, brand, image, model3D });

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ msg: 'Catégorie non trouvée' });
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      brand,
      image,
      model3D,
      reviews: [],
    });
    await product.save();

    const newProduct = await Product.findById(product._id).populate('category').populate({
      path: 'reviews',
      populate: { path: 'user', select: 'name' },
    });
    res.json({ msg: 'Produit ajouté avec succès', product: newProduct });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du produit:', error);
    res.status(500).json({ msg: 'Erreur serveur', error: error.message });
  }
});

// Modifier un produit
router.put('/:id', [auth, admin, upload, handleMulterError], async (req, res) => {
  const { name, description, price, stock, category, brand } = req.body;
  const newImage = req.files && req.files.image ? `/uploads/images/${req.files.image[0].filename}` : null;
  const newModel3D = req.files && req.files.model3D ? `/uploads/models/${req.files.model3D[0].filename}` : null;

  try {
    console.log('Données reçues pour modification produit:', { name, description, price, stock, category, brand, newImage, newModel3D });

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ msg: 'Catégorie non trouvée' });
    }

    // Supprimer ancienne image si remplacée
    if (newImage && product.image) {
      const oldImagePath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log('Ancienne image supprimée:', product.image);
      }
    }

    // Supprimer ancien modèle 3D si remplacé
    if (newModel3D && product.model3D) {
      const oldModelPath = path.join(__dirname, '..', product.model3D);
      if (fs.existsSync(oldModelPath)) {
        fs.unlinkSync(oldModelPath);
        console.log('Ancien modèle 3D supprimé:', product.model3D);
      }
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.image = newImage || product.image;
    product.model3D = newModel3D || product.model3D;
    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate('category')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name' },
      });
    res.json({ msg: 'Produit mis à jour avec succès', product: updatedProduct });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({ msg: 'Erreur serveur', error: error.message });
  }
});

// Récupérer tous les produits
router.get('/', async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query)
      .populate('category')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name' },
      });
    res.json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ msg: 'Erreur serveur', error: error.message });
  }
});

// Récupérer un produit par ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name' },
      });
    if (!product) return res.status(404).json({ msg: 'Produit non trouvé' });
    res.json(product);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({ msg: 'Erreur serveur', error: error.message });
  }
});

// Supprimer un produit
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    console.log(`Tentative de suppression du produit avec ID: ${req.params.id}`);
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.log('Produit non trouvé');
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }

    // Supprimer les avis associés (if Review model exists)
    // await Review.deleteMany({ product: product._id });
    console.log('Avis associés supprimés (si applicable)');

    // Supprimer l'image associée si elle existe
    if (product.image) {
      const imagePath = path.join(__dirname, '..', product.image);
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log('Image supprimée:', product.image);
        }
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'image:', err);
      }
    }

    // Supprimer le modèle 3D associé si il existe
    if (product.model3D) {
      const modelPath = path.join(__dirname, '..', product.model3D);
      try {
        if (fs.existsSync(modelPath)) {
          fs.unlinkSync(modelPath);
          console.log('Modèle 3D supprimé:', product.model3D);
        }
      } catch (err) {
        console.error('Erreur lors de la suppression du modèle 3D:', err);
      }
    }

    await product.deleteOne();
    console.log('Produit supprimé avec succès');
    res.json({ msg: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({ msg: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;