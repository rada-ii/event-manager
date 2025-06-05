import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
// @ts-ignore - No types available for multer-storage-cloudinary
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Request } from "express";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Allowed image types
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "event-manager", // Folder name in Cloudinary
    allowed_formats: ["jpeg", "jpg", "png", "gif", "webp"],
    transformation: [
      { width: 800, height: 600, crop: "limit" }, // Resize images
      { quality: "auto" }, // Auto optimize quality
    ],
    public_id: (req: Request, file: Express.Multer.File) => {
      // Generate unique filename
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return `event-${uniqueSuffix}`;
    },
  } as any,
});

// File filter function
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(`Invalid file type. Allowed types: ${ALLOWED_TYPES.join(", ")}`)
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

// Error handler for multer errors
export const handleUploadError = (
  error: any,
  req: Request,
  res: any,
  next: any
) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File too large",
        message: `Maximum file size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      });
    }
  }

  if (error.message.includes("Invalid file type")) {
    return res.status(400).json({
      error: "Invalid file type",
      message: error.message,
    });
  }

  console.error("Upload error:", error);
  return res.status(500).json({
    error: "Upload failed",
    message: "Something went wrong during file upload",
  });
};

// Helper function to delete image from Cloudinary
export const deleteCloudinaryImage = async (
  publicId: string
): Promise<void> => {
  try {
    if (publicId && publicId !== "default.jpg") {
      await cloudinary.uploader.destroy(publicId);
      console.log(`✅ Deleted image from Cloudinary: ${publicId}`);
    }
  } catch (error) {
    console.error(
      `❌ Failed to delete image from Cloudinary: ${publicId}`,
      error
    );
  }
};
