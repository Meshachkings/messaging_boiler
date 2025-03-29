import config from '@/config/config';
import jwt from 'jsonwebtoken';
import { StringValue } from 'ms';

export class Encode {
    public createToken(
        user: any,
        options: { expiresIn: StringValue } = { expiresIn: '1h' }
    ): string {
        return jwt.sign({ id: user._id }, config.auth.jwt.secret, options);
    }

    public getTokenExpiry(token: string): number | null {
        const decoded = jwt.decode(token) as jwt.JwtPayload;
        if (decoded && decoded.exp) {
            return decoded.exp * 1000;
        }
        return null;
    }

    public verify(token: string): any {
        const decoded = jwt.verify(token, config.auth.jwt.secret);
        return decoded;
    }
}
