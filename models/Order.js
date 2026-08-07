const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  code: String,
  color: String,
  size: String,
  price: Number,
  quantity: Number,
  image: String
});

const orderSchema = new mongoose.Schema({
  orderCode: { type: String, required: true, unique: true }, // e.g. GS88921
  customerInfo: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    address: { type: String, required: true },
    city: { type: String, default: 'TP. Hồ Chí Minh' },
    note: { type: String, default: '' }
  },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  voucherCode: { type: String, default: '' },
  shippingFee: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  
  paymentMethod: { 
    type: String, 
    enum: ['vietqr', 'vnpay', 'cod'], 
    default: 'vietqr' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'refunded', 'failed'], 
    default: 'pending' 
  },
  status: { 
    type: String, 
    enum: ['new', 'packing', 'shipping', 'completed', 'cancelled'], 
    default: 'new' 
  },
  
  vietqrRef: {
    accountNo: String,
    accountName: String,
    bankId: String,
    qrUrl: String
  },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
