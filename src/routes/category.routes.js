import { Router } from "express";

import { CategoryController } from '../controllers/category.controller.js';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard.js';
import { AdminGuard } from '../middlewares/admin.guard.js';

const router = Router();
const controller = new CategoryController();

router
    .post('/', JwtAuthGuard, AdminGuard, controller.create)
    .get('/', controller.getAll)
    .get('/:id', controller.getById)
    .patch('/:id', JwtAuthGuard, AdminGuard, controller.updateById)
    .delete('/:id', JwtAuthGuard, AdminGuard, controller.deleteById);

export { router as categoryRouter }
