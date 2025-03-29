import User from '@/resources/user/interfaces/user.interface';

declare global {
    namespace Express {
        export interface Request {
            user: User;
        }
    }
}
