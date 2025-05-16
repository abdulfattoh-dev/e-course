import { Enrollment } from '../models/enrollment.model.js';
import { User } from '../models/user.model.js';
import { Course } from '../models/course.model.js';
import { catchError } from '../utils/error-response.js';
import { enrollmentValidation } from '../validations/enrollment.model.js';
import { otpGenerator } from '../utils/otp-generator.js';
import { transporter } from '../utils/mailer.js';
import { getCache, setCache } from '../utils/cache.js';

export class EnrollmentController {
    async create(req, res) {
        try {
            const { error, value } = enrollmentValidation(req.body);

            if (error) {
                return catchError(res, 400, error);
            }

            const { courseId, userId } = value;
            const course = await Course.findById(courseId);

            if (!course) {
                return catchError(res, 404, 'Course not found');
            }

            const user = await User.findById(userId);

            if (!user) {
                return catchError(res, 404, 'User not found');
            }

            const existingEnrollment = await Enrollment.findOne({ courseId, userId });

            if (existingEnrollment) {
                return catchError(res, 400, 'User already enrolled in this course');
            }

            const otp = otpGenerator();
            const mailMessage = {
                from: process.env.SMTP_USER,
                to: user.email,
                subject: 'e-course',
                text: otp
            }

            transporter.sendMail(mailMessage, function (err, info) {
                if (err) {
                    console.log('Error on sending to mail:', err);
                    return catchError(res, 400, err);
                }

                console.log(info);
                setCache(user.email, { otp, courseId });

                return res.status(200).json({
                    statusCode: 201,
                    message: 'OTP sent to your email',
                    data: {}
                });
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async confirmEnrollment(req, res) {
        try {
            const { email, otp } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return catchError(res, 404, 'User not found');
            }

            const cacheData = getCache(email);

            if (!cacheData || otp !== cacheData.otp) {
                return catchError(res, 400, 'Invalid or expired OTP');
            }

            const course = await Course.findById(cacheData.courseId);

            if (!course) {
                return catchError(res, 404, 'Course not found');
            }

            const enrollment = await Enrollment.create({
                courseId: cacheData.courseId,
                userId: user._id
            });

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: enrollment
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }



    async getAll(_, res) {
        try {
            const enrollments = await Enrollment.find().populate('courseId').populate('userId');

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: enrollments
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async getById(req, res) {
        try {
            const enrollment = await EnrollmentController.findById(res, req.params.id);

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: enrollment
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async updateById(req, res) {
        try {
            const id = req.params.id

            await EnrollmentController.findById(res, id);

            const updatedEnrollment = await Enrollment.findByIdAndUpdate(id, req.body, { new: true }).populate('courseId').populate('userId');

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: updatedEnrollment
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async deleteById(req, res) {
        try {
            const id = req.params.id

            await EnrollmentController.findById(res, id);
            await Enrollment.findByIdAndDelete(id);

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
            const enrollment = await Enrollment.findById(id).populate('courseId').populate('userId');

            if (!enrollment) {
                return catchError(res, 404, `Enrollment not found by id: ${id}`);
            }

            return enrollment
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }
}
