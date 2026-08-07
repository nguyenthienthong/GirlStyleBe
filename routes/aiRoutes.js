const express = require('express');
const router = express.Router();

// AI Copilot for Admin
router.post('/generate-description', async (req, res) => {
  try {
    const { productName, category, material, occasion } = req.body;
    
    // Generates a vibrant, flattering, Vietnamese female fashion copy
    const copy = `✨ **${productName || 'Thiết kế thời trang nữ mới'}** ✨\n\n` +
      `💖 **Phong cách**: ${occasion || 'Dạo phố & Công sở'} thanh lịch, tôn dáng chuẩn phom người phụ nữ Việt.\n` +
      `🧶 **Chất liệu**: ${material || 'Lụa tơ tằm mềm mại'}, thoáng mát, thấm hút mồ hôi và cực kỳ êm ái trên da.\n` +
      `👗 **Điểm nhấn thiết kế**: Đường may tỉ mỉ, phom dáng che khuyết điểm tinh tế, phối đồ cực kỳ dễ dàng cùng phụ kiện đi kèm.\n\n` +
      `🔥 *Số lượng có hạn trong bộ sưu tập mới nhất! Nàng nhanh tay sở hữu ngay nhé!*`;

    res.json({ success: true, description: copy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/generate-blog-ideas', async (req, res) => {
  try {
    const { topic } = req.body;
    const ideas = [
      {
        title: `Top 5 Mẫu Váy Phối Đồ ${topic || 'Công Sở'} Tôn Dáng Dành Cho Nàng Sang Chảnh`,
        excerpt: 'Bật mí công thức phối váy thanh lịch giúp nàng tự tin tỏa sáng mỗi ngày đi làm...',
        content: `Mùa mốt năm nay, phong cách thời trang nữ công sở tập trung vào sự thoải mái nhưng không kém phần thanh lịch...`
      },
      {
        title: `Bí Quyết Chọn Size & Phối Phụ Kiện Chuẩn Gu Nữ Tính`,
        excerpt: 'Hướng dẫn chi tiết từ các stylist giúp bạn phối outfit hoàn hảo trong 5 phút...',
        content: `Để có một outfit đẹp, việc chọn đúng size trang phục đóng vai trò quyết định...`
      }
    ];

    res.json({ success: true, ideas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/generate-reply', async (req, res) => {
  try {
    const { customerName, message, type } = req.body;
    const reply = `Chào ${customerName || 'nàng'}, GirlStyle rất cảm ơn ${type === 'khieu_nai' ? 'phản hồi' : 'ý kiến đóng góp quý báu'} của bạn!\n\n` +
      `Đội ngũ chăm sóc khách hàng của GirlStyle đã tiếp nhận thông tin và sẽ hỗ trợ trực tiếp qua SĐT/Zalo ngay. ` +
      `Mong nàng luôn đồng hành và có trải nghiệm tuyệt vời cùng GirlStyle nhé! 💖`;

    res.json({ success: true, reply });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
