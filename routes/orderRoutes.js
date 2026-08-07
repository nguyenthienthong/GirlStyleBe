const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const SiteConfig = require('../models/SiteConfig');
const { isDbConnected, mockStore } = require('../config/db');

router.post('/', async (req, res) => {
  try {
    const { customerInfo, items, totalAmount, discountAmount, voucherCode, shippingFee, paymentMethod } = req.body;
    const orderCode = 'GS' + Math.floor(100000 + Math.random() * 900000);
    const finalAmount = Math.max(0, totalAmount + (shippingFee || 0) - (discountAmount || 0));

    const bankId = mockStore.config.vietqrConfig.bankId || 'MBBank';
    const accountNo = mockStore.config.vietqrConfig.accountNo || '0988889999';
    const accountName = mockStore.config.vietqrConfig.accountName || 'GIRLSTYLE FASHION STORE';

    const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${finalAmount}&addInfo=${orderCode}&accountName=${encodeURIComponent(accountName)}`;

    const orderData = {
      _id: 'ord_' + Date.now(),
      orderCode,
      customerInfo,
      items,
      totalAmount,
      discountAmount,
      voucherCode,
      shippingFee,
      finalAmount,
      paymentMethod,
      paymentStatus: 'pending',
      status: 'new',
      vietqrRef: {
        bankId,
        accountNo,
        accountName,
        qrUrl
      },
      createdAt: new Date().toISOString()
    };

    if (!isDbConnected()) {
      mockStore.orders.unshift(orderData);
      return res.status(201).json({ success: true, order: orderData });
    }

    const order = new Order(orderData);
    await order.save();
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:orderCode/confirm-payment', async (req, res) => {
  try {
    if (!isDbConnected()) {
      const o = mockStore.orders.find(ord => ord.orderCode === req.params.orderCode);
      if (o) {
        o.paymentStatus = 'paid';
        o.status = 'packing';
      }
      return res.json({ success: true, message: 'Đã xác nhận thanh toán thành công!', order: o });
    }
    const order = await Order.findOne({ orderCode: req.params.orderCode });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại' });
    }

    order.paymentStatus = 'paid';
    order.status = 'packing';
    await order.save();

    res.json({ success: true, message: 'Đã xác nhận thanh toán thành công!', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, count: mockStore.orders.length, orders: mockStore.orders });
    }
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.json({ success: true, count: mockStore.orders.length, orders: mockStore.orders });
  }
});

router.get('/:orderCode', async (req, res) => {
  try {
    if (!isDbConnected()) {
      const o = mockStore.orders.find(ord => ord.orderCode === req.params.orderCode);
      return res.json({ success: true, order: o });
    }
    const order = await Order.findOne({ orderCode: req.params.orderCode });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    if (!isDbConnected()) {
      const o = mockStore.orders.find(ord => ord._id === req.params.id || ord.orderCode === req.params.id);
      if (o) {
        if (status) o.status = status;
        if (paymentStatus) o.paymentStatus = paymentStatus;
      }
      return res.json({ success: true, order: o });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status, paymentStatus }, { new: true });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
