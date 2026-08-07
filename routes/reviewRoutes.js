const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { isDbConnected, mockStore } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, reviews: mockStore.reviews });
    }
    const reviews = await Review.find({ status: 'approved' }).populate('product', 'name code').sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.json({ success: true, reviews: mockStore.reviews });
  }
});

module.exports = router;
