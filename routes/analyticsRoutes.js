const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

router.get('/dashboard', async (req, res) => {
  try {
    const orders = await Order.find();
    const productsCount = await Product.countDocuments();
    const customersCount = await User.countDocuments({ role: 'customer' });

    let totalRevenue = 0;
    let pendingOrdersCount = 0;
    let completedOrdersCount = 0;

    orders.forEach(o => {
      if (o.paymentStatus === 'paid') {
        totalRevenue += o.finalAmount || 0;
      }
      if (o.status === 'new' || o.status === 'packing') {
        pendingOrdersCount++;
      }
      if (o.status === 'completed') {
        completedOrdersCount++;
      }
    });

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

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
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
