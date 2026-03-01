import cloudinary from '../config/cloudinary.js';

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private (Logged in users only)
export const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        // Convert buffer to base64
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'eduspace',
            resource_type: 'auto',
        });

        res.status(200).json({
            success: true,
            url: result.secure_url
        });
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload image'
        });
    }
};
