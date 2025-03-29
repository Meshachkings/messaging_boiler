import 'module-alias/register';
import 'dotenv/config';
import bootstrap from './app';

bootstrap()
    .then(server => {
        server.listen();
        console.log(`🚀 Server running on port ${server.port}`);
    })
    .catch(error => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
