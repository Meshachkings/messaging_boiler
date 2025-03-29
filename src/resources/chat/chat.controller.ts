import Controller from '@/utils/interfaces/controller.interface';
import { NextFunction, Router, Request, Response } from 'express';
import { createErrorResponse, createSuccessResponse } from '@/utils/response';
import ChatService from './chat.service';
import authenticatedMiddleware from '@/middleware/authenticated.middleware';
import uploadToCloud from '@/global/upload/cloudinary.upload';

class ChatController implements Controller {
    public path = '/chats';
    public router = Router();
    private chatService = new ChatService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.use(authenticatedMiddleware);
        this.router.post(
            '/:conversationId/messages',
            uploadToCloud.single('file'),
            this.createMessage
        );
        this.router.get('/:conversationId/messages', this.getMessages);
    }

    private createMessage = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user.id;
            const { conversationId } = req.params;
            const { text } = req.body;
            
            const message = await this.chatService.createMessage(
                userId,
                conversationId,
                text,
                req.file
            );

            return res
                .status(201)
                .json(
                    createSuccessResponse(
                        'Message created successfully',
                        201,
                        message
                    )
                );
        } catch (error: any) {
            console.error('Error in createMessage:', error);
            let err = createErrorResponse(error);
            return res.status(err.status).json(err);
        }
    };

    private getMessages = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { conversationId } = req.params;
            const { timestamp } = req.query;
            const messages = await this.chatService.getMessage(
                conversationId,
                timestamp as string | undefined
            );
            return res.json(
                createSuccessResponse(
                    'Messages retrieved successfully',
                    200,
                    messages
                )
            );
        } catch (error: any) {
            console.error(error);
            let err = createErrorResponse(error);
            return res.status(err.status).json(err);
        }
    };
}

export default ChatController;
