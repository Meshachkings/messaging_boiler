import { Server, Socket } from 'socket.io';
import ChatService from './resources/chat/chat.service';
import ConversationService from './resources/conversation/conversation.service';
import { IUser } from './resources/user/user.interface';
import { IChat } from './resources/chat/chat.interface';

const chatService = new ChatService();

interface SocketUser {
    userId: string;
    socketId: string;
}

class ChatManager {
    private io: Server;
    private onlineUsers: Map<string, string[]>;
    private conversationService = new ConversationService();

    constructor(io: Server) {
        this.io = io;
        this.onlineUsers = new Map<string, string[]>();
        this.initialize();
    }

    private initialize(): void {
        this.io.on('connection', (socket: Socket) => {
            console.log(`⚡ Socket ${socket.id} connected!`);
            this.configureSocketEvents(socket);
        });
    }

    private configureSocketEvents(socket: Socket): void {
        console.log('Configuring socket events for socket:', socket.id);

        // Handle user connection
        socket.on('addUser', (data: { userId: string }) => {
            const { userId } = data;
            console.log('addUser event received:', userId);
            this.addUserToOnlineUsers(userId, socket.id);
            this.io.emit(
                'getOnlineUsers',
                Array.from(this.onlineUsers.entries())
            );
        });

        // Handle new message
        socket.on('sendMessage', async (data: IChat) => {
            console.log('sendMessage event received:', data);
            try {
                const conversation =
                    await this.conversationService.getConversationById(
                        data.conversationId
                    );
                const users = conversation.users as unknown as IUser[];
                const recipient = users.find(
                    (user) => String(user._id) !== String(data.senderId)
                );

                if (!recipient) {
                    console.log('No recipient found for message');
                    return;
                }

                const recipientId = String(recipient._id);

                if (this.onlineUsers.has(recipientId)) {
                    const recipientSocketIds =
                        this.onlineUsers.get(recipientId);

                    console.log(
                        `Sending message to recipient ${recipientId} through sockets:`,
                        recipientSocketIds
                    );

                    recipientSocketIds?.forEach((socketId) => {
                        const dataToSend = {
                            ...data,
                            receiverId: recipientId,
                        };
                        this.io.to(socketId).emit('getMessage', dataToSend);
                        console.log(`Message emitted to socket: ${socketId}`);
                    });
                } else {
                    console.log(`Recipient ${recipientId} is not online`);
                }
            } catch (error) {
                console.error('Socket message error:', error);
            }
        });

        // Handle typing status
        socket.on(
            'typing',
            async (data: { conversationId: string; senderId: string }) => {
                console.log('typing event received:', data);
                try {
                    const conversation =
                        await this.conversationService.getConversationById(
                            data.conversationId
                        );

                    const users = conversation.users as unknown as IUser[];

                    const recipient = users.find(
                        (user) => String(user._id) !== data.senderId
                    );

                    if (!recipient) return;

                    const recipientSocketIds = this.onlineUsers.get(
                        String(recipient._id)
                    );

                    console.log('Recipient socket IDs:', recipientSocketIds);

                    if (recipientSocketIds && recipientSocketIds.length) {
                        recipientSocketIds.forEach((socketId) => {
                            console.log(
                                `Emitting userTyping for conversation ${data.conversationId} to socket: ${socketId}`
                            );
                            this.io.to(socketId).emit('userTyping', {
                                conversationId: data.conversationId,
                                senderId: data.senderId,
                            });
                        });
                    }
                } catch (error) {
                    console.error('Socket typing error:', error);
                }
            }
        );

        // Handle stop typing
        socket.on(
            'stopTyping',
            async (data: { conversationId: string; senderId: string }) => {
                console.log('stop typing event received:', data);
                try {
                    const conversation =
                        await this.conversationService.getConversationById(
                            data.conversationId
                        );
                    const users = conversation.users as unknown as IUser[];

                    const recipient = users.find(
                        (user) => String(user._id) !== data.senderId
                    );

                    if (!recipient) return;

                    const recipientSocketIds = this.onlineUsers.get(
                        String(recipient._id)
                    );

                    console.log('Recipient socket IDs:', recipientSocketIds);

                    if (recipientSocketIds) {
                        recipientSocketIds.forEach((socketId) => {
                            console.log(
                                `Emitting userStopTyping for conversation ${data.conversationId} to socket: ${socketId}`
                            );
                            this.io.to(socketId).emit('userStopTyping', {
                                conversationId: data.conversationId,
                                senderId: data.senderId,
                            });
                        });
                    }
                } catch (error) {
                    console.error('Socket stop typing error:', error);
                }
            }
        );

        // Handle disconnection
        socket.on('disconnect', () => {
            this.removeSocketFromUsers(socket.id);
            this.io.emit(
                'getOnlineUsers',
                Array.from(this.onlineUsers.entries())
            );
            console.log(`⚡ Socket ${socket.id} disconnected!`);
        });
    }

    private addUserToOnlineUsers(userId: string, socketId: string): void {
        const existingSocketIds = this.onlineUsers.get(userId) || [];
        if (!existingSocketIds.includes(socketId)) {
            this.onlineUsers.set(userId, [...existingSocketIds, socketId]);
        }

        console.log(
            'Updated online users:',
            Array.from(this.onlineUsers.entries())
        );
    }

    private removeSocketFromUsers(socketId: string): void {
        for (const [userId, socketIds] of this.onlineUsers.entries()) {
            const updatedSocketIds = socketIds.filter((id) => id !== socketId);
            if (updatedSocketIds.length === 0) {
                this.onlineUsers.delete(userId);
            } else {
                this.onlineUsers.set(userId, updatedSocketIds);
            }
        }

        console.log(
            'Updated online users:',
            Array.from(this.onlineUsers.entries())
        );
    }
}

function createChatManager(io: Server): void {
    new ChatManager(io);
}

export default createChatManager;
