import { Router } from "express";

import { ReviewController } from '../controllers/review.controller.js';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard.js';
import { UserGuard } from '../middlewares/user.guard.js';

const router = Router();
const controller = new ReviewController();

router
    .post('/', JwtAuthGuard, UserGuard, controller.create)
    .get('/', controller.getAll)
    .get('/:id', controller.getById)
    .patch('/:id', JwtAuthGuard, UserGuard, controller.updateById)
    .delete('/:id', JwtAuthGuard, UserGuard, controller.deleteById);

export { router as reviewRouter }
