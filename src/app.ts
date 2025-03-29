import ErrorMiddleware from './middleware/error.middleware';
import Controller from '@/utils/interfaces/controller.interface';
import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import { createServer } from 'http';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { Server } from 'socket.io';
import config from './config/config';
import createChatManager from './socket';
import { loadConfig } from './config/config.loader';
import { StorageFactory } from './services/storage/storage.factory';
import { EmailFactory } from './services/email/email.factory';
import { DatabaseService } from '@/services/database/database.service';
import ConversationController from '@/resources/conversation/conversation.controller';
import ChatController from '@/resources/chat/chat.controller';

class App {
    public express: Application;
    public port: number;
    private server: ReturnType<typeof createServer>;
    private io: Server;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;
        this.server = createServer(this.express);
        this.io = new Server(this.server, {
            cors: {
                origin: '*',
                credentials: true,
            },
            transports: ['websocket', 'polling'],
        });
        this.initialiseDatabaseConnection();
        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        this.initialiseErrorHandling();
        this.initialiseSocketIO();
        this.createServer();
    }

    private initialiseMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
    }

    private initialiseControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use(`/api/v1${controller.path}`, controller.router);
        });
    }

    private initialiseErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }

    private initialiseDatabaseConnection(): void {
        const config = loadConfig();
        const { database, env } = config;

        let mongoURI: string;

        if (env === 'production') {
            mongoURI = `mongodb+srv://${database.username}:${database.password}@${database.cluster}/${database.name}?retryWrites=true&w=majority`;
        } else {
            mongoURI = database.uri as string;
        }

        mongoose
            .connect(mongoURI)
            .then(() => {
                console.log('🟢 MongoDB connection established successfully');
            })
            .catch((err) => {
                console.error('🔴 MongoDB connection error:', err);
                process.exit(1);
            });
    }

    private initialiseSocketIO(): void {
        createChatManager(this.io);
    }

    private createServer(): void {
        this.io.on('connection', (socket) => {
            console.log(`⚡ Socket ${socket.id} connected!`);
        });
    }

    public listen(): void {
        this.server.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

async function bootstrap() {
    const config = loadConfig();
    
    // Initialize database
    try {
        await DatabaseService.getInstance().connect(config.database);
    } catch (error) {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    }
    
    // Initialize services
    const storageProvider = StorageFactory.create(config.storage);
    const emailProvider = EmailFactory.create(config.email);
    
    // Create server
    const app = new App(
        [
            new ConversationController(),
            new ChatController(),
        ],
        config.port
    );
    
    return app;
}

export default bootstrap;
