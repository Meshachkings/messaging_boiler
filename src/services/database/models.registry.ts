import mongoose from 'mongoose';
import UserModel from '@/resources/user/user.model';
import ChatModel from '@/resources/chat/chat.model';
import ConversationModel from '@/resources/conversation/conversation.model';

export function registerModels(): void {
    // Register all models here
    mongoose.model('User', UserModel.schema);
    mongoose.model('Chat', ChatModel.schema);
    mongoose.model('Conversation', ConversationModel.schema);
} 