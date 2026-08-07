const express = require('express');
const router = express.Router();
const { isDbConnected, mockStore, saveStoreToFile } = require('../config/db');

// In-memory mock data store for Mix & Match combos
if (!mockStore.mixMatchCombos) {
  mockStore.mixMatchCombos = [
    {
      _id: 'mm1',
      title: 'Combo Mix & Match Streetwear 01',
      code: 'COMBO-MM01',
      image: '/products/korean_voile_top.jpg',
      images: [
        '/products/korean_voile_top.jpg',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80',
        '/products/pleated_midi_dress.jpg'
      ],
      items: [
        {
          productId: 'p2',
          name: 'Áo thun nữ Slimfit tay ngắn',
          price: 169000,
          image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
          sizes: ['S', 'M'],
          colors: [
            { name: 'Kem', hex: '#EDE8E2' },
            { name: 'Đen', hex: '#000000' },
            { name: 'Nâu', hex: '#8d6349' },
            { name: 'Xanh', hex: '#2b549a' }
          ]
        },
        {
          productId: 'p8',
          name: 'Chân váy xếp ly tennis',
          price: 199000,
          image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=400&q=80',
          sizes: ['S', 'M', 'L'],
          colors: [
            { name: 'Trắng', hex: '#FFFFFF' },
            { name: 'Vàng', hex: '#e6c843' },
            { name: 'Đen', hex: '#000000' }
          ]
        }
      ]
    }
  ];
}

// GET all combos
router.get('/', (req, res) => {
  res.json({ success: true, combos: mockStore.mixMatchCombos });
});

// GET single combo
router.get('/:id', (req, res) => {
  const combo = mockStore.mixMatchCombos.find(c => c._id === req.params.id || c.code === req.params.id) || mockStore.mixMatchCombos[0];
  res.json({ success: true, combo });
});

// POST create combo (Admin)
router.post('/', (req, res) => {
  const newCombo = {
    _id: 'mm_' + Date.now(),
    title: req.body.title || 'Combo Mix & Match Mới',
    code: req.body.code || `COMBO-MM${mockStore.mixMatchCombos.length + 1}`,
    image: req.body.image || '/products/korean_voile_top.jpg',
    images: req.body.images || [req.body.image || '/products/korean_voile_top.jpg'],
    items: req.body.items || []
  };
  mockStore.mixMatchCombos.unshift(newCombo);
  saveStoreToFile();
  res.status(201).json({ success: true, combo: newCombo, message: 'Đã thêm bộ Mix & Match mới' });
});

// PUT update combo (Admin)
router.put('/:id', (req, res) => {
  const idx = mockStore.mixMatchCombos.findIndex(c => c._id === req.params.id);
  if (idx !== -1) {
    mockStore.mixMatchCombos[idx] = { ...mockStore.mixMatchCombos[idx], ...req.body };
    saveStoreToFile();
    return res.json({ success: true, combo: mockStore.mixMatchCombos[idx], message: 'Đã cập nhật bộ Mix & Match' });
  }
  res.status(404).json({ success: false, message: 'Không tìm thấy bộ Mix & Match' });
});

// DELETE combo (Admin)
router.delete('/:id', (req, res) => {
  mockStore.mixMatchCombos = mockStore.mixMatchCombos.filter(c => c._id !== req.params.id);
  saveStoreToFile();
  res.json({ success: true, message: 'Đã xóa bộ Mix & Match' });
});

module.exports = router;
