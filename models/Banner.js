const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  imageUrl: { type: String, required: true },
  linkUrl: { type: String, default: '/products' },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  type: { type: String, enum: ['hero_slide', 'lookbook_feature', 'promo_banner'], default: 'hero_slide' }
});

module.exports = mongoose.model('Banner', bannerSchema);
