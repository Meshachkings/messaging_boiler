import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public getUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const user = await this.userService.findUserById(req.params.id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    };
} 