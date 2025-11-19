import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import RecruiterLogo from "../models/RecruiterLogo.js";
import { fileURLToPath } from "url";

const router = express.Router();

// Fix dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload folder
const uploadPath = path.join(__dirname, "../uploads/recruiters");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

/* =============================================
   POST - Add Logo
============================================= */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "Upload an image" });

    const newLogo = await RecruiterLogo.create({
      companyName: req.body.companyName,
      imageUrl: `/uploads/recruiters/${req.file.filename}`,
      order: req.body.order || 0,
      isActive: req.body.isActive === "true",
    });

    res.status(201).json({ success: true, message: "Logo added", data: newLogo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =============================================
   GET - All logos
============================================= */
router.get("/", async (req, res) => {
  try {
    const logos = await RecruiterLogo.find().sort({ order: 1 });
    res.json({ success: true, data: logos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =============================================
   PUT - Update Logo
============================================= */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      companyName: req.body.companyName,
      order: req.body.order || 0,
      isActive: req.body.isActive === "true",
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/recruiters/${req.file.filename}`;
    }

    const updated = await RecruiterLogo.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updated)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, message: "Updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =============================================
   DELETE - Remove Logo
============================================= */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await RecruiterLogo.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, message: "Logo deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
