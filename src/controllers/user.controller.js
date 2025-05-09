import jwt from 'jsonwebtoken';

import { User } from '../models/user.model.js';
import { catchError } from '../utils/error-response.js';
import { userValidation } from '../validations/user.validation.js';
import { decode, encode } from '../utils/bcrypt-encrypt.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generate-token.js';
import { transporter } from '../utils/mailer.js';
import { otpGenerator } from '../utils/otp-generator.js';
import { getCache, setCache } from '../utils/cache.js';
import { refTokenWriteCookie } from '../utils/write-cookie.js';

export class UserController {
    async createSuperadmin(req, res) {
        try {
            const { error, value } = userValidation(req.body);

            if (error) {
                return catchError(res, 400, error);
            }

            const { full_name, email, password } = value;
            const existEmail = await User.findOne({ email });

            if (existEmail) {
                return catchError(res, 409, 'Email already exist');
            }

            const checkSuperAdmin = await User.findOne({ role: 'superadmin' });

            if (checkSuperAdmin) {
                return catchError(res, 409, 'Super admin already exist');
            }

            const hashedPassword = await encode(password, 7);
            const superadmin = await User.create({
                full_name,
                email,
                hashedPassword,
                role: 'superadmin'
            });

            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: superadmin
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async createAdmin(req, res) {
        try {
            const { error, value } = userValidation(req.body);

            if (error) {
                return catchError(res, 400, error);
            }

            const { full_name, email, password } = value;
            const existEmail = await User.findOne({ email });

            if (existEmail) {
                return catchError(res, 409, 'Email already exist');
            }

            const hashedPassword = await encode(password, 7);
            const admin = await User.create({
                full_name,
                email,
                hashedPassword,
                role: 'admin'
            });

            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: admin
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async createAuthor(req, res) {
        try {
            const { error, value } = userValidation(req.body);

            if (error) {
                return catchError(res, 400, error);
            }

            const { full_name, email, password } = value;
            const existEmail = await User.findOne({ email });

            if (existEmail) {
                return catchError(res, 409, 'Email already exist');
            }

            const hashedPassword = await encode(password, 7);
            const author = await User.create({
                full_name,
                email,
                hashedPassword,
                role: 'author'
            });

            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: author
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async createUser(req, res) {
        try {
            const { error, value } = userValidation(req.body);

            if (error) {
                return catchError(res, 400, error);
            }

            const { full_name, email, password } = value;
            const existEmail = await User.findOne({ email });

            if (existEmail) {
                return catchError(res, 409, 'Email already exist');
            }

            const hashedPassword = await encode(password, 7);
            const user = await User.create({
                full_name,
                email,
                hashedPassword,
                role: 'user'
            });

            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: user
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }



    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return catchError(res, 404, 'User not found');
            }

            const isMatchPassword = await decode(password, user.hashedPassword);

            if (!isMatchPassword) {
                return catchError(res, 400, 'Invalid password');
            }

            const otp = otpGenerator();
            const mailMessage = {
                from: process.env.SMTP_USER,
                to: email,
                // to: 'dilshod7861@gmail.com',
                // to: 'abdulfattoh.dev@gmail.com',
                subject: 'e-course',
                text: otp
            }

            transporter.sendMail(mailMessage, function (err, info) {
                if (err) {
                    console.log('Error on sending to mail:', err);
                    return catchError(res, 400, err);
                }

                console.log(info);
                setCache(user.email, otp);
            });

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {}
            })
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async confirmLogin(req, res) {
        try {
            const { email, otp } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return catchError(res, 404, 'User not found');
            }

            const otpCache = getCache(email);

            if (!otpCache || otp != otpCache) {
                return catchError(res, 400, 'OTP expired');
            }

            const payload = { id: user._id, role: user.role }
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            refTokenWriteCookie(res, 'resfreshtoken', refreshToken);

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: accessToken
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async accessToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return catchError(res, 401, 'Refresh token expired');
            }

            const decodedToken = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_KEY
            );

            if (!decodedToken) {
                return catchError(res, 401, 'Refresh token expired');
            }

            const payload = { id: decodedToken.id, role: decodedToken.role }
            const accessToken = generateAccessToken(payload);

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: accessToken
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async logOut(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return catchError(res, 401, 'Refresh token not found')
            }

            const decodedToken = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_KEY
            );

            if (!decodedToken) {
                return catchError(res, 401, 'Refresh token expired');
            }

            res.clearCookie('refreshToken');

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {}
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }



    async getSuperadmin(_, res) {
        try {
            const superadmin = await User.find({ role: 'superadmin' });

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: superadmin
            });
        } catch (error) {
            catchError(res, 500, error.message);
        }
    }

    async getAllAdmins(_, res) {
        try {
            const admins = await User.find({ role: 'admin' });

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: admins
            });
        } catch (error) {
            catchError(res, 500, error.message);
        }
    }

    async getAllAuthors(_, res) {
        try {
            const authors = await User.find({ role: 'author' });

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: authors
            });
        } catch (error) {
            catchError(res, 500, error.message);
        }
    }

    async getAllUsers(_, res) {
        try {
            const users = await User.find({ role: 'user' }).populate('enrollments');

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: users
            });
        } catch (error) {
            catchError(res, 500, error.message);
        }
    }



    async getById(req, res) {
        try {
            const user = await UserController.findById(res, req.params.id);

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: user
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async updateById(req, res) {
        try {
            const id = req.params.id

            await UserController.findById(res, id);

            const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true }).populate('enrollments');

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: updatedUser
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async deleteById(req, res) {
        try {
            const id = req.params.id
            const user = await UserController.findById(res, id);

            if (user.role === 'superadmin') {
                return catchError(res, 400, `Danggg\nSuper admin cannot be delete`);
            }

            await User.findByIdAndDelete(id);

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
            const user = await User.findById(id).populate('enrollments');

            if (!user) {
                return catchError(res, 404, `User not found by id: ${id}`);
            }

            return user
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }
}
