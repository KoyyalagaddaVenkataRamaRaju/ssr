import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import HeroCarousel from '../models/HeroCarousel.js';
import { fileURLToPath } from 'url';

const router = express.Router();

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure folder exists
const heroUploadPath = path.join(__dirname, '../uploads/hero');
if (!fs.existsSync(heroUploadPath)) {
  fs.mkdirSync(heroUploadPath, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, heroUploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// POST — Add Slide
router.post('/slides', upload.single('image'), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: 'Please upload an image' });

    const slide = new HeroCarousel({
      imageUrl: `/uploads/hero/${req.file.filename}`,
      order: parseInt(req.body.order) || 0,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    });

    await slide.save();

    res.status(201).json({ success: true, message: 'Slide added', data: slide });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET — All Slides
router.get('/slides', async (req, res) => {
  try {
    const slides = await HeroCarousel.find().sort({ order: 1 });
    res.json({ success: true, data: slides });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT — Update Slide
router.put('/slides/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      order: parseInt(req.body.order) || 0,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    };

    if (req.file) updateData.imageUrl = `/uploads/hero/${req.file.filename}`;

    const updated = await HeroCarousel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updated)
      return res.status(404).json({ success: false, message: 'Slide not found' });

    res.json({ success: true, message: 'Slide updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE — Slide
router.delete('/slides/:id', async (req, res) => {
  try {
    const deleted = await HeroCarousel.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ success: false, message: 'Slide not found' });

    res.json({ success: true, message: 'Slide deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
