import { Schema, model } from 'mongoose';
import { IConversation } from './converstion.interface';

const conversationSchema = new Schema<IConversation>(
    {
        users: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        lastRead: [
            {
                userId: String,
                readAt: Date,
            },
        ],
        lastDelivered: [
            {
                userId: String,
                deliveredAt: Date,
            },
        ],
        deleted: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
                deletedAt: Date,
            },
        ],
    },
    { timestamps: true, toJSON: { virtuals: true } }
);

conversationSchema.virtual('messages', {
    ref: 'Chat',
    localField: '_id',
    foreignField: 'conversationId',
});

const conversationModel = model('Conversation', conversationSchema);

export default conversationModel;
