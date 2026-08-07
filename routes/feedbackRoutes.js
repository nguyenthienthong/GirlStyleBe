const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { isDbConnected, mockStore } = require('../config/db');

router.post('/', async (req, res) => {
  try {
    const { customerName, phone, email, type, message } = req.body;
    if (!customerName || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ Tên, SĐT và Nội dung phản hồi' });
    }

    const fbData = {
      _id: 'fb_' + Date.now(),
      customerName,
      phone,
      email: email || '',
      type: type || 'gop_y',
      message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    if (!isDbConnected()) {
      mockStore.feedbacks.unshift(fbData);
      return res.status(201).json({ success: true, message: 'Cảm ơn bạn đã gửi đóng góp ý kiến!', feedback: fbData });
    }

    const feedback = new Feedback(fbData);
    await feedback.save();
    res.status(201).json({ success: true, message: 'Cảm ơn bạn đã gửi đóng góp ý kiến!', feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, count: mockStore.feedbacks.length, feedbacks: mockStore.feedbacks });
    }
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, count: feedbacks.length, feedbacks });
  } catch (error) {
    res.json({ success: true, count: mockStore.feedbacks.length, feedbacks: mockStore.feedbacks });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status, adminReply } = req.body;
    if (!isDbConnected()) {
      const fb = mockStore.feedbacks.find(f => f._id === req.params.id);
      if (fb) {
        if (status) fb.status = status;
        if (adminReply !== undefined) fb.adminReply = adminReply;
      }
      return res.json({ success: true, feedback: fb });
    }
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id, 
      { status, adminReply }, 
      { new: true }
    );
    res.json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
