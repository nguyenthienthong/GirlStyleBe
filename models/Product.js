const mongoose = require('mongoose');

const sizeStockSchema = new mongoose.Schema({
  size: { type: String, required: true },
  stock: { type: Number, default: 10 }
});

const colorVariantSchema = new mongoose.Schema({
  colorName: { type: String, default: 'Màu sắc' },
  hex: { type: String, default: '#C21A27' },
  sizes: [{ type: String }],
  sizeStocks: [sizeStockSchema], // Stock quantity per size e.g. [{ size: 'L', stock: 2 }]
  mainImage: { type: String, required: true },
  images: [{ type: String }]
});

const stockVariantSchema = new mongoose.Schema({
  colorName: { type: String, required: true },
  hex: { type: String },
  size: { type: String, required: true }, // 'S', 'M', 'L', 'XL'
  stock: { type: Number, default: 10 }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true }, // SKU e.g. GS-D01
  category: { type: String, required: true }, // e.g. 'Váy / Đầm', 'Áo', 'Quần', 'Set Đồ'
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  price: { type: Number, required: true },
  salePrice: { type: Number, default: null },
  colors: [colorVariantSchema],
  sizes: [{ type: String, default: ['S', 'M', 'L', 'XL'] }],
  inventory: [stockVariantSchema],
  description: { type: String, default: '' },
  material: { type: String, default: 'Lụa tơ tằm cao cấp' },
  careGuide: { type: String, default: 'Giặt tay nhẹ nhàng, tránh sấy nhiệt cao' },
  occasion: { type: String, default: 'Dạo phố' },
  
  // Mix & Match
  mixMatchProductIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  
  // AI Model Tag
  isAiGenerated: { type: Boolean, default: false },
  
  // Size Chart details
  sizeChartType: { type: String, default: 'dress' },
  
  isHot: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: true },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 12 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
