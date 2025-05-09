import { model, Schema } from 'mongoose';

const userSchema = new Schema(
    {
        full_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        hashedPassword: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['user', 'author', 'admin', 'superadmin'],
            default: 'user',
            required: true
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

userSchema.virtual('enrollments', {
    ref: 'Enrollment',
    localField: '_id',
    foreignField: 'userId'
});

export const User = model('User', userSchema);
