import { Schema, model, Document } from 'mongoose';
import { IAttachment, IChat } from './chat.interface';

const AttachmentSchema = new Schema<IAttachment>(
    {
        name: { type: String, required: true },
        url: { type: String, required: true },
        size: { type: Number, required: true },
        type: { type: String, required: true },
    },
    { timestamps: true }
);

const chatSchema = new Schema<IChat>(
    {
        conversationId: {
            type: String,
            required: true,
        },
        senderId: {
            type: String,
            required: true,
        },
        text: {
            type: String,
        },
        attachment: AttachmentSchema,
    },
    { timestamps: true }
);

const ChatModel = model<IChat>('Chat', chatSchema);

export default ChatModel;
