import { Request, Response, NextFunction } from 'express';
import { Encode } from '@/global/providers/encode/index';
import Token from '@/utils/interfaces/token.interface';
import HttpException from '@/utils/exceptions/http.exception';
import jwt from 'jsonwebtoken';
import { UserService } from '@/resources/user/user.service';

const userService = new UserService();

const encode = new Encode();
async function authenticatedMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return next(new HttpException(401, 'Unauthorised'));
    }

    const accessToken = bearer.split('Bearer ')[1].trim();

    try {
        const payload: Token | jwt.JsonWebTokenError =
            await encode.verify(accessToken);

        if (payload instanceof jwt.JsonWebTokenError) {
            return next(new HttpException(401, 'Unauthorised'));
        }

        const user = await userService.findUserById(payload._id.toString());

        if (!user) {
            return next(new HttpException(401, 'Unauthorised'));
        }

        req.user = user;

        return next();
    } catch (error) {
        return next(new HttpException(401, 'Unauthorised'));
    }
}

export default authenticatedMiddleware;
