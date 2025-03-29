import Config from '@/config/config.interface';
import { StorageProvider } from './storage.interface';

export class StorageFactory {
    static create(config: Config['storage']): StorageProvider {
        switch (config.provider) {
            case 'cloudinary':
                const CloudinaryStorage = require('./providers/cloudinary.storage').default;
                return new CloudinaryStorage(config.cloudinary!);
            case 's3':
                const S3Storage = require('./providers/s3.storage').default;
                return new S3Storage(config.s3!);
            case 'local':
                const LocalStorage = require('./providers/local.storage').default;
                return new LocalStorage(config.local!);
            default:
                throw new Error(`Unsupported storage provider: ${config.provider}`);
        }
    }
} 