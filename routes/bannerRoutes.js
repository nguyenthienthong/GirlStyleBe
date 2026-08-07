const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const { isDbConnected, mockStore, saveStoreToFile } = require('../config/db');

// Get All Banners
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    if (!isDbConnected()) {
      let items = [...mockStore.banners];
      if (type) items = items.filter(b => b.type === type);
      return res.json({ success: true, banners: items });
    }
    let filter = {};
    if (type) filter.type = type;
    const banners = await Banner.find(filter).sort({ order: 1 });
    res.json({ success: true, banners });
  } catch (error) {
    let items = [...mockStore.banners];
    if (req.query.type) items = items.filter(b => b.type === req.query.type);
    res.json({ success: true, banners: items });
  }
});

// Create New Banner
router.post('/', async (req, res) => {
  try {
    const { title, subtitle, imageUrl, linkUrl, order, active, type } = req.body;

    if (!isDbConnected()) {
      const newB = {
        _id: 'b_' + Date.now(),
        title: title || 'Banner Mới',
        subtitle: subtitle || '',
        imageUrl: imageUrl || '',
        linkUrl: linkUrl || '/products',
        order: Number(order) || mockStore.banners.length + 1,
        type: type || 'hero_slide',
        active: active !== undefined ? active : true
      };
      mockStore.banners.push(newB);
      saveStoreToFile();
      return res.status(201).json({ success: true, banner: newB, message: 'Đã thêm banner mới' });
    }

    const newBanner = new Banner({
      title,
      subtitle,
      imageUrl,
      linkUrl,
      order: order || 1,
      type: type || 'hero_slide',
      active: active !== undefined ? active : true
    });
    await newBanner.save();
    res.status(201).json({ success: true, banner: newBanner, message: 'Đã thêm banner mới' });
  } catch (error) {
    const newB = { _id: 'b_' + Date.now(), ...req.body };
    mockStore.banners.push(newB);
    saveStoreToFile();
    res.status(201).json({ success: true, banner: newB, message: 'Đã thêm banner mới' });
  }
});

// Update Existing Banner
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isDbConnected()) {
      const idx = mockStore.banners.findIndex(b => b._id === id);
      if (idx !== -1) {
        mockStore.banners[idx] = { ...mockStore.banners[idx], ...req.body };
        saveStoreToFile();
        return res.json({ success: true, banner: mockStore.banners[idx], message: 'Đã cập nhật banner' });
      }
      return res.status(404).json({ success: false, message: 'Không tìm thấy banner' });
    }

    const updated = await Banner.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, banner: updated, message: 'Đã cập nhật banner' });
  } catch (error) {
    const idx = mockStore.banners.findIndex(b => b._id === req.params.id);
    if (idx !== -1) {
      mockStore.banners[idx] = { ...mockStore.banners[idx], ...req.body };
      saveStoreToFile();
      return res.json({ success: true, banner: mockStore.banners[idx], message: 'Đã cập nhật banner' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete Banner
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isDbConnected()) {
      mockStore.banners = mockStore.banners.filter(b => b._id !== id);
      saveStoreToFile();
      return res.json({ success: true, message: 'Đã xóa banner' });
    }
    await Banner.findByIdAndDelete(id);
    res.json({ success: true, message: 'Đã xóa banner' });
  } catch (error) {
    mockStore.banners = mockStore.banners.filter(b => b._id !== req.params.id);
    saveStoreToFile();
    res.json({ success: true, message: 'Đã xóa banner' });
  }
});

module.exports = router;
