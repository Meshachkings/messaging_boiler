import Controller from '@/utils/interfaces/controller.interface';
import { NextFunction, Router, Request, Response } from 'express';
import { createErrorResponse, createSuccessResponse } from '@/utils/response';
import ConversationService from './conversation.service';
import authenticatedMiddleware from '@/middleware/authenticated.middleware';
import HttpException from '@/utils/exceptions/http.exception';

class ConversationController implements Controller {
    public path = '/conversations';
    public router = Router();
    private conversationService = new ConversationService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.use(authenticatedMiddleware);
        this.router.post('/', this.createConversation);
        this.router.get('/', this.getAllConversations);
        this.router.put('/:id/lastDelivered', this.updateLastDelivered);
        this.router.put('/:id/markAsRead', this.markAsRead);
        this.router.get('/:userId', this.getConversationByUserId);
    }

    private getConversationByUserId = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user.id;
            const { recipientId } = req.body;
            const conversation =
                await this.conversationService.getConversationByUserId(
                    userId,
                    recipientId
                );
            return res.json(
                createSuccessResponse(
                    'Conversation retrieved successfully',
                    200,
                    conversation
                )
            );
        } catch (error: any) {
            console.error(error);
            let err = createErrorResponse(error);
            return res.status(err.status).json(err);
        }
    };

    private createConversation = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user.id;
            const { recipientId } = req.body;
            const conversation =
                await this.conversationService.createConversation(
                    recipientId,
                    userId
                );
            return res
                .status(201)
                .json(
                    createSuccessResponse(
                        'Conversation created successfully',
                        201,
                        conversation
                    )
                );
        } catch (error: any) {
            console.error(error);
            let err = createErrorResponse(error);
            return res.status(err.status).json(err);
        }
    };

    private getAllConversations = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user.id;
            const conversations =
                await this.conversationService.fetchUserConversations(userId);
            return res.json(
                createSuccessResponse(
                    'Conversations retrieved successfully',
                    200,
                    conversations
                )
            );
        } catch (error: any) {
            console.error(error);
            let err = createErrorResponse(error);
            return res.status(err.status).json(err);
        }
    };

    private updateLastDelivered = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const { deliveredAt } = req.body;
            const updatedConversation =
                await this.conversationService.lastDelivered(
                    userId,
                    new Date(deliveredAt),
                    id
                );
            return res.json(
                createSuccessResponse(
                    'Last delivered updated successfully',
                    200,
                    updatedConversation
                )
            );
        } catch (error: any) {
            console.error(error);
            let err = createErrorResponse(error);
            return res.status(err.status).json(err);
        }
    };

    private markAsRead = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const { readAt } = req.body;
            const updatedConversation =
                await this.conversationService.markAsRead(
                    userId,
                    new Date(readAt),
                    id
                );
            return res.json(
                createSuccessResponse(
                    'Conversation marked as read successfully',
                    200,
                    updatedConversation
                )
            );
        } catch (error: any) {
            console.error(error);
            let err = createErrorResponse(error);
            return res.status(err.status).json(err);
        }
    };
}

export default ConversationController;
