interface DatabaseConfig {
    uri?: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    name?: string;
    cluster?: string;
}

interface AuthConfig {
    jwt: {
        secret: string;
        expiresIn?: string;
    };
}

interface StorageConfig {
    provider: 'cloudinary' | 's3' | 'local';
    cloudinary?: {
        cloudName: string;
        apiKey: string;
        apiSecret: string;
        folder?: string;
    };
    s3?: {
        accessKeyId: string;
        secretAccessKey: string;
        bucket: string;
        region: string;
    };
    local?: {
        path: string;
    };
}

interface EmailConfig {
    provider: 'smtp' | 'sendgrid' | 'ses';
    from: string;
    smtp?: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    };
    sendgrid?: {
        apiKey: string;
    };
    ses?: {
        accessKeyId: string;
        secretAccessKey: string;
        region: string;
    };
}

interface Config {
    env: string;
    port: number;
    database: DatabaseConfig;
    auth: AuthConfig;
    storage: StorageConfig;
    email: EmailConfig;
    cors: {
        origin: string | string[];
        credentials: boolean;
    };
}

export default Config;
