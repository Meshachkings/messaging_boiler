import * as bcrypt from 'bcrypt';

export class HashUtil {
    public async hashPassword(password: any) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    public async comparePassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash);
    }
}
