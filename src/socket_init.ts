import { Server } from 'socket.io';

function initializeSocket(httpServer: any): Server {
    const io = new Server(httpServer, {
        cors: {
            origin: ['*'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log(`⚡ Socket ${socket.id} connected!`);

        socket.on('disconnect', () => {
            console.log(`🔥 Socket ${socket.id} disconnected`);
        });

        console.log(`🚀 Socket ${socket.id} is now active`);
    });

    return io;
}

export default initializeSocket;
