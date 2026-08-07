const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { isDbConnected, mockStore, saveStoreToFile } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'girlstyle_secret_key_2026';

// 1. Quick Auth (Phone only)
router.post('/quick-auth', async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Số điện thoại là bắt buộc' });
    }

    if (!isDbConnected()) {
      let user = mockStore.users.find(u => u.phone === phone);
      if (!user) {
        user = {
          _id: 'u_' + Date.now(),
          name: name || `Khách hàng ${phone.slice(-4)}`,
          phone,
          email: email || '',
          role: 'customer',
          canWrite: false,
          autoCreated: true,
          createdAt: new Date().toISOString()
        };
        mockStore.users.push(user);
        saveStoreToFile();
      }

      const token = jwt.sign({ id: user._id, role: user.role, canWrite: user.canWrite, phone: user.phone }, JWT_SECRET, { expiresIn: '30d' });
      return res.json({ success: true, user, token });
    }

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({
        name: name || `Khách hàng ${phone.slice(-4)}`,
        phone,
        email: email || '',
        autoCreated: true,
        address: { street: address || '' }
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id, role: user.role, canWrite: user.canWrite, phone: user.phone }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, user, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Standard Register
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    if (!isDbConnected()) {
      let existingUser = mockStore.users.find(u => u.phone === phone);
      if (existingUser && !existingUser.autoCreated) {
        return res.status(400).json({ success: false, message: 'Số điện thoại này đã được đăng ký' });
      }

      const newUser = {
        _id: 'u_' + Date.now(),
        name,
        phone,
        email: email || '',
        password: password || '123456',
        role: 'customer',
        canWrite: false,
        autoCreated: false,
        createdAt: new Date().toISOString()
      };
      mockStore.users.push(newUser);
      saveStoreToFile();

      const token = jwt.sign({ id: newUser._id, role: newUser.role, canWrite: newUser.canWrite, phone: newUser.phone }, JWT_SECRET, { expiresIn: '30d' });
      return res.json({ success: true, user: newUser, token });
    }

    let existingUser = await User.findOne({ phone });
    if (existingUser && !existingUser.autoCreated) {
      return res.status(400).json({ success: false, message: 'Số điện thoại này đã được đăng ký' });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : '';
    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      role: 'customer',
      canWrite: false
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role, canWrite: newUser.canWrite, phone: newUser.phone }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, user: newUser, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. User Login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!isDbConnected()) {
      const user = mockStore.users.find(u => u.phone === phone || u.email === phone);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại' });
      }
      if (user.password && user.password !== password) {
        return res.status(400).json({ success: false, message: 'Mật khẩu không chính xác' });
      }

      const token = jwt.sign({ id: user._id, role: user.role, canWrite: user.canWrite, phone: user.phone }, JWT_SECRET, { expiresIn: '30d' });
      return res.json({ success: true, user, token });
    }

    const user = await User.findOne({ $or: [{ phone }, { email: phone }] });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại' });
    }

    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch && password !== user.password) {
        return res.status(400).json({ success: false, message: 'Mật khẩu không chính xác' });
      }
    }

    const token = jwt.sign({ id: user._id, role: user.role, canWrite: user.canWrite, phone: user.phone }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, user, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. ADMIN SPECIFIC LOGIN
router.post('/admin-login', async (req, res) => {
  try {
    const { account, password } = req.body; // Phone or Email
    if (!account || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tài khoản và mật khẩu!' });
    }

    if (!isDbConnected()) {
      const user = mockStore.users.find(u => u.phone === account || u.email === account);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Tài khoản Quản trị không tồn tại!' });
      }
      if (user.password !== password) {
        return res.status(400).json({ success: false, message: 'Mật khẩu truy cập Admin sai!' });
      }
      if (user.role !== 'admin' && user.role !== 'content' && user.role !== 'sales' && !user.canWrite) {
        return res.status(403).json({ success: false, message: 'Tài khoản của bạn chưa được cấp quyền truy cập Quản trị!' });
      }

      const token = jwt.sign({ id: user._id, role: user.role, canWrite: user.canWrite, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        success: true,
        message: 'Đăng nhập Quản trị thành công!',
        token,
        user
      });
    }

    const user = await User.findOne({ $or: [{ phone: account }, { email: account }] });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Tài khoản Quản trị không tồn tại!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && password !== user.password) {
      return res.status(400).json({ success: false, message: 'Mật khẩu truy cập Admin sai!' });
    }

    if (user.role !== 'admin' && user.role !== 'content' && user.role !== 'sales' && !user.canWrite) {
      return res.status(403).json({ success: false, message: 'Tài khoản của bạn chưa được cấp quyền truy cập Quản trị!' });
    }

    const token = jwt.sign({ id: user._id, role: user.role, canWrite: user.canWrite, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      success: true,
      message: 'Đăng nhập Quản trị thành công!',
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. GET Users List (Admin only)
router.get('/users', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, users: mockStore.users });
    }
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    if (!isDbConnected()) {
      return res.json({ success: true, users: mockStore.users });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. CREATE User / Staff Account & Assign Permissions (Admin only)
router.post('/users', async (req, res) => {
  try {
    const { name, phone, email, password, role, canWrite } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Tên và Số điện thoại là bắt buộc!' });
    }

    if (!isDbConnected()) {
      const existing = mockStore.users.find(u => u.phone === phone);
      if (existing) {
        return res.status(400).json({ success: false, message: 'Số điện thoại này đã được sử dụng!' });
      }

      const newUser = {
        _id: 'u_' + Date.now(),
        name,
        phone,
        email: email || '',
        password: password || '123456',
        role: role || 'content',
        canWrite: canWrite !== undefined ? canWrite : true,
        autoCreated: false,
        createdAt: new Date().toISOString()
      };
      mockStore.users.push(newUser);
      saveStoreToFile();
      return res.status(201).json({ success: true, user: newUser, message: 'Đã tạo tài khoản và phân quyền thành công!' });
    }

    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Số điện thoại này đã được sử dụng!' });
    }

    const hashedPassword = await bcrypt.hash(password || '123456', 10);
    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      role: role || 'content',
      canWrite: canWrite !== undefined ? canWrite : true
    });
    await newUser.save();

    res.status(201).json({ success: true, user: newUser, message: 'Đã tạo tài khoản và phân quyền thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 7. UPDATE User Permissions / Role & canWrite (Admin only)
router.put('/users/:id/permissions', async (req, res) => {
  try {
    const { id } = req.params;
    const { role, canWrite } = req.body;

    if (!isDbConnected()) {
      const idx = mockStore.users.findIndex(u => u._id === id);
      if (idx !== -1) {
        if (role) mockStore.users[idx].role = role;
        if (canWrite !== undefined) mockStore.users[idx].canWrite = canWrite;
        saveStoreToFile();
        return res.json({ success: true, user: mockStore.users[idx], message: 'Đã cập nhật quyền truy cập user thành công!' });
      }
      return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    }

    if (role) user.role = role;
    if (canWrite !== undefined) user.canWrite = canWrite;
    await user.save();

    res.json({ success: true, user, message: 'Đã cập nhật quyền truy cập user thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 8. DELETE User Account (Admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isDbConnected()) {
      mockStore.users = mockStore.users.filter(u => u._id !== id);
      saveStoreToFile();
      return res.json({ success: true, message: 'Đã xóa tài khoản user' });
    }
    await User.findByIdAndDelete(id);
    res.json({ success: true, message: 'Đã xóa tài khoản user' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
