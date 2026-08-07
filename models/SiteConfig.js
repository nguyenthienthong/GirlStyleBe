const mongoose = require('mongoose');

const siteConfigSchema = new mongoose.Schema({
  brandName: { type: String, default: 'GirlStyle Fashion' },
  logoUrl: { type: String, default: '/logo.png' },
  hotline: { type: String, default: '1900 6868' },
  address: { type: String, default: '123 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh' },
  
  popupPromo: {
    active: { type: Boolean, default: true },
    title: { type: String, default: 'Chào mừng nàng đến với GirlStyle!' },
    subtitle: { type: String, default: 'Tặng ngay mã giảm 50.000đ cho đơn hàng đầu tiên' },
    code: { type: String, default: 'GIRLSTYLE50K' },
    imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80' },
    delaySeconds: { type: Number, default: 2 }
  },
  
  chatWidget: {
    zaloPhone: { type: String, default: '0901234567' },
    facebookId: { type: String, default: 'girlstyle.fashion' },
    active: { type: Boolean, default: true }
  },
  
  vietqrConfig: {
    bankId: { type: String, default: 'MBBank' },
    accountNo: { type: String, default: '0988889999' },
    accountName: { type: String, default: 'GIRLSTYLE FASHION STORE' }
  },
  
  kiotvietConfig: {
    enabled: { type: Boolean, default: false },
    clientId: { type: String, default: '' },
    clientSecret: { type: String, default: '' },
    retailer: { type: String, default: 'girlstyle' },
    autoSyncStock: { type: Boolean, default: true }
  }
});

module.exports = mongoose.model('SiteConfig', siteConfigSchema);
