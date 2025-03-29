import Config from './config.interface';

const config: Config = {
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 3000,
    database: {
        uri: process.env.DATABASE_URI,
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
        cloudinary: {
            cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
            apiKey: process.env.CLOUDINARY_API_KEY!,
            apiSecret: process.env.CLOUDINARY_API_SECRET!,
        },
    },
    email: {
        provider: (process.env.EMAIL_PROVIDER as any) || 'smtp',
        from: process.env.EMAIL_FROM!,
        smtp: {
            host: process.env.SMTP_HOST!,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER!,
                pass: process.env.SMTP_PASS!,
            },
        },
    },
    cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || '*',
        credentials: process.env.CORS_CREDENTIALS === 'true',
    },
};

export default config;
