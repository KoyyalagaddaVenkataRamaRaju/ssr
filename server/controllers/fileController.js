import Application from '../models/Application.js';

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const fileBase64 = req.file.buffer.toString('base64');

    const fileObject = {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      data: fileBase64,
      uploadedAt: new Date(),
    };

    return res.status(200).json({
      success: true,
      message: 'File processed successfully',
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

    return res.status(200).json({
      success: true,
      message: 'Files processed successfully',
      files: processedFiles,
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
