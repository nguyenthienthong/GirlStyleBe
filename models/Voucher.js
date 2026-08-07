const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  discountType: { type: String, enum: ['fixed', 'percent'], default: 'fixed' },
  discountValue: { type: Number, required: true }, // e.g. 50000 (50k) or 10 (%)
  minOrderValue: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 0 },
  usageLimit: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  validUntil: { type: Date, required: true },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Voucher', voucherSchema);
