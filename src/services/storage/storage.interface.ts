export interface StorageProvider {
    upload(file: Express.Multer.File): Promise<string>;
    delete(path: string): Promise<void>;
} 