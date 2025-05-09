import { Router } from "express";

import { UserController } from '../controllers/user.controller.js';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard.js';
import { SuperAdminGuard } from '../middlewares/superadmin.guard.js';
import { AdminGuard } from '../middlewares/admin.guard.js';
import { AuthorGuard } from '../middlewares/author.guard.js';
import { UserGuard } from '../middlewares/user.guard.js';

const router = Router();
const controller = new UserController();

router
    .post('/superadmin/register', controller.createSuperadmin)
    .post('/admin/register', JwtAuthGuard, controller.createAdmin)
    .post('/author/register', controller.createAuthor)
    .post('/user/register', controller.createUser);

router
    .post('/login', controller.login)
    .post('/confirm-login', controller.confirmLogin)
    .post('/token', controller.accessToken)
    .post('/logOut', controller.logOut);

router
    .get('/superadmin', JwtAuthGuard, SuperAdminGuard, controller.getSuperadmin)
    .get('/admin', JwtAuthGuard, SuperAdminGuard, controller.getAllAdmins)
    .get('/author', controller.getAllAuthors)
    .get('/user', JwtAuthGuard, AdminGuard, controller.getAllUsers);

router
    .get('/admin/:id', JwtAuthGuard, AdminGuard, controller.getById)
    .get('/author/:id', controller.getById)
    .get('/user/:id', JwtAuthGuard, UserGuard, controller.getById);

router
    .patch('/superadmin/:id', JwtAuthGuard, SuperAdminGuard, controller.updateById)
    .patch('/admin/:id', JwtAuthGuard, AdminGuard, controller.updateById)
    .patch('/author/:id', JwtAuthGuard, AuthorGuard, controller.updateById)
    .patch('/user/:id', JwtAuthGuard, UserGuard, controller.updateById);

router
    .delete('/admin/:id', JwtAuthGuard, SuperAdminGuard, controller.deleteById)
    .delete('/author/:id', JwtAuthGuard, AdminGuard, controller.deleteById)
    .delete('/user/:id', JwtAuthGuard, AdminGuard, controller.deleteById);

export { router as userRouter }
