const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../GirlStyleFe/public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Upload Base64 or Image File API Route
router.post('/', (req, res) => {
  try {
    const { image, fileName } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'Chưa cung cấp dữ liệu hình ảnh' });
    }

    // Extract Base64 data if present
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const extension = (image.match(/^data:image\/(\w+);base64,/) || [])[1] || 'jpg';
    
    const uniqueFileName = `banner_${Date.now()}_${Math.floor(Math.random() * 1000)}.${extension}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    // Save image file
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    const imageUrl = `/uploads/${uniqueFileName}`;
    console.log(`[Upload] Image saved successfully to ${imageUrl}`);

    res.json({
      success: true,
      message: 'Tải ảnh lên thành công',
      url: imageUrl,
      fileName: uniqueFileName
    });
  } catch (error) {
    console.error('[Upload Error]', error);
    res.status(500).json({ success: false, message: 'Lỗi tải ảnh lên: ' + error.message });
  }
});

module.exports = router;
