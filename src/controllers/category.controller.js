import { Category } from '../models/category.model.js';
import { catchError } from '../utils/error-response.js';
import { categoryValidation } from '../validations/category.model.js';

export class CategoryController {
    async create(req, res) {
        try {
            const { error, value } = categoryValidation(req.body);

            if (error) {
                return catchError(res, 400, error);
            }

            const { name, description } = value;
            const existName = await Category.findOne({ name });

            if (existName) {
                return catchError(res, 409, 'Name already exist');
            }

            const category = await Category.create({
                name,
                description
            });

            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: category
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async getAll(_, res) {
        try {
            const categories = await Category.find().populate('courses');

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: categories
            });
        } catch (error) {
            catchError(res, 500, error.message);
        }
    }

    async getById(req, res) {
        try {
            const category = await CategoryController.findById(res, req.params.id);

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: category
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async updateById(req, res) {
        try {
            const id = req.params.id

            await CategoryController.findById(res, id);

            const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true }).populate('courses');

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: updatedCategory
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async deleteById(req, res) {
        try {
            const id = req.params.id

            await CategoryController.findById(res, id);
            await Category.findByIdAndDelete(id);

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
            const category = await Category.findById(id).populate('courses');

            if (!category) {
                return catchError(res, 404, `Category not found by id: ${id}`);
            }

            return category
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }
}
