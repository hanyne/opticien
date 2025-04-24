const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Create a review (authenticated users only)
router.post('/', auth, async (req, res) => {
  const { rating, comment, productId } = req.body;

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'Utilisateur non authentifié' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }

    const existingReview = await Review.findOne({ user: req.user.id, product: productId });
    if (existingReview) {
      return res.status(400).json({ msg: 'Vous avez déjà laissé un avis pour ce produit' });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ msg: 'La note doit être entre 1 et 5' });
    }

    const review = new Review({
      rating,
      comment,
      user: req.user.id,
      product: productId,
    });

    await review.save();

    product.reviews.push(review._id);

    // Calculate majority rating
    const reviews = await Review.find({ product: productId });
    const ratingCounts = {};
    reviews.forEach((rev) => {
      ratingCounts[rev.rating] = (ratingCounts[rev.rating] || 0) + 1;
    });
    let maxCount = 0;
    let majorityRating = 0;
    for (const [rating, count] of Object.entries(ratingCounts)) {
      if (count > maxCount) {
        maxCount = count;
        majorityRating = Number(rating);
      }
    }
    product.majorityRating = majorityRating;
    await product.save();

    const populatedReview = await Review.findById(review._id).populate('user', 'name');
    res.json({ msg: 'Avis ajouté avec succès', review: populatedReview });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'avis:', error);
    res.status(500).json({ msg: 'Erreur serveur', error: error.message });
  }
});

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    res.status(500).json({ msg: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;