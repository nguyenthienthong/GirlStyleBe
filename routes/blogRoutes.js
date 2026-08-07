const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { isDbConnected, mockStore, saveStoreToFile } = require('../config/db');

// Get All Blogs
router.get('/', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, blogs: mockStore.blogs });
    }
    const blogs = await Blog.find().populate('taggedProducts').sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: true, blogs: mockStore.blogs });
  }
});

// Get Blog by Slug or ID
router.get('/:slug', async (req, res) => {
  try {
    if (!isDbConnected()) {
      const b = mockStore.blogs.find(bl => bl.slug === req.params.slug || bl._id === req.params.slug) || mockStore.blogs[0];
      return res.json({ success: true, blog: b });
    }
    const blog = await Blog.findOne({ $or: [{ slug: req.params.slug }, { _id: req.params.slug }] }).populate('taggedProducts');
    res.json({ success: true, blog: blog || mockStore.blogs[0] });
  } catch (error) {
    res.json({ success: true, blog: mockStore.blogs[0] });
  }
});

// Create Blog Article (Admin & Writers)
router.post('/', async (req, res) => {
  try {
    const { title, slug, category, author, readTime, image, summary, content } = req.body;
    
    if (!isDbConnected()) {
      const newBlog = {
        _id: 'blog_' + Date.now(),
        title: title || 'Bài Viết Thời Trang Mới',
        slug: slug || ('bai-viet-' + Date.now()),
        category: category || 'Mẹo Phối Đồ',
        author: author || 'Biên Tập Viên GirlStyle',
        readTime: readTime || '4 min read',
        createdAt: new Date().toISOString(),
        image: image || '/products/silk_cocktail_dress.jpg',
        summary: summary || '',
        content: content || ''
      };
      mockStore.blogs.unshift(newBlog);
      saveStoreToFile();
      return res.status(201).json({ success: true, blog: newBlog, message: 'Đã xuất bản bài viết thành công!' });
    }

    const newBlog = new Blog({
      title,
      slug: slug || ('bai-viet-' + Date.now()),
      category,
      author,
      readTime,
      image,
      summary,
      content
    });
    await newBlog.save();
    res.status(201).json({ success: true, blog: newBlog, message: 'Đã xuất bản bài viết thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Blog Article
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isDbConnected()) {
      const idx = mockStore.blogs.findIndex(b => b._id === id);
      if (idx !== -1) {
        mockStore.blogs[idx] = { ...mockStore.blogs[idx], ...req.body };
        saveStoreToFile();
        return res.json({ success: true, blog: mockStore.blogs[idx], message: 'Đã cập nhật bài viết thành công!' });
      }
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }

    const updated = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, blog: updated, message: 'Đã cập nhật bài viết thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete Blog Article
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isDbConnected()) {
      mockStore.blogs = mockStore.blogs.filter(b => b._id !== id);
      saveStoreToFile();
      return res.json({ success: true, message: 'Đã xóa bài viết' });
    }
    await Blog.findByIdAndDelete(id);
    res.json({ success: true, message: 'Đã xóa bài viết' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
