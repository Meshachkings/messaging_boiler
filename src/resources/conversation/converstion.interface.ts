import { Document, ObjectId } from "mongoose";

interface ILastRead {
    userId: string;
    readAt: Date;
}

interface ILastDelivered {
    userId: string;
    deliveredAt: Date;
}

interface IDeleted {
    userId: ObjectId;
    deletedAt: Date;
}

interface IConversation extends Document {
    users: ObjectId[];
    lastRead: ILastRead[];
    lastDelivered: ILastDelivered[];
    deleted: IDeleted[];
}

export { IConversation, ILastRead, ILastDelivered, IDeleted };
