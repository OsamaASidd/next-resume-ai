import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadImageToStorage(
  base64Image: string
): Promise<string> {
  try {
    const uploadedFile = await cloudinary.uploader.upload(base64Image, {
      folder: 'resume_previews',
      resource_type: 'image'
    });

    if (!uploadedFile?.secure_url) {
      throw new Error('Upload failed');
    }

    return uploadedFile.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
}
