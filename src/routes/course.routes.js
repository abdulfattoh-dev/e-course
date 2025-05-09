import { Router } from "express";

import { CourseController } from '../controllers/course.controller.js';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard.js';
import { AdminGuard } from '../middlewares/admin.guard.js';
import { AuthorGuard } from '../middlewares/author.guard.js';

const router = Router();
const controller = new CourseController();

router
    .post('/', JwtAuthGuard, AuthorGuard, controller.create)
    .get('/', controller.getAll)
    .get('/filter', controller.getByFilter)
    .get('/:id', controller.getById)
    .patch('/:id', JwtAuthGuard, AuthorGuard, controller.updateById)
    .delete('/:id', JwtAuthGuard, AdminGuard, controller.deleteById);

export { router as courseRouter }
