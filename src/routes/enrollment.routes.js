import { Router } from "express";

import { EnrollmentController } from '../controllers/enrollment.controller.js';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard.js';
import { UserGuard } from '../middlewares/user.guard.js';

const router = Router();
const controller = new EnrollmentController();

router
    .post('/', JwtAuthGuard, UserGuard, controller.create)
    .post('/confirm-enrollment', JwtAuthGuard, UserGuard, controller.confirmEnrollment)
    .get('/', JwtAuthGuard, UserGuard, controller.getAll)
    .get('/:id', JwtAuthGuard, UserGuard, controller.getById)
    .patch('/:id', JwtAuthGuard, UserGuard, controller.updateById)
    .delete('/:id', JwtAuthGuard, UserGuard, controller.deleteById);

export { router as enrollmentRouter }
