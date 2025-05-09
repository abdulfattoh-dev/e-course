import { Review } from '../models/review.model.js';
import { catchError } from '../utils/error-response.js';
import { reviewValidation } from '../validations/review.validation.js';

export class ReviewController {
    async create(req, res) {
        try {
            const { error, value } = reviewValidation(req.body);

            if (error) {
                return catchError(res, 400, error);
            }

            const { courseId, userId, rating, comment } = value;
            const review = await Review.create({
                courseId,
                userId,
                rating,
                comment
            });

            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: review
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async getAll(_, res) {
        try {
            const reviews = Review.find().populate('courseId').populate('userId');

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: reviews
            });
        } catch (error) {
            catchError(res, 500, error.message);
        }
    }

    async getById(req, res) {
        try {
            const review = await ReviewController.findById(res, req.params.id);

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: review
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async updateById(req, res) {
        try {
            const id = req.params.id

            await ReviewController.findById(res, id);

            const updatedReview = await Review.findByIdAndUpdate(id, req.body, { new: true }).populate('courseId').populate('userId');

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: updatedReview
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async deleteById(req, res) {
        try {
            const id = req.params.id

            await ReviewController.findById(res, id);
            await Review.findByIdAndDelete(id);

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {}
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }



    static async findById(res, id) {
        try {
            const review = await Review.findById(id).populate('courseId').populate('userId');

            if (!review) {
                return catchError(res, 404, `Review not found by id: ${id}`);
            }

            return review
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }
}
