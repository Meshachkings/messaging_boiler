import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';
import { userRole } from './user.enums';

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, unique: true, required: true, max: 255, min: 6 },
        username: {
            type: String,
            unique: true,
            required: true,
            max: 255,
            min: 6,
        },
        password: { type: String, required: true, max: 255, min: 3 },
        accounttype: {
            type: String,
            required: true,
            max: 255,
            min: 3,
            enums: ['BUSINESS', 'INDIVIDUAL'],
        },
        firstname: { type: String, required: true, max: 255 },
        lastname: { type: String, required: true, max: 255 },
        location: { type: String, required: true, max: 255 },
        gender: { type: String, required: true, max: 255 },
        nationality: { type: String, required: true, max: 255 },
        role: {
            type: String,
            default: userRole.BUYER,
            required: true,
            max: 255,
            enums: Object.values(userRole),
        },
        email_verified: { type: Boolean, default: false },
        profileImage: { url: String, name: String, source: String },
        temp_code: { type: String, default: '' },
        googleId: String,
        isBlocked: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default model<IUser>('User', UserSchema);
