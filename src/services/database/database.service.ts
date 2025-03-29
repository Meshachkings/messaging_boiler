import mongoose from 'mongoose';
import Config from '@/config/config.interface';
import { registerModels } from './models.registry';

export class DatabaseService {
    private static instance: DatabaseService;
    private isConnected: boolean = false;

    private constructor() {
        // Register models when service is instantiated
        registerModels();
    }

    static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    async connect(config: Config['database']): Promise<void> {
        if (this.isConnected) {
            return;
        }

        try {
            const uri = this.buildConnectionString(config);
            await mongoose.connect(uri);
            this.isConnected = true;
            console.log('🟢 Database connection established successfully');
        } catch (error) {
            console.error('🔴 Database connection error:', error);
            throw error;
        }
    }

    private buildConnectionString(config: Config['database']): string {
        if (config.uri) {
            return config.uri;
        }

        const { username, password, host, port, name, cluster } = config;

        if (cluster) {
            return `mongodb+srv://${username}:${password}@${cluster}/${name}?retryWrites=true&w=majority`;
        }

        const auth = username && password ? `${username}:${password}@` : '';
        const portString = port ? `:${port}` : '';
        return `mongodb://${auth}${host}${portString}/${name}`;
    }

    getModel<T>(name: string) {
        return mongoose.model<T>(name);
    }

    async disconnect(): Promise<void> {
        if (this.isConnected) {
            await mongoose.disconnect();
            this.isConnected = false;
        }
    }
} 