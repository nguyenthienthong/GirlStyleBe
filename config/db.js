const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const DATA_FILE_PATH = path.join(__dirname, 'data.json');

const defaultMockStore = {
  categories: [
    { _id: 'cat1', name: 'Váy / Đầm', slug: 'vay-dam', description: 'Đầm xòe, đầm ôm body, váy hoa nhí đi tiệc & dạo phố', order: 1, image: '/products/silk_cocktail_dress.jpg' },
    { _id: 'cat2', name: 'Áo Thời Trang', slug: 'ao', description: 'Áo sơ mi công sở, áo kiểu lụa, cardigan dệt kim', order: 2, image: '/products/korean_voile_top.jpg' },
    { _id: 'cat3', name: 'Quần & Chân Váy', slug: 'quan-vay', description: 'Quần tây hack dáng, chân váy xếp ly, chân váy chữ A', order: 3, image: '/products/pleated_midi_dress.jpg' },
    { _id: 'cat4', name: 'Set Đồ Outfit', slug: 'set-do', description: 'Set tweed tiểu thư, set công sở sang trọng, set dạo phố năng động', order: 4, image: '/products/tweed_suit_set.jpg' }
  ],
  products: [
    {
      _id: 'p1',
      name: 'Đầm Lụa Tơ Tằm Cổ V Tôn Dáng - Rose Silk Dress',
      code: 'GS-D01',
      category: 'Váy / Đầm',
      price: 650000,
      salePrice: 499000,
      occasion: 'Đi tiệc',
      material: 'Lụa tơ tằm cao cấp, mềm mịn không nhăn',
      careGuide: 'Giặt tay nhẹ nhàng bằng sữa tắm hoặc dầu gội, phơi nơi râm mát.',
      sizeChartType: 'dress',
      isHot: true,
      isNewArrival: true,
      isAiGenerated: true,
      colors: [
        {
          colorName: 'Đỏ Đô Brand',
          hex: '#C21A27',
          mainImage: '/products/silk_cocktail_dress.jpg',
          images: ['/products/silk_cocktail_dress.jpg', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80']
        },
        {
          colorName: 'Trắng Kem',
          hex: '#FFFFFF',
          mainImage: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
          images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80']
        },
        {
          colorName: 'Đen Huyền',
          hex: '#000000',
          mainImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
          images: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80']
        }
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      inventory: [
        { colorName: 'Đỏ Đô Brand', size: 'S', stock: 15 },
        { colorName: 'Đỏ Đô Brand', size: 'M', stock: 20 },
        { colorName: 'Trắng Kem', size: 'S', stock: 10 },
        { colorName: 'Đen Huyền', size: 'M', stock: 8 }
      ],
      description: 'Thiết kế cổ V quyến rũ kết hợp chất lụa rủ tự nhiên tôn lên nét quyến rũ quý phái cho các nàng trong mọi buổi tiệc.'
    },
    {
      _id: 'p2',
      name: 'Áo Kiểu Voan Tơ Cổ Nơ Hàn Quốc - Pearl Voile Top',
      code: 'GS-A02',
      category: 'Áo Thời Trang',
      price: 380000,
      salePrice: 295000,
      occasion: 'Công sở',
      material: 'Voan tơ mỏng nhẹ kèm áo lót hai dây mềm',
      careGuide: 'Nên cho vào túi giặt nếu giặt máy.',
      sizeChartType: 'top',
      isHot: true,
      isNewArrival: true,
      isAiGenerated: true,
      colors: [
        {
          colorName: 'Trắng Ngọc Trai',
          hex: '#FFFFFF',
          mainImage: '/products/korean_voile_top.jpg',
          images: ['/products/korean_voile_top.jpg', 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80']
        },
        {
          colorName: 'Kem Beige',
          hex: '#EDE8E2',
          mainImage: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80',
          images: ['https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80']
        }
      ],
      sizes: ['S', 'M', 'L'],
      description: 'Mẫu áo voan thanh lịch phối nơ thắt duyên dáng, cực xinh khi mix cùng chân váy hoặc quần tây dáng suông.'
    },
    {
      _id: 'p3',
      name: 'Set Tweed Sang Chảnh Tiểu Thư - Luxe Tweed Set',
      code: 'GS-S03',
      category: 'Set Đồ Outfit',
      price: 890000,
      salePrice: 750000,
      occasion: 'Đi tiệc',
      material: 'Dạ Tweed dệt sợi ánh kim cao cấp có lót lụa',
      sizeChartType: 'dress',
      isHot: true,
      isNewArrival: true,
      isAiGenerated: true,
      colors: [
        {
          colorName: 'Đỏ Ánh Kim',
          hex: '#C21A27',
          mainImage: '/products/tweed_suit_set.jpg',
          images: ['/products/tweed_suit_set.jpg', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80']
        },
        {
          colorName: 'Trắng Ngà Luxe',
          hex: '#FFFFFF',
          mainImage: '/products/tweed_suit_set.jpg',
          images: ['/products/tweed_suit_set.jpg']
        }
      ],
      sizes: ['S', 'M', 'L'],
      description: 'Set áo khoác dạ dáng ngắn đi kèm chân váy chữ A kiêu kỳ, mang chuẩn thần thái tiểu thư kiêu sa.'
    },
    {
      _id: 'p4',
      name: 'Đầm Midi Xếp Ly Kèm Thắt Lưng - Soria Pleated Dress',
      code: 'GS-D04',
      category: 'Váy / Đầm',
      price: 1100000,
      salePrice: 890000,
      occasion: 'Dạo phố',
      material: 'Kaki chun mềm nhã nhặn, đứng phom tôn dáng',
      sizeChartType: 'dress',
      isHot: true,
      isNewArrival: true,
      isAiGenerated: true,
      colors: [
        {
          colorName: 'Trắng Sữa',
          hex: '#FFFFFF',
          mainImage: '/products/pleated_midi_dress.jpg',
          images: ['/products/pleated_midi_dress.jpg']
        },
        {
          colorName: 'Kem Pastel',
          hex: '#EDE8E2',
          mainImage: '/products/pleated_midi_dress.jpg',
          images: ['/products/pleated_midi_dress.jpg']
        }
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'Mẫu đầm midi thắt eo thắt lưng bản nhỏ giúp thon gọn vóc dáng, chất liệu thoáng mát cao cấp.'
    }
  ],
  blogs: [
    {
      _id: 'blog1',
      title: 'Bí Quyết Chọn Đầm Lụa Tơ Tằm Tôn Dáng & Quyến Rũ Cho Quý Cô Tiệc Đêm',
      slug: 'bi-quyet-chon-dam-lua-to-tam-ton-dang',
      category: 'Mẹo Phối Đồ & Tiệc Đêm',
      author: 'Biên Tập Viên Linh Chi',
      readTime: '5 min read',
      createdAt: '2026-08-07T10:00:00.000Z',
      image: '/products/silk_cocktail_dress.jpg',
      summary: 'Đầm lụa tơ tằm luôn là sự lựa chọn hàng đầu của những quý cô kiêu kỳ trong mọi bữa tiệc. Khám phá ngay 5 mẹo chọn kiểu dáng đầm lụa cổ V và tông màu đỏ đô tôn da nhất 2026.',
      content: `Chất liệu lụa tơ tằm cao cấp từ lâu đã trở thành biểu tượng của sự sang trọng, quý phái. Với bề mặt rủ tự nhiên, óng ánh nhẹ dưới ánh đèn tiệc đêm, một chiếc đầm lụa chuẩn phom không chỉ giúp tôn lên những đường cong mềm mại mà còn mang lại cảm giác dễ chịu, thoáng mát suốt cả buổi tối.

### 1. Chọn Thiết Kế Cổ V Tôn Vòng 1 Thanh Lịch
Đầm lụa cổ V là thiết kế vượt thời gian. Đường xẻ V vừa phải tạo cảm giác phần cổ thon dài hơn, đồng thời thu hút ánh nhìn một cách tinh tế mà không hề phô phang.

### 2. Tông Màu Đỏ Đô (Brand Red) - Vũ Khí Tôn Da
Màu đỏ đô #C21A27 của GirlStyle® được nghiên cứu đặc biệt phù hợp với làn da của phụ nữ Đông Á, giúp làn da trông sáng bật tông và cực kỳ nổi bật dưới ánh đèn tiệc.`
    },
    {
      _id: 'blog2',
      title: 'Top 3 Áo Kiểu Hàn Quốc Tối Giản Tôn Thần Thái Công Sở Trẻ Trung',
      slug: 'top-3-ao-kieu-han-quoc-toi-gian-cong-so',
      category: 'Thời Trang Công Sở',
      author: 'Biên Tập Viên Linh Chi',
      readTime: '4 min read',
      createdAt: '2026-08-06T14:30:00.000Z',
      image: '/products/korean_voile_top.jpg',
      summary: 'Không còn sự gò bó của sơ mi trắng truyền thống. Khám phá bộ sưu tập áo voan tơ thắt nơ Hàn Quốc giúp nàng công sở tự tin rạng rỡ từ thứ Hai đến thứ Sáu.',
      content: `Phong cách thời trang công sở hiện đại hướng tới sự thoải mái nhưng vẫn phải chỉn chu và thanh lịch. Những chiếc áo kiểu voan tơ mềm mại phối chi tiết nơ thắt duyên dáng đang là xu hướng được săn đón nhất mùa hè năm nay.

### Áo Voan Tơ Cổ Nơ Ngọc Trai
Kết hợp chi tiết nơ thắt lụa nhẹ nhàng cùng tay bồng nhẹ che khuyết điểm bắp tay. Bạn có thể dễ dàng sơ vin cùng chân váy xếp ly hoặc quần tây dáng suông hack dáng.`
    },
    {
      _id: 'blog3',
      title: 'Set Đồ Tweed Tiểu Thư: Xu Hướng Thời Trang Sang Chảnh Không Bao Giờ Lỗi Mốt',
      slug: 'set-do-tweed-tieu-thu-xu-huong-sang-chanh',
      category: 'Xu Hướng Thời Trang',
      author: 'Thanh Hằng Style Adviser',
      readTime: '6 min read',
      createdAt: '2026-08-05T09:15:00.000Z',
      image: '/products/tweed_suit_set.jpg',
      summary: 'Vải Tweed dệt sợi ánh kim mang phong thái quý tộc hoàng gia. Hướng dẫn mix áo khoác dạ Tweed dáng ngắn cùng chân váy chữ A & túi xách sang trọng.',
      content: `Chất liệu vải Tweed dệt sợi ánh kim kiêu sa vốn bắt nguồn từ trang phục hoàng gia Châu Âu. Một set đồ Tweed trọn bộ áo khoác ngắn kèm chân váy chữ A chính là bí quyết giúp quý cô biến hóa thành tiểu thư kiêu kỳ chỉ trong 30 giây lên đồ.`
    },
    {
      _id: 'blog4',
      title: 'Cách Phối Chân Váy Xếp Ly Hack Dáng Thon Gọn Cho Mọi Vóc Dáng',
      slug: 'cach-phoi-chan-vay-xep-ly-hack-dang-thon-gon',
      category: 'Cẩm Nang Style',
      author: 'GirlStyle Editorial Team',
      readTime: '4 min read',
      createdAt: '2026-08-04T16:20:00.000Z',
      image: '/products/pleated_midi_dress.jpg',
      summary: 'Chân váy xếp ly dáng midi hay tennis luôn là trợ thủ đắc lực giúp kéo dài đôi chân. Xem ngay gợi ý kết hợp chân váy với áo thun mỏng hoặc cardigan nhẹ.',
      content: `Chân váy xếp ly là món đồ kinh điển có mặt trong tủ đồ của mọi cô gái. Dù bạn có vóc dáng mảnh mai hay tròn trịa, nếp xếp ly thẳng đứng luôn tạo hiệu ứng thị giác giúp đôi chân trông thon dài quyến rũ hơn.`
    }
  ],
  banners: [
    {
      _id: 'b1',
      title: 'BỘ SỰ TẬP NỮ THẦN MÙA HÈ 2026',
      subtitle: 'Rạng rỡ từng khoảnh khắc với các thiết kế đầm lụa cao cấp mới nhất',
      imageUrl: '/products/silk_cocktail_dress.jpg',
      linkUrl: '/products?category=vay-dam',
      order: 1,
      type: 'hero_slide',
      active: true
    },
    {
      _id: 'b2',
      title: 'ELEGANT OFFICE LOOKBOOK',
      subtitle: 'Nâng tầm phong cách công sở trẻ trung & cuốn hút',
      imageUrl: '/products/korean_voile_top.jpg',
      linkUrl: '/products?occasion=Công+sở',
      order: 2,
      type: 'hero_slide',
      active: true
    },
    {
      _id: 'sb1',
      title: 'BIG SALE UP TO 50% OFF',
      subtitle: 'ONLY STORE & ONLINE',
      imageUrl: '',
      linkUrl: '/products?isHot=true',
      order: 1,
      type: 'sub_banner',
      active: true
    },
    {
      _id: 'sb2',
      title: 'FREESHIP TOÀN QUỐC',
      subtitle: 'KHI ĐẶT HÀNG TẠI WEBSITE',
      imageUrl: '',
      linkUrl: '/products',
      order: 2,
      type: 'sub_banner',
      active: true
    }
  ],
  users: [
    {
      _id: 'u_admin',
      name: 'Quản Trị Viên Master',
      phone: '0900000000',
      email: 'admin@girlstyle.com',
      password: 'admin123',
      role: 'admin',
      canWrite: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'u_editor',
      name: 'Biên Tập Viên Linh Chi',
      phone: '0911111111',
      email: 'linhchi.writer@girlstyle.com',
      password: 'writer123',
      role: 'content',
      canWrite: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'u_customer',
      name: 'Nguyễn Thị Ngọc Anh',
      phone: '0988888888',
      email: 'ngocanh@gmail.com',
      password: '123456',
      role: 'customer',
      canWrite: false,
      createdAt: new Date().toISOString()
    }
  ],
  mixMatchCombos: [
    {
      _id: 'mm1',
      title: 'Combo Mix & Match Streetwear 01',
      code: 'COMBO-MM01',
      image: '/products/korean_voile_top.jpg',
      images: [
        '/products/korean_voile_top.jpg',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80',
        '/products/pleated_midi_dress.jpg'
      ],
      items: [
        {
          productId: 'p2',
          name: 'Áo thun nữ Slimfit tay ngắn',
          price: 169000,
          image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
          sizes: ['S', 'M'],
          colors: [
            { name: 'Kem', hex: '#EDE8E2' },
            { name: 'Đen', hex: '#000000' },
            { name: 'Nâu', hex: '#8d6349' },
            { name: 'Xanh', hex: '#2b549a' }
          ]
        },
        {
          productId: 'p8',
          name: 'Chân váy xếp ly tennis',
          price: 199000,
          image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=400&q=80',
          sizes: ['S', 'M', 'L'],
          colors: [
            { name: 'Trắng', hex: '#FFFFFF' },
            { name: 'Vàng', hex: '#e6c843' },
            { name: 'Đen', hex: '#000000' }
          ]
        }
      ]
    }
  ],
  vouchers: [
    { _id: 'v1', code: 'GIRLSTYLE50K', description: 'Giảm 50k cho đơn hàng từ 300k', discountType: 'fixed', discountValue: 50000, minOrderValue: 300000, validUntil: '2026-12-31', active: true },
    { _id: 'v2', code: 'FLASHSALE20', description: 'Giảm 20% tối đa 100k', discountType: 'percent', discountValue: 20, minOrderValue: 500000, maxDiscount: 100000, validUntil: '2026-12-31', active: true },
    { _id: 'v3', code: 'FREESHIP', description: 'Miễn phí giao hàng toàn quốc', discountType: 'fixed', discountValue: 30000, minOrderValue: 400000, validUntil: '2026-12-31', active: true }
  ],
  orders: [],
  feedbacks: [],
  reviews: []
};

// Load persistent data from JSON file if exists
let mockStore = { ...defaultMockStore };
if (fs.existsSync(DATA_FILE_PATH)) {
  try {
    const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    const loaded = JSON.parse(raw);
    mockStore = { ...defaultMockStore, ...loaded };
    if (!mockStore.blogs || mockStore.blogs.length === 0) {
      mockStore.blogs = defaultMockStore.blogs;
    }
    console.log('[Store] Loaded persistent data from data.json file successfully.');
  } catch (err) {
    console.warn('[Store] Could not parse data.json, using default mockStore:', err.message);
  }
}

// Function to save mockStore to data.json whenever modified
const saveStoreToFile = () => {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(mockStore, null, 2), 'utf-8');
    console.log('[Store] Saved updated data to data.json file.');
  } catch (err) {
    console.error('[Store] Error saving store to file:', err.message);
  }
};

let isConnectedDB = false;

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/girlstyle';
    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 50
    });
    console.log(`[DB] MongoDB Connected: ${mongoose.connection.host}`);
    isConnectedDB = true;
    return true;
  } catch (error) {
    console.log('[DB] Local MongoDB not active. Running on high-performance memory + JSON storage engine.');
    isConnectedDB = false;
    return false;
  }
};

module.exports = connectDB;
module.exports.mockStore = mockStore;
module.exports.saveStoreToFile = saveStoreToFile;
module.exports.isDbConnected = () => isConnectedDB;
