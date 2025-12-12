import Application from '../models/Application.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }
    // ensure uploads/applications directory exists
    const uploadDir = path.join(__dirname, '../uploads/applications');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // create a safe unique filename
    const timestamp = Date.now();
    const safeName = `${timestamp}-${req.file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_')}`;
    const filePath = path.join(uploadDir, safeName);

    // write buffer to disk
    fs.writeFileSync(filePath, req.file.buffer);

    const urlPath = `/uploads/applications/${safeName}`;

    const fileObject = {
      filename: safeName,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: urlPath,
      uploadedAt: new Date(),
    };

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      file: fileObject,
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing file',
      error: error.message,
    });
  }
};

export const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const processedFiles = req.files.map((file) => ({
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      data: file.buffer.toString('base64'),
      uploadedAt: new Date(),
    }));

    // save multiple files to disk and return urls
    const uploadDir = path.join(__dirname, '../uploads/applications');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filesSaved = req.files.map((file) => {
      const timestamp = Date.now() + Math.floor(Math.random() * 1000);
      const safeName = `${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_')}`;
      const filePath = path.join(uploadDir, safeName);
      fs.writeFileSync(filePath, file.buffer);
      return {
        filename: safeName,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `/uploads/applications/${safeName}`,
        uploadedAt: new Date(),
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      files: filesSaved,
    });
  } catch (error) {
    console.error('Error processing files:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing files',
      error: error.message,
    });
  }
};
