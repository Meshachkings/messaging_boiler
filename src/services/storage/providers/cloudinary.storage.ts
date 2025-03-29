import { v2 as cloudinary } from 'cloudinary';
import { StorageProvider } from '../storage.interface';

export default class CloudinaryStorage implements StorageProvider {
    constructor(config: any) {
        cloudinary.config(config);
    }

    async upload(file: Express.Multer.File): Promise<string> {
        const result = await cloudinary.uploader.upload(file.path);
        return result.secure_url;
    }

    async delete(path: string): Promise<void> {
        await cloudinary.uploader.destroy(path);
    }
} 