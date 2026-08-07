const express = require('express');
const router = express.Router();
const { isDbConnected, mockStore, saveStoreToFile } = require('../config/db');

// GET all vouchers
router.get('/', (req, res) => {
  res.json({ success: true, vouchers: mockStore.vouchers });
});

// Helper function to validate and apply voucher
const processApplyVoucher = (code, orderTotal) => {
  if (!code) {
    return { success: false, status: 400, message: 'Vui lòng nhập mã voucher' };
  }

  const voucher = mockStore.vouchers.find(
    (v) => v.code.toUpperCase() === code.toString().trim().toUpperCase() && v.active !== false
  );

  if (!voucher) {
    return { success: false, status: 404, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn' };
  }

  const total = Number(orderTotal) || 0;
  if (voucher.minOrderValue && total < voucher.minOrderValue) {
    return {
      success: false,
      status: 400,
      message: `Đơn hàng tối thiểu ${voucher.minOrderValue.toLocaleString('vi-VN')}đ để sử dụng mã này`
    };
  }

  let discountAmount = 0;
  if (voucher.discountType === 'percent') {
    discountAmount = (total * voucher.discountValue) / 100;
    if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
      discountAmount = voucher.maxDiscount;
    }
  } else {
    discountAmount = voucher.discountValue;
  }

  return {
    success: true,
    voucher: {
      code: voucher.code,
      discountAmount,
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      description: voucher.description
    },
    message: `Đã áp dụng thành công mã ${voucher.code}! Giảm ${discountAmount.toLocaleString('vi-VN')}đ`
  };
};

// GET apply voucher validation
router.get('/apply', (req, res) => {
  const { code, orderTotal, orderValue } = req.query;
  const result = processApplyVoucher(code, orderTotal || orderValue);
  if (!result.success) {
    return res.status(result.status || 400).json(result);
  }
  res.json(result);
});

// POST apply voucher validation
router.post('/apply', (req, res) => {
  const { code, orderTotal, orderValue } = req.body;
  const result = processApplyVoucher(code, orderTotal || orderValue);
  if (!result.success) {
    return res.status(result.status || 400).json(result);
  }
  res.json(result);
});

// POST create voucher (Admin)
router.post('/', (req, res) => {
  const { code, description, discountType, discountValue, minOrderValue, maxDiscount, validUntil, active } = req.body;
  if (!code || !discountValue) {
    return res.status(400).json({ success: false, message: 'Thiếu mã voucher hoặc giá trị giảm' });
  }

  const newVoucher = {
    _id: 'v_' + Date.now(),
    code: code.toUpperCase().trim(),
    description: description || `Giảm ${discountValue}`,
    discountType: discountType || 'fixed',
    discountValue: Number(discountValue),
    minOrderValue: Number(minOrderValue) || 0,
    maxDiscount: Number(maxDiscount) || 0,
    validUntil: validUntil || '2026-12-31',
    active: active !== undefined ? active : true
  };

  mockStore.vouchers.unshift(newVoucher);
  saveStoreToFile();
  res.status(201).json({ success: true, voucher: newVoucher, message: 'Tạo mã voucher thành công' });
});

// PUT update voucher (Admin)
router.put('/:id', (req, res) => {
  const idx = mockStore.vouchers.findIndex((v) => v._id === req.params.id);
  if (idx !== -1) {
    mockStore.vouchers[idx] = { ...mockStore.vouchers[idx], ...req.body };
    saveStoreToFile();
    return res.json({ success: true, voucher: mockStore.vouchers[idx], message: 'Cập nhật voucher thành công' });
  }
  res.status(404).json({ success: false, message: 'Không tìm thấy mã voucher' });
});

// DELETE voucher (Admin)
router.delete('/:id', (req, res) => {
  mockStore.vouchers = mockStore.vouchers.filter((v) => v._id !== req.params.id);
  saveStoreToFile();
  res.json({ success: true, message: 'Đã xóa mã voucher' });
});

module.exports = router;
