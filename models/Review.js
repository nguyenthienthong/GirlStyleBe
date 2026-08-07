const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  customerName: { type: String, required: true },
  avatar: { type: String, default: '' },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  content: { type: String, required: true },
  image: { type: String, default: '' },
  verifiedPurchase: { type: Boolean, default: true },
  status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'approved' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
