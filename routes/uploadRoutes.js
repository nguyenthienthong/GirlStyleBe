const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Determine exact target upload folder (Fe/public/uploads or GirlStyleFe/public/uploads)
const getTargetUploadDir = () => {
  const fePath = path.resolve(__dirname, '../../Fe/public/uploads');
  const repoPath = path.resolve(__dirname, '../../GirlStyleFe/public/uploads');

  if (fs.existsSync(path.dirname(fePath))) {
    if (!fs.existsSync(fePath)) fs.mkdirSync(fePath, { recursive: true });
    return fePath;
  }
  if (fs.existsSync(path.dirname(repoPath))) {
    if (!fs.existsSync(repoPath)) fs.mkdirSync(repoPath, { recursive: true });
    return repoPath;
  }
  if (!fs.existsSync(fePath)) fs.mkdirSync(fePath, { recursive: true });
  return fePath;
};

const uploadDir = getTargetUploadDir();
console.log(`[Upload API] Saving uploaded files to: ${uploadDir}`);

// Upload Base64 API Route
router.post('/', (req, res) => {
  try {
    const { image, fileName } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'Chưa cung cấp dữ liệu hình ảnh' });
    }

    // Extract Base64 data if present
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    let extension = (image.match(/^data:image\/(\w+);base64,/) || [])[1] || 'jpg';
    if (extension === 'jpeg') extension = 'jpg';
    
    const timeStamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);
    const uniqueFileName = `banner_${timeStamp}_${randomSuffix}.${extension}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    // Save image file to disk
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    const imageUrl = `/uploads/${uniqueFileName}`;
    console.log(`[Upload Success] File written to: ${filePath} -> Served URL: ${imageUrl}`);

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
