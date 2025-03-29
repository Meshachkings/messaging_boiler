import { Document, ObjectId } from "mongoose";

interface IAttachment extends Document {
    name: string;
    url: string;
    size: number;
    type: string;
}

interface IChat extends Document {
    conversationId: string;
    senderId: ObjectId;
    text?: string;
    attachment?: IAttachment;
}

export { IChat, IAttachment };
