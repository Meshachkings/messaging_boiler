import Config from './config.interface';
import { validateConfig } from './config.validator';

export function loadConfig(): Config {
    const config: Config = {
        env: process.env.NODE_ENV || 'development',
        port: Number(process.env.PORT) || 3000,
        database: {
            uri: process.env.DATABASE_URI,
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            name: process.env.DATABASE_NAME,
            cluster: process.env.DATABASE_CLUSTER,
        },
        auth: {
            jwt: {
                secret: process.env.JWT_SECRET!,
                expiresIn: process.env.JWT_EXPIRES_IN || '1d',
            },
        },
        storage: {
            provider: (process.env.STORAGE_PROVIDER as any) || 'local',
            cloudinary: process.env.STORAGE_PROVIDER === 'cloudinary' ? {
                cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
                apiKey: process.env.CLOUDINARY_API_KEY!,
                apiSecret: process.env.CLOUDINARY_API_SECRET!,
                folder: process.env.CLOUDINARY_FOLDER,
            } : undefined,
            s3: process.env.STORAGE_PROVIDER === 's3' ? {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
                bucket: process.env.AWS_S3_BUCKET!,
                region: process.env.AWS_REGION!,
            } : undefined,
            local: process.env.STORAGE_PROVIDER === 'local' ? {
                path: process.env.LOCAL_STORAGE_PATH || './uploads',
            } : undefined,
        },
        email: {
            provider: (process.env.EMAIL_PROVIDER as any) || 'smtp',
            from: process.env.EMAIL_FROM!,
            smtp: process.env.EMAIL_PROVIDER === 'smtp' ? {
                host: process.env.SMTP_HOST!,
                port: Number(process.env.SMTP_PORT),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER!,
                    pass: process.env.SMTP_PASS!,
                },
            } : undefined,
            sendgrid: process.env.EMAIL_PROVIDER === 'sendgrid' ? {
                apiKey: process.env.SENDGRID_API_KEY!,
            } : undefined,
        },
        cors: {
            origin: process.env.CORS_ORIGIN?.split(',') || '*',
            credentials: process.env.CORS_CREDENTIALS === 'true',
        },
    };

    validateConfig(config);
    return config;
} 