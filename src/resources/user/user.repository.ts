import { BaseRepository } from '@/services/database/base.repository';
import { IUser } from './user.interface';

export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super('User');
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return this.findOne({ email });
    }

    // Add other user-specific methods here
} 