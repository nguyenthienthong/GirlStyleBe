const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  type: { 
    type: String, 
    enum: ['gop_y', 'khieu_nai', 'tu_van_size', 'khac'], 
    default: 'gop_y' 
  },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'resolved'], 
    default: 'pending' 
  },
  adminReply: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
