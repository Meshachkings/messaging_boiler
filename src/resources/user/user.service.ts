import { UserRepository } from './user.repository';
import { IUser } from './user.interface';
import HttpException from '@/utils/exceptions/http.exception';

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async findUserById(id: string): Promise<IUser> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new HttpException(404, 'User not found');
        }
        return user;
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        return this.userRepository.findByEmail(email);
    }

    // Other service methods
} 