import HttpException from '../../utils/exceptions/http.exception';
import chatModel from './chat.model';
import { createMessageSchema } from './chat.validation';

export default class ChatService {
    private chatModel = chatModel;

    async createMessage(
        senderId: string,
        conversationId: string,
        text: any,
        file?: Express.Multer.File
    ): Promise<any> {
        try {
            const { error, value } = createMessageSchema.validate({
                senderId,
                conversationId,
                text,
                attachment: file,
            });

            if (error) {
                throw new HttpException(400, error.details[0].message);
            }

            const messageData = {
                ...value,
            };

            if (file) {
                messageData.attachment = {
                    name: file.filename,
                    url: file.path,
                    size: file.size,
                    type: file.mimetype,
                };
            }

            const message = await this.chatModel.create(messageData);

            return message;
        } catch (error) {
            throw new HttpException(500, 'Failed to create message');
        }
    }

    async getMessage(conversationId: string, timestamp?: string): Promise<any> {
        try {
            let query: any = { conversationId };

            if (timestamp) {
                query.createdAt = { $lt: new Date(timestamp) };
            }

            const messages = await this.chatModel
                .find(query)
                .sort({ createdAt: -1 })
                .limit(100);

            return messages;
        } catch (error) {
            throw new HttpException(500, 'Failed to retrieve messages');
        }
    }

    async getConversationById(conversationId: string) {
        try {
            const conversation = await this.chatModel.findOne({ 
                conversationId 
            }).populate('users');
            
            if (!conversation) {
                throw new HttpException(404, 'Conversation not found');
            }
            
            return conversation;
        } catch (error) {
            throw new HttpException(500, 'Failed to retrieve conversation');
        }
    }
}
