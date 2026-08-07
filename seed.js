const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Banner = require('./models/Banner');
const Feedback = require('./models/Feedback');
const Review = require('./models/Review');
const Voucher = require('./models/Voucher');
const Blog = require('./models/Blog');
const SiteConfig = require('./models/SiteConfig');

const seedData = async () => {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      console.log('[Seed] Cannot seed because DB is not connected. Skipping.');
      process.exit(0);
    }

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Banner.deleteMany({});
    await Feedback.deleteMany({});
    await Review.deleteMany({});
    await Voucher.deleteMany({});
    await Blog.deleteMany({});
    await SiteConfig.deleteMany({});

    console.log('[Seed] Seeding Site Config...');
    const config = new SiteConfig({
      brandName: 'GirlStyle Fashion',
      logoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      hotline: '1900 6868',
      popupPromo: {
        active: true,
        title: 'Chào mừng nàng đến với GirlStyle! ✨',
        subtitle: 'Nhập mã GIRLSTYLE50K để nhận ngay voucher giảm 50.000đ cho đơn hàng đầu tiên.',
        code: 'GIRLSTYLE50K',
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
        delaySeconds: 2
      },
      chatWidget: {
        zaloPhone: '0901234567',
        facebookId: 'girlstyle.fashion',
        active: true
      },
      vietqrConfig: {
        bankId: 'MBBank',
        accountNo: '0988889999',
        accountName: 'GIRLSTYLE FASHION STORE'
      }
    });
    await config.save();

    console.log('[Seed] Seeding Users...');
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      name: 'Quản trị viên GirlStyle',
      phone: '0988889999',
      email: 'admin@girlstyle.vn',
      password: hashedAdminPassword,
      role: 'admin'
    });
    await adminUser.save();

    const salesUser = new User({
      name: 'Nhân viên Bán hàng',
      phone: '0977778888',
      email: 'sales@girlstyle.vn',
      password: await bcrypt.hash('sales123', 10),
      role: 'sales'
    });
    await salesUser.save();

    const sampleCustomer = new User({
      name: 'Nguyễn Thị Ngọc Anh',
      phone: '0912345678',
      email: 'ngocanh@gmail.com',
      password: await bcrypt.hash('customer123', 10),
      role: 'customer',
      address: {
        street: '45 Lê Lợi, Q.1',
        city: 'TP. Hồ Chí Minh'
      }
    });
    await sampleCustomer.save();

    console.log('[Seed] Seeding Categories...');
    const categories = await Category.insertMany([
      { name: 'Váy / Đầm', slug: 'vay-dam', description: 'Đầm xòe, đầm ôm body, váy hoa nhí đi tiệc & dạo phố', order: 1, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80' },
      { name: 'Áo Thời Trang', slug: 'ao', description: 'Áo sơ mi công sở, áo kiểu lụa, cardigan dệt kim', order: 2, image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=400&q=80' },
      { name: 'Quần & Chân Váy', slug: 'quan-vay', description: 'Quần tây hack dáng, chân váy xếp ly, chân váy chữ A', order: 3, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=400&q=80' },
      { name: 'Set Đồ Outfit', slug: 'set-do', description: 'Set tweed tiểu thư, set công sở sang trọng, set dạo phố năng động', order: 4, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80' }
    ]);

    console.log('[Seed] Seeding Products...');
    const p1 = new Product({
      name: 'Đầm Lụa Tơ Tằm Cổ V Tôn Dáng - Rose Silk Dress',
      code: 'GS-D01',
      category: 'Váy / Đầm',
      categoryId: categories[0]._id,
      price: 650000,
      salePrice: 499000,
      occasion: 'Đi tiệc',
      material: 'Lụa tơ tằm cao cấp, mềm mịn không nhăn',
      careGuide: 'Giặt tay nhẹ nhàng bằng sữa tắm hoặc dầu gội, phơi nơi râm mát.',
      sizeChartType: 'dress',
      isHot: true,
      isNewArrival: true,
      colors: [
        {
          colorName: 'Hồng Pastel',
          hex: '#FFC0CB',
          mainImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
          images: [
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'
          ]
        },
        {
          colorName: 'Trắng Kem',
          hex: '#FFFDD0',
          mainImage: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
          images: [
            'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'
          ]
        },
        {
          colorName: 'Đen Tuyển',
          hex: '#111111',
          mainImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
          images: [
            'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'
          ]
        }
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      inventory: [
        { colorName: 'Hồng Pastel', size: 'S', stock: 15 },
        { colorName: 'Hồng Pastel', size: 'M', stock: 20 },
        { colorName: 'Trắng Kem', size: 'S', stock: 10 },
        { colorName: 'Đen Tuyển', size: 'M', stock: 8 }
      ],
      description: 'Thiết kế cổ V quyến rũ kết hợp chất lụa rủ tự nhiên tôn lên nét quyến rũ quý phái cho các nàng trong mọi buổi tiệc.'
    });
    await p1.save();

    const p2 = new Product({
      name: 'Áo Kiểu Voan Tơ Cổ Nơ Hàn Quốc - Pearl Voile Top',
      code: 'GS-A02',
      category: 'Áo Thời Trang',
      categoryId: categories[1]._id,
      price: 380000,
      salePrice: 295000,
      occasion: 'Công sở',
      material: 'Voan tơ mỏng nhẹ kèm áo lót hai dây mềm',
      careGuide: 'Nên cho vào túi giặt nếu giặt máy.',
      sizeChartType: 'top',
      isHot: true,
      colors: [
        {
          colorName: 'Trắng Ngọc Trai',
          hex: '#F0F8FF',
          mainImage: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80',
          images: ['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80']
        },
        {
          colorName: 'Xanh Mint',
          hex: '#98FF98',
          mainImage: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80',
          images: ['https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80']
        }
      ],
      sizes: ['S', 'M', 'L'],
      description: 'Mẫu áo voan thanh lịch phối nơ thắt duyên dáng, cực xinh khi mix cùng chân váy hoặc quần tây dáng suông.'
    });
    await p2.save();

    const p3 = new Product({
      name: 'Set Tweed Sang Chảnh Tiểu Thư - Luxe Tweed Set',
      code: 'GS-S03',
      category: 'Set Đồ Outfit',
      categoryId: categories[3]._id,
      price: 890000,
      salePrice: 750000,
      occasion: 'Đi tiệc',
      material: 'Dạ Tweed dệt sợi ánh kim cao cấp có lót lụa',
      sizeChartType: 'dress',
      isHot: true,
      isAiGenerated: true, // Feature 3.5 AI Try-on demo product
      mixMatchProductIds: [p2._id], // Feature 3.4 Mix & Match tie
      colors: [
        {
          colorName: 'Hồng Ánh Kim',
          hex: '#FFD1DC',
          mainImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
          images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80']
        }
      ],
      sizes: ['S', 'M', 'L'],
      description: 'Set áo khoác dạ dáng ngắn đi kèm chân váy chữ A kiêu kỳ, mang chuẩn thần thái tiểu thư kiêu sa.'
    });
    await p3.save();

    // Attach mix-match back to p1
    p1.mixMatchProductIds = [p2._id, p3._id];
    await p1.save();

    console.log('[Seed] Seeding Banners & Lookbook...');
    await Banner.insertMany([
      {
        title: 'BỘ SỰ TẬP NỮ THẦN MÙA HÈ 2026',
        subtitle: 'Rạng rỡ từng khoảnh khắc với các thiết kế đầm lụa cao cấp mới nhất',
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
        linkUrl: '/products?category=vay-dam',
        order: 1,
        type: 'hero_slide'
      },
      {
        title: 'ELEGANT OFFICE LOOKBOOK',
        subtitle: 'Nâng tầm phong cách công sở trẻ trung & cuốn hút',
        imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80',
        linkUrl: '/products?occasion=Công+sở',
        order: 2,
        type: 'hero_slide'
      }
    ]);

    console.log('[Seed] Seeding Vouchers...');
    await Voucher.insertMany([
      { code: 'GIRLSTYLE50K', description: 'Giảm 50k cho đơn hàng từ 300k', discountType: 'fixed', discountValue: 50000, minOrderValue: 300000, validUntil: new Date('2026-12-31') },
      { code: 'FLASHSALE20', description: 'Giảm 20% tối đa 100k', discountType: 'percent', discountValue: 20, minOrderValue: 500000, maxDiscount: 100000, validUntil: new Date('2026-12-31') },
      { code: 'FREESHIP', description: 'Miễn phí giao hàng toàn quốc', discountType: 'fixed', discountValue: 30000, minOrderValue: 400000, validUntil: new Date('2026-12-31') }
    ]);

    console.log('[Seed] Seeding Reviews...');
    await Review.insertMany([
      {
        product: p1._id,
        customerName: 'Minh Thùy',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        content: 'Đầm lụa mặc êm da lắm mọi người ơi, đợt này đi tiệc mặc ai cũng khen hết trơn. Sẽ ủng hộ shop nhiều hơn!',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80',
        verifiedPurchase: true
      },
      {
        product: p3._id,
        customerName: 'Phương Anh',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        content: 'Set dạ tweed siêu xịn mịn, vải chuẩn xịn không hề xơ hay ngứa. Đóng gói cẩn thận có thơm nức mùi nước hoa.',
        verifiedPurchase: true
      }
    ]);

    console.log('[Seed] Seeding Customer Feedbacks...');
    await Feedback.insertMany([
      {
        customerName: 'Trần Thanh Hằng',
        phone: '0909112233',
        email: 'hangtran@gmail.com',
        type: 'gop_y',
        message: 'Shop nên có thêm nhiều size XL cho các bạn mũm mĩm xíu nha! Mẫu váy xinh lắm.',
        status: 'processing',
        adminReply: 'Dạ GirlStyle cảm ơn phản hồi của bạn! Bên mình sẽ bổ sung thêm bảng size rộng rãi cho đợt hàng mới tới ạ.'
      }
    ]);

    console.log('[Seed] Seeding Blogs...');
    await Blog.insertMany([
      {
        title: 'Công Thức Phối Đồ Công Sở Trẻ Trung Hack Tuổi Cho Quý Cô Hiện Đại',
        slug: 'cong-thuc-phoi-do-cong-so-hack-tuoi',
        excerpt: 'Chỉ với những item đơn giản như áo voan tơ và chân váy suông, bạn đã có ngay một diện mạo đầy thần thái...',
        coverImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
        author: 'GirlStyle Stylist Team',
        taggedProducts: [p1._id, p2._id],
        content: `Môi trường công sở hiện đại không còn gò bó trong những bộ đồng phục cứng nhắc. Với bộ sưu tập mới của GirlStyle...`
      }
    ]);

    console.log('\n✅ [Seed Completed Successfully!]');
    console.log('--------------------------------------------------');
    console.log('Admin Account credentials:');
    console.log('Email: admin@girlstyle.vn');
    console.log('Phone: 0988889999');
    console.log('Password: admin123');
    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
