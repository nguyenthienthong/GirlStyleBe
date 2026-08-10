const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { isDbConnected, mockStore } = require('../config/db');

router.get('/dashboard', async (req, res) => {
  try {
    let orders = [];
    let productsCount = 0;
    let customersCount = 0;

    if (isDbConnected()) {
      orders = await Order.find();
      productsCount = await Product.countDocuments();
      customersCount = await User.countDocuments({ role: 'customer' });
    } else {
      orders = mockStore.orders || [];
      productsCount = (mockStore.products || []).length;
      customersCount = (mockStore.users || []).filter(u => u.role === 'customer').length;
    }

    let totalRevenue = 0;
    let pendingOrdersCount = 0;
    let completedOrdersCount = 0;

    orders.forEach(o => {
      if (o.paymentStatus === 'paid') {
        totalRevenue += o.finalAmount || 0;
      }
      if (o.status === 'new' || o.status === 'packing' || o.status === 'shipping') {
        pendingOrdersCount++;
      }
      if (o.status === 'completed') {
        completedOrdersCount++;
      }
    });

    const recentOrders = isDbConnected()
      ? await Order.find().sort({ createdAt: -1 }).limit(10)
      : [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders: orders.length,
        pendingOrdersCount,
        completedOrdersCount,
        productsCount,
        customersCount
      },
      recentOrders
    });
  } catch (error) {
    const orders = mockStore.orders || [];
    let totalRevenue = 0;
    let pendingOrdersCount = 0;
    let completedOrdersCount = 0;

    orders.forEach(o => {
      if (o.paymentStatus === 'paid') totalRevenue += o.finalAmount || 0;
      if (o.status === 'new' || o.status === 'packing' || o.status === 'shipping') pendingOrdersCount++;
      if (o.status === 'completed') completedOrdersCount++;
    });

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders: orders.length,
        pendingOrdersCount,
        completedOrdersCount,
        productsCount: (mockStore.products || []).length,
        customersCount: (mockStore.users || []).filter(u => u.role === 'customer').length
      },
      recentOrders: [...orders].slice(0, 10)
    });
  }
});

module.exports = router;
