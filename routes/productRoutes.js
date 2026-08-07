const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { isDbConnected, mockStore, saveStoreToFile } = require('../config/db');

// Get All Products with Filters
router.get('/', async (req, res) => {
  try {
    const { category, size, color, minPrice, maxPrice, occasion, search, isHot, isNewArrival, limit, isAiGenerated } = req.query;

    if (!isDbConnected()) {
      let items = [...mockStore.products];
      if (category) items = items.filter(p => p.category === category);
      if (size) items = items.filter(p => p.sizes && p.sizes.includes(size));
      if (color) {
        const cleanColor = color.replace('#', '').trim().toLowerCase();
        items = items.filter(p => p.colors && p.colors.some((c) => {
          const cHex = c.hex ? c.hex.replace('#', '').trim().toLowerCase() : '';
          const cName = c.colorName ? c.colorName.toLowerCase() : '';
          return (
            cHex === cleanColor ||
            cName.includes(cleanColor) ||
            (cleanColor === 'ffffff' && (cName.includes('trắng') || cName.includes('white'))) ||
            (cleanColor === 'c21a27' && (cName.includes('đỏ') || cName.includes('red')))
          );
        }));
      }
      if (occasion) items = items.filter(p => p.occasion === occasion);
      if (isAiGenerated === 'true') items = items.filter(p => p.isAiGenerated);
      if (maxPrice) items = items.filter(p => (p.salePrice || p.price) <= Number(maxPrice));
      if (search) items = items.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase()));
      if (limit) items = items.slice(0, Number(limit));

      return res.json({ success: true, count: items.length, products: items });
    }

    let filter = {};
    if (category) filter.category = category;
    if (size) filter.sizes = size;
    if (color) {
      const cleanColor = color.replace('#', '').trim();
      filter.$or = [
        { 'colors.colorName': { $regex: cleanColor, $options: 'i' } },
        { 'colors.hex': { $regex: cleanColor, $options: 'i' } }
      ];
    }
    if (occasion) filter.occasion = occasion;
    if (isHot === 'true') filter.isHot = true;
    if (isNewArrival === 'true') filter.isNewArrival = true;
    if (isAiGenerated === 'true') filter.isAiGenerated = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }

    let query = Product.find(filter).populate('mixMatchProductIds', 'name price salePrice colors code');
    if (limit) query = query.limit(Number(limit));

    const products = await query.sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    let items = [...mockStore.products];
    res.json({ success: true, count: items.length, products: items });
  }
});

// Single Product
router.get('/:id', async (req, res) => {
  try {
    if (!isDbConnected()) {
      const p = mockStore.products.find(item => item._id === req.params.id || item.code === req.params.id) || mockStore.products[0];
      return res.json({ success: true, product: p });
    }
    const product = await Product.findById(req.params.id).populate('mixMatchProductIds');
    if (!product) {
      const p = mockStore.products[0];
      return res.json({ success: true, product: p });
    }
    res.json({ success: true, product });
  } catch (error) {
    const p = mockStore.products[0];
    res.json({ success: true, product: p });
  }
});

// Create Product
router.post('/', async (req, res) => {
  try {
    if (!isDbConnected()) {
      const newP = { _id: 'p_' + Date.now(), ...req.body };
      mockStore.products.unshift(newP);
      saveStoreToFile();
      return res.status(201).json({ success: true, product: newP, message: 'Đã thêm sản phẩm mới' });
    }
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct, message: 'Đã thêm sản phẩm mới' });
  } catch (error) {
    const newP = { _id: 'p_' + Date.now(), ...req.body };
    mockStore.products.unshift(newP);
    saveStoreToFile();
    res.status(201).json({ success: true, product: newP, message: 'Đã thêm sản phẩm mới' });
  }
});

// PUT Update Product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isDbConnected()) {
      const idx = mockStore.products.findIndex(p => p._id === id);
      if (idx !== -1) {
        mockStore.products[idx] = { ...mockStore.products[idx], ...req.body };
        saveStoreToFile();
        return res.json({ success: true, product: mockStore.products[idx], message: 'Đã cập nhật sản phẩm thành công' });
      }
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, product: updated, message: 'Đã cập nhật sản phẩm thành công' });
  } catch (error) {
    const idx = mockStore.products.findIndex(p => p._id === req.params.id);
    if (idx !== -1) {
      mockStore.products[idx] = { ...mockStore.products[idx], ...req.body };
      saveStoreToFile();
      return res.json({ success: true, product: mockStore.products[idx], message: 'Đã cập nhật sản phẩm' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete Product
router.delete('/:id', async (req, res) => {
  try {
    if (!isDbConnected()) {
      mockStore.products = mockStore.products.filter(p => p._id !== req.params.id);
      saveStoreToFile();
      return res.json({ success: true, message: 'Đã xóa sản phẩm' });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Đã xóa sản phẩm' });
  } catch (error) {
    mockStore.products = mockStore.products.filter(p => p._id !== req.params.id);
    saveStoreToFile();
    res.json({ success: true, message: 'Đã xóa sản phẩm' });
  }
});

module.exports = router;
