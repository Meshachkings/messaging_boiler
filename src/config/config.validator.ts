import Config from './config.interface';

export function validateConfig(config: Config): void {
    if (!config.auth.jwt.secret) {
        throw new Error('JWT_SECRET is required');
    }
    // Add other validation as needed
} 