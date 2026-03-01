import { API_BASE_URL } from '../lib/constants';

/**
 * Utility function to upload an image to Cloudinary via the secure backend API
 * 
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The direct secure URL of the uploaded image
 */
export const uploadImageToCloudinary = async (file) => {
    if (!file) {
        throw new Error('No file provided');
    }

    const token = localStorage.getItem('eduSpaceToken') || sessionStorage.getItem('eduSpaceToken');

    if (!token) {
        throw new Error('Authentication required to upload images');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to upload image. Server returned an error.');
        }

        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error('Error uploading image via API:', error);
        throw error;
    }
};
