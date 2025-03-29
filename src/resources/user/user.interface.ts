import { Document } from 'mongoose';
import { userRole } from './user.enums';
export interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    accounttype: userRole;
    firstname: string;
    lastname: string;
    location: string;
    gender: string;
    nationality: string;
    role: userRole;
    verified: boolean;
    temp_code: string;
    email_verified: boolean;
    profileImage: { url: string; name: string; source: string };
    googleId: string;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
}
