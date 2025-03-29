import HttpException from '@/utils/exceptions/http.exception';
import conversationModel from './conversation.model';
import { userExclude } from '../user/user.enums';
import Joi from 'joi';
import { createConversationSchema } from './conversation.validation';
import mongoose from 'mongoose';

class ConversationService {
    private conversationModel = conversationModel;

    async getConversationById(conversationId: string) {
        try {
            const conversation = await this.conversationModel
                .findOne({ _id: conversationId })
                .populate('users');

            if (!conversation) {
                throw new HttpException(404, 'Conversation not found');
            }

            return conversation;
        } catch (error) {
            throw new HttpException(500, 'Failed to retrieve conversation');
        }
    }

    public async createConversation(userId: any, recipientId: string) {
        const { error } = createConversationSchema.validate({
            userId: userId.toString(),
            recipientId,
        });
        if (error) {
            throw new HttpException(400, error.details[0].message);
        }

        const users = [userId, recipientId];

        try {
            let conversation = await this.conversationModel.findOne({
                users: { $all: users },
            });

            if (!conversation) {
                conversation = await this.conversationModel.create({ users });
            }

            await conversation.populate({
                path: 'users',
                match: { _id: { $ne: userId } },
                select: userExclude,
            });

            return conversation;
        } catch (error) {
            throw new HttpException(500, 'Internal server error');
        }
    }

    public async fetchUserConversations(userId: string): Promise<any[]> {
        try {
            const conversations = await this.conversationModel
                .find({
                    users: { $in: [userId] },
                })
                .populate({
                    path: 'users',
                    match: { _id: { $ne: userId } },
                    select: userExclude,
                })
                .populate({
                    path: 'messages',
                    options: { limit: 1, sort: { createdAt: -1 } },
                })
                .lean();

            return conversations || [];
        } catch (error) {
            console.error('Error in fetchUserConversations:', error);
            throw new HttpException(500, 'Failed to fetch user conversations');
        }
    }

    async markAsRead(userId: string, readAt: Date, conversationId: string) {
        console.log(userId, readAt, conversationId);
        const conversation = await conversationModel.findOne({
            _id: conversationId,
            users: userId,
        });

        if (!conversation) {
            throw new HttpException(
                404,
                'Conversation not found or user not part of the conversation'
            );
        }

        const userIdIndex = conversation.lastRead.findIndex(
            (entry) => entry.userId === userId
        );

        if (userIdIndex !== -1) {
            conversation.lastRead[userIdIndex].readAt = readAt;
        } else {
            conversation.lastRead.push({ userId, readAt });
        }

        await conversation.save();

        return conversation;
    }

    public async lastDelivered(
        userId: string,
        deliveredAt: Date,
        conversationId: string
    ): Promise<any> {
        if (!userId || !deliveredAt || !conversationId) {
            throw new HttpException(400, 'Missing required parameters');
        }

        console.log(conversationId, userId, deliveredAt);

        const conversation = await this.conversationModel.findOne({
            _id: conversationId,
            users: userId,
        });

        if (!conversation) {
            throw new HttpException(404, 'User not part of the conversation');
        }

        const userInLastDelivered = conversation.lastDelivered.some(
            (entry) => entry.userId === userId
        );

        if (userInLastDelivered) {
            const updatedConversation =
                await this.conversationModel.findOneAndUpdate(
                    {
                        _id: conversationId,
                        'lastDelivered.userId': userId,
                    },
                    {
                        $set: {
                            'lastDelivered.$.deliveredAt': deliveredAt,
                        },
                    },
                    { new: true }
                );

            return updatedConversation;
        } else {
            const updatedConversation =
                await this.conversationModel.findOneAndUpdate(
                    {
                        _id: conversationId,
                    },
                    {
                        $push: {
                            lastDelivered: {
                                userId: userId,
                                deliveredAt: deliveredAt,
                            },
                        },
                    },
                    { new: true }
                );

            return updatedConversation;
        }
    }

    public async getConversationByUserId(userId: string, recipientId: string) {
        const conversation = await this.conversationModel.findOne({
            users: { $all: [userId, recipientId] },
        });
        return conversation;
    }
}

export default ConversationService;
