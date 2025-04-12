// server/routes/category.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Ajouter une catégorie (Admin uniquement)
router.post('/', [auth, admin], async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = new Category({ name, description });
    await category.save();
    res.json({ msg: 'Catégorie ajoutée avec succès', category });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la catégorie:', error);
    res.status(500).json({ msg: 'Erreur serveur', error: error.message });
  }
});

// Récupérer toutes les catégories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({ msg: 'Erreur serveur', error: error.message });
  }
});

// Modifier une catégorie (Admin uniquement)
router.put('/:id', [auth, admin], async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: 'Catégorie non trouvée' });
    }

    category.name = name || category.name;
    category.description = description || category.description;
    await category.save();
    res.json({ msg: 'Catégorie mise à jour avec succès', category });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    res.status(500).json({ msg: 'Erreur serveur', error: error.message });
  }
});

// Supprimer une catégorie (Admin uniquement)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    console.log(`Tentative de suppression de la catégorie avec ID: ${req.params.id}`);
    const category = await Category.findById(req.params.id);
    if (!category) {
      console.log('Catégorie non trouvée');
      return res.status(404).json({ msg: 'Catégorie non trouvée' });
    }

    // Vérifier si des produits sont associés à cette catégorie
    const products = await Product.find({ category: req.params.id });
    if (products.length > 0) {
      console.log('Produits associés trouvés:', products.length);
      return res.status(400).json({
        msg: 'Impossible de supprimer cette catégorie car des produits y sont associés',
      });
    }

    await category.deleteOne();
    console.log('Catégorie supprimée avec succès');
    res.json({ msg: 'Catégorie supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    res.status(500).json({ msg: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;