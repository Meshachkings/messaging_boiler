import fs from 'fs/promises';
import path from 'path';
import { StorageProvider } from '../storage.interface';

export default class LocalStorage implements StorageProvider {
    private storagePath: string;

    constructor(config: { path: string }) {
        this.storagePath = config.path;
        fs.mkdir(this.storagePath, { recursive: true });
    }

    async upload(file: Express.Multer.File): Promise<string> {
        const filePath = path.join(this.storagePath, file.filename);
        await fs.writeFile(filePath, file.buffer);
        return filePath;
    }

    async delete(path: string): Promise<void> {
        await fs.unlink(path);
    }
} 