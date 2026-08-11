const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Determine exact target upload folder for static serving
const getTargetUploadDir = () => {
  const fePath = path.resolve(__dirname, '../Fe/public/uploads');
  const repoPath = path.resolve(__dirname, '../GirlStyleFe/public/uploads');

  if (fs.existsSync(fePath)) return fePath;
  if (fs.existsSync(repoPath)) return repoPath;
  if (!fs.existsSync(fePath)) fs.mkdirSync(fePath, { recursive: true });
  return fePath;
};

const feUploadPath = getTargetUploadDir();
console.log(`[GirlStyle BE] Static uploads serving from: ${feUploadPath}`);
app.use('/uploads', express.static(feUploadPath));

// Connect Database
connectDB();

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/ai-copilot', require('./routes/aiRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/vouchers', require('./routes/voucherRoutes'));
app.use('/api/mix-match', require('./routes/mixMatchRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/address', require('./routes/addressRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'GirlStyle Backend Service is running smoothly',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[GirlStyle BE] Server running on port ${PORT}`);
});
