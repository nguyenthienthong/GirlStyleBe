const express = require('express');
const router = express.Router();
const SiteConfig = require('../models/SiteConfig');
const { isDbConnected, mockStore } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, config: mockStore.config });
    }
    let config = await SiteConfig.findOne();
    if (!config) {
      config = new SiteConfig();
      await config.save();
    }
    res.json({ success: true, config });
  } catch (error) {
    res.json({ success: true, config: mockStore.config });
  }
});

router.put('/', async (req, res) => {
  try {
    if (!isDbConnected()) {
      Object.assign(mockStore.config, req.body);
      return res.json({ success: true, config: mockStore.config });
    }
    let config = await SiteConfig.findOne();
    if (!config) {
      config = new SiteConfig(req.body);
    } else {
      Object.assign(config, req.body);
    }
    await config.save();
    res.json({ success: true, config });
  } catch (error) {
    Object.assign(mockStore.config, req.body);
    res.json({ success: true, config: mockStore.config });
  }
});

module.exports = router;
