import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { StorageProvider } from '../storage.interface';

export default class S3Storage implements StorageProvider {
    private client: S3Client;
    private bucket: string;

    constructor(config: any) {
        this.client = new S3Client({
            region: config.region,
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
            },
        });
        this.bucket = config.bucket;
    }

    async upload(file: Express.Multer.File): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: file.filename,
            Body: file.buffer,
        });
        await this.client.send(command);
        return `https://${this.bucket}.s3.amazonaws.com/${file.filename}`;
    }

    async delete(path: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: path,
        });
        await this.client.send(command);
    }
} 