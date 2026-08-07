const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, default: '' },
  password: { type: String, default: '' },
  role: { 
    type: String, 
    enum: ['customer', 'admin', 'sales', 'content'], 
    default: 'customer' 
  },
  canWrite: { type: Boolean, default: false }, // Permission to write blog articles / lookbooks / products
  address: {
    street: String,
    city: String,
    district: String,
    ward: String
  },
  autoCreated: { type: Boolean, default: false }, // Created during quick checkout
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
