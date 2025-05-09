import { Course } from '../models/course.model.js';
import { Category } from '../models/category.model.js';
import { catchError } from '../utils/error-response.js';
import { courseValidation } from '../validations/course.validation.js';

export class CourseController {
    async create(req, res) {
        try {
            const { error, value } = courseValidation(req.body);

            if (error) {
                return catchError(res, 400, error);
            }

            const { title, description, price, categoryId, authorId } = value;
            const existTitle = await Course.findOne({ title });

            if (existTitle) {
                return catchError(res, 409, 'Title already exist');
            }

            const course = await Course.create({
                title,
                description,
                price,
                categoryId,
                authorId
            });

            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: course
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async getAll(_, res) {
        try {
            const courses = await Course.find().populate('categoryId').populate('authorId');

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: courses
            });
        } catch (error) {
            catchError(res, 500, error.message);
        }
    }



    async getByFilter(req, res) {
        try {
            const { category, price } = req.query
            const categoryData = await Category.findOne({ name: category });
            const courses = await Course.find({ 
                price: parseFloat(price), 
                categoryId: categoryData._id 
            }).populate('categoryId').populate('authorId');

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: courses
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }



    async getById(req, res) {
        try {
            const course = await CourseController.findById(res, req.params.id);

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: course
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async updateById(req, res) {
        try {
            const id = req.params.id

            await CourseController.findById(res, id);

            const updatedCourse = await Course.findByIdAndUpdate(id, req.body, { new: true }).populate('categoryId').populate('authorId');

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: updatedCourse
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async deleteById(req, res) {
        try {
            const id = req.params.id

            await CourseController.findById(res, id);
            await Course.findByIdAndDelete(id);

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
            const course = await Course.findById(id).populate('categoryId').populate('authorId');

            if (!course) {
                return catchError(res, 404, `Course not found by id: ${id}`);
            }

            return course
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }
}
