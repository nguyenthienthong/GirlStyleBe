const express = require('express');
const router = express.Router();

// Full 63 Provinces & Cities of Vietnam Dataset
const fullProvincesList = [
  { code: '01', name: 'Hà Nội' },
  { code: '79', name: 'TP. Hồ Chí Minh' },
  { code: '48', name: 'Đà Nẵng' },
  { code: '31', name: 'Hải Phòng' },
  { code: '92', name: 'Cần Thơ' },
  { code: '89', name: 'An Giang' },
  { code: '77', name: 'Bà Rịa - Vũng Tàu' },
  { code: '24', name: 'Bắc Giang' },
  { code: '06', name: 'Bắc Kạn' },
  { code: '95', name: 'Bạc Liêu' },
  { code: '27', name: 'Bắc Ninh' },
  { code: '83', name: 'Bến Tre' },
  { code: '52', name: 'Bình Định' },
  { code: '74', name: 'Bình Dương' },
  { code: '70', name: 'Bình Phước' },
  { code: '60', name: 'Bình Thuận' },
  { code: '96', name: 'Cà Mau' },
  { code: '04', name: 'Cao Bằng' },
  { code: '66', name: 'Đắk Lắk' },
  { code: '67', name: 'Đắk Nông' },
  { code: '11', name: 'Điện Biên' },
  { code: '75', name: 'Đồng Nai' },
  { code: '87', name: 'Đồng Tháp' },
  { code: '64', name: 'Gia Lai' },
  { code: '02', name: 'Hà Giang' },
  { code: '35', name: 'Hà Nam' },
  { code: '42', name: 'Hà Tĩnh' },
  { code: '30', name: 'Hải Dương' },
  { code: '93', name: 'Hậu Giang' },
  { code: '17', name: 'Hòa Bình' },
  { code: '33', name: 'Hưng Yên' },
  { code: '56', name: 'Khánh Hòa' },
  { code: '91', name: 'Kiên Giang' },
  { code: '62', name: 'Kon Tum' },
  { code: '12', name: 'Lai Châu' },
  { code: '68', name: 'Lâm Đồng' },
  { code: '20', name: 'Lạng Sơn' },
  { code: '10', name: 'Lào Cai' },
  { code: '80', name: 'Long An' },
  { code: '36', name: 'Nam Định' },
  { code: '40', name: 'Nghệ An' },
  { code: '37', name: 'Ninh Bình' },
  { code: '58', name: 'Ninh Thuận' },
  { code: '25', name: 'Phú Thọ' },
  { code: '54', name: 'Phú Yên' },
  { code: '44', name: 'Quảng Bình' },
  { code: '49', name: 'Quảng Nam' },
  { code: '51', name: 'Quảng Ngãi' },
  { code: '22', name: 'Quảng Ninh' },
  { code: '45', name: 'Quảng Trị' },
  { code: '94', name: 'Sóc Trăng' },
  { code: '14', name: 'Sơn La' },
  { code: '72', name: 'Tây Ninh' },
  { code: '34', name: 'Thái Bình' },
  { code: '19', name: 'Thái Nguyên' },
  { code: '38', name: 'Thanh Hóa' },
  { code: '46', name: 'Thừa Thiên Huế' },
  { code: '82', name: 'Tiền Giang' },
  { code: '84', name: 'Trà Vinh' },
  { code: '08', name: 'Tuyên Quang' },
  { code: '86', name: 'Vĩnh Long' },
  { code: '26', name: 'Vĩnh Phúc' },
  { code: '15', name: 'Yên Bái' }
];

