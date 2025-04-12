// server/routes/product.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
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
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images (jpeg, jpg, png) sont autorisées !'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('image');

// Middleware pour gérer les erreurs de Multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ msg: `Erreur Multer : ${err.message}` });
  } else if (err) {
    return res.status(400).json({ msg: err.message });
  }
  next();
};

// Ajouter un produit (Admin uniquement)
router.post('/', [auth, admin, upload, handleMulterError], async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    console.log('Données reçues pour ajout produit:', { name, description, price, stock, category, image });

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
      image,
    });
    await product.save();

    // Recharger le produit avec la catégorie peuplée
    const newProduct = await Product.findById(product._id).populate('category');
    res.json({ msg: 'Produit ajouté avec succès', product: newProduct });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du produit:', error);
    res.status(500).json({ msg: 'Erreur serveur', error: error.message });
  }
});

// Récupérer tous les produits (avec leur catégorie)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ msg: 'Erreur serveur', error: error.message });
  }
});

// Modifier un produit (Admin uniquement)
router.put('/:id', [auth, admin, upload, handleMulterError], async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  const newImage = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    console.log('Données reçues pour modification produit:', { name, description, price, stock, category, newImage });

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ msg: 'Catégorie non trouvée' });
    }

    if (newImage && product.image) {
      const oldImagePath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log('Ancienne image supprimée:', product.image);
      }
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.category = category || product.category;
    product.image = newImage || product.image;
    await product.save();

    // Recharger le produit avec la catégorie peuplée
    const updatedProduct = await Product.findById(product._id).populate('category');
    res.json({ msg: 'Produit mis à jour avec succès', product: updatedProduct });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({ msg: 'Erreur serveur', error: error.message });
  }
});

// Supprimer un produit (Admin uniquement)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    console.log(`Tentative de suppression du produit avec ID: ${req.params.id}`);
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.log('Produit non trouvé');
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }

    // Supprimer l'image associée si elle existe
    if (product.image) {
      const imagePath = path.join(__dirname, '..', product.image);
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log('Image supprimée:', product.image);
        } else {
          console.log('Image non trouvée sur le serveur:', product.image);
        }
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'image:', err);
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