import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Debug
console.log("🌐 Cloudinary ENV Loaded:", {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  API_KEY: process.env.CLOUDINARY_API_KEY,
  API_SECRET: process.env.CLOUDINARY_API_SECRET ? "OK" : "MISSING",
});

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* =========================================================================
   DEFAULT UPLOADER for Recruiter Logos → saves inside folder "recruiters"
========================================================================= */
const recruiterStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "recruiters",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage: recruiterStorage });

/* =========================================================================
   Reusable uploader generator → createUploader("folder_name")
   Example: uploadHero = createUploader("hero_slides")
========================================================================= */
export function createUploader(folderName) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      unique_filename: true,
      resource_type: "image",
    },
  });

  return multer({ storage });
}

export { cloudinary, upload };
