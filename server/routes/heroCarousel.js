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

// Ensure upload folder exists
const heroUploadPath = path.join(__dirname, '../uploads/hero');
if (!fs.existsSync(heroUploadPath)) {
  fs.mkdirSync(heroUploadPath, { recursive: true });
  console.log('✅ Created upload folder:', heroUploadPath);
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, heroUploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// POST — Upload Carousel Image
router.post('/slides', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const order = parseInt(req.body.order) || 0;
    const isActive = req.body.isActive === 'true' || req.body.isActive === true;
    const imageUrl = `/uploads/hero/${req.file.filename}`;

    const newSlide = new HeroCarousel({ imageUrl, order, isActive });
    await newSlide.save();

    res.status(201).json({
      success: true,
      message: 'Carousel image uploaded successfully',
      data: newSlide,
    });
  } catch (error) {
    console.error('❌ Error uploading slide:', error);
    res.status(500).json({ success: false, message: 'Error uploading carousel image', error: error.message });
  }
});

// GET — Fetch All Slides
router.get('/slides', async (req, res) => {
  try {
    const slides = await HeroCarousel.find().sort({ order: 1 });
    res.status(200).json({ success: true, data: slides });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching carousel slides', error: error.message });
  }
});

// PUT — Update Carousel Slide (order / isActive / image)
router.put('/slides/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      order: req.body.order ? parseInt(req.body.order) : 0,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/hero/${req.file.filename}`;
    }

    const updatedSlide = await HeroCarousel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedSlide) {
      return res.status(404).json({ success: false, message: 'Slide not found' });
    }

    res.status(200).json({ success: true, message: 'Slide updated successfully', data: updatedSlide });
  } catch (error) {
    console.error('❌ Error updating slide:', error);
    res.status(500).json({ success: false, message: 'Error updating slide', error: error.message });
  }
});


// DELETE — Remove a Slide
router.delete('/slides/:id', async (req, res) => {
  try {
    const deleted = await HeroCarousel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Slide not found' });

    res.status(200).json({ success: true, message: 'Slide deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting slide', error: error.message });
  }
});

export default router;
