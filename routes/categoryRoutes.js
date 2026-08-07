const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { isDbConnected, mockStore } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, categories: mockStore.categories });
    }
    const categories = await Category.find().sort({ order: 1 });
    res.json({ success: true, categories });
  } catch (error) {
    res.json({ success: true, categories: mockStore.categories });
  }
});

module.exports = router;
