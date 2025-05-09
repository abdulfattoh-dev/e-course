import { model, Schema } from 'mongoose';

const reviewSchema = new Schema(
    {
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Review = model('Review', reviewSchema);