const sampleDistrictsMap = {
  'TP. Hồ Chí Minh': ['Quận 1', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 10', 'Quận 11', 'Quận 12', 'Thành phố Thủ Đức', 'Quận Bình Thạnh', 'Quận Tân Bình', 'Quận Tân Phú', 'Quận Gò Vấp', 'Quận Phú Nhuận', 'Quận Bình Tân', 'Huyện Bình Chánh', 'Huyện Hóc Môn', 'Huyện Củ Chi', 'Huyện Nhà Bè', 'Huyện Cần Giờ'],
  'Hà Nội': ['Quận Ba Đình', 'Quận Hoàn Kiếm', 'Quận Tây Hồ', 'Quận Long Biên', 'Quận Cầu Giấy', 'Quận Đống Đa', 'Quận Hai Bà Trưng', 'Quận Hoàng Mai', 'Quận Thanh Xuân', 'Quận Nam Từ Liêm', 'Quận Bắc Từ Liêm', 'Quận Hà Đông', 'Thị xã Sơn Tây', 'Huyện Gia Lâm', 'Huyện Đông Anh', 'Huyện Thanh Trì', 'Huyện Hoài Đức', 'Huyện Thạch Thất'],
  'Đà Nẵng': ['Quận Hải Châu', 'Quận Thanh Khê', 'Quận Sơn Trà', 'Quận Ngũ Hành Sơn', 'Quận Liên Chiểu', 'Quận Cẩm Lệ', 'Huyện Hòa Vang'],
  'Hải Phòng': ['Quận Hồng Bàng', 'Quận Ngô Quyền', 'Quận Lê Chân', 'Quận Hải An', 'Quận Kiến An', 'Quận Đồ Sơn', 'Quận Dương Kinh', 'Huyện Thủy Nguyên', 'Huyện An Dương'],
  'Cần Thơ': ['Quận Ninh Kiều', 'Quận Bình Thủy', 'Quận Cái Răng', 'Quận Ô Môn', 'Quận Thốt Nốt', 'Huyện Phong Điền'],
  'Bình Dương': ['TP. Thủ Dầu Một', 'TP. Thuận An', 'TP. Dĩ An', 'TP. Tân Uyên', 'TP. Bến Cát', 'Huyện Bắc Tân Uyên'],
  'Bà Rịa - Vũng Tàu': ['TP. Vũng Tàu', 'TP. Bà Rịa', 'Thị xã Phú Mỹ', 'Huyện Long Đền', 'Huyện Đất Đỏ', 'Huyện Xuyên Mộc'],
  'Đồng Nai': ['TP. Biên Hòa', 'TP. Long Khánh', 'Huyện Nhơn Trạch', 'Huyện Long Thành', 'Huyện Trảng Bom', 'Huyện Thống Nhất'],
  'An Giang': ['TP. Long Xuyên', 'TP. Châu Đốc', 'Thị xã Tân Châu', 'Huyện An Phú', 'Huyện Châu Phú'],
  'Quảng Ninh': ['TP. Hạ Long', 'TP. Móng Cái', 'TP. Cẩm Phả', 'TP. Uông Bí', 'Thị xã Quảng Yên', 'Thị xã Đông Triều'],
  'Thừa Thiên Huế': ['TP. Huế', 'Thị xã Hương Thủy', 'Thị xã Hương Trà', 'Huyện Phong Điền', 'Huyện Phú Vang'],
  'Khánh Hòa': ['TP. Nha Trang', 'TP. Cam Ranh', 'Thị xã Ninh Hòa', 'Huyện Diên Khánh', 'Huyện Vạn Ninh'],
  'Lâm Đồng': ['TP. Đà Lạt', 'TP. Bảo Lộc', 'Huyện Đức Trọng', 'Huyện Đơn Dương', 'Huyện Di Linh'],
  'Nghệ An': ['TP. Vinh', 'Thị xã Cửa Lò', 'Thị xã Thái Hòa', 'Thị xã Hoàng Mai', 'Huyện Diễn Châu', 'Huyện Quỳnh Lưu'],
  'Thanh Hóa': ['TP. Thanh Hóa', 'TP. Sầm Sơn', 'Thị xã Bỉm Sơn', 'Thị xã Nghi Sơn', 'Huyện Hoằng Hóa']
};

const defaultDistricts = ['Thành phố / Thị xã trung tâm', 'Huyện trung tâm 1', 'Huyện trung tâm 2', 'Huyện ngoại thành 1', 'Huyện ngoại thành 2'];
const defaultWards = ['Phường 1', 'Phường 2', 'Phường 3', 'Phường Bến Nghé', 'Phường Tràng Tiền', 'Phường Tân Định', 'Xã Trung Tâm'];

// GET /api/address/provinces -> Returns full 63 Provinces & Cities of Vietnam
router.get('/provinces', (req, res) => {
  res.json({
    success: true,
    count: fullProvincesList.length,
    provinces: fullProvincesList
  });
});

// GET /api/address/districts?province=
router.get('/districts', (req, res) => {
  const { province } = req.query;
  if (!province) {
    return res.status(400).json({ success: false, message: 'Vui lòng chọn Tỉnh/Thành phố' });
  }

  const provName = province.toString().trim();
  const list = sampleDistrictsMap[provName] || defaultDistricts;
  
  const formatted = list.map((name, index) => ({
    code: `${index + 1}`,
    name
  }));

  res.json({
    success: true,
    count: formatted.length,
    districts: formatted
  });
});

// GET /api/address/wards?province=&district=
router.get('/wards', (req, res) => {
  const { district } = req.query;
  if (!district) {
    return res.status(400).json({ success: false, message: 'Vui lòng chọn Quận/Huyện' });
  }

  const distName = district.toString().trim();
  let wards = defaultWards;

  if (distName.includes('Quận 1')) {
    wards = ['Phường Bến Nghé', 'Phường Bến Thành', 'Phường Cầu Kho', 'Phường Cầu Ông Lãnh', 'Phường Đa Kao', 'Phường Nguyễn Cư Trinh', 'Phường Nguyễn Thái Bình', 'Phường Phạm Ngũ Lão', 'Phường Tân Định'];
  } else if (distName.includes('Hoàn Kiếm')) {
    wards = ['Phường Tràng Tiền', 'Phường Hàng Bông', 'Phường Hàng Bạc', 'Phường Cửa Nam', 'Phường Lý Thái Tổ', 'Phường Phan Chu Trinh'];
  } else if (distName.includes('Ba Đình')) {
    wards = ['Phường Cống Vị', 'Phường Điện Biên', 'Phường Đội Cấn', 'Phường Kim Mã', 'Phường Liễu Giai', 'Phường Ngọc Hà'];
  }

  res.json({
    success: true,
    count: wards.length,
    wards
  });
});

module.exports = router;
