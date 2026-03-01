import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/upload.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Memory storage to keep file in memory and send it directly to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.post('/', protect, upload.single('file'), uploadImage);

export default router;
