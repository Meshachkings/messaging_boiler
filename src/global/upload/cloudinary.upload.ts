import cloudinary from './cloudinary.config';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Request } from 'express';


interface CloudinaryParams {
    folder?: string;
    resource_type?: string;
    allowed_formats?: string[];
}



const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'techface',
        resource_type: 'auto',
    } as CloudinaryParams,
});

const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedTypes = [
        'audio/mp3',
        'video/mp4',
        'image/jpeg',
        'image/png',
        'application/pdf',
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type') as unknown as null, false);
    }
};

const uploadToCloud = multer({
    storage,
    // fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
});

export default uploadToCloud;
