import { model, Schema } from 'mongoose';

const categorySchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

categorySchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'categoryId'
});

export const Category = model('Category', categorySchema);
