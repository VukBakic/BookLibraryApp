import { Router } from 'express';
import {
  acceptUser,
  block,
  createUser,
  deleteUser,
  getGlobals,
  getPendingUsers,
  getUser,
  getUsers,
  login,
  refreshToken,
  unblock,
  updateGlobals,
  updateUser,
} from '../controller/admin.controller';
import {
  create as createBook,
  update as updateBook,
  deleteBook,
  getBooks,
} from '../controller/book.controller';
import { authRequired } from '../middleware/authRequired';
import { roleRequired } from '../middleware/roleRequired';
import {
  renameBookImage,
  validateBookImage,
  validateImage,
  renameImage,
} from '../middleware/validateImage';

import validateResource from '../middleware/validateResource';
import { createBookSchema } from '../schema/book.schema';
import { globalsSchema } from '../schema/globals.schema';
import { signInUserSchema } from '../schema/signinuser.schema';
import {
  adminCreateUserSchema,
  adminUpdateUserSchema,
} from '../schema/user.schema';

const router = Router();

/*  AUTH  */
router.post('/login', [validateResource(signInUserSchema), login]);
router.post('/refresh', refreshToken);

/* USER MANAGEMENT */
router.get('/pending/:page', [
  authRequired,
  roleRequired('admin'),
  getPendingUsers,
]);

router.post('/user/create', [
  authRequired,
  roleRequired('admin'),
  validateImage,
  validateResource(adminCreateUserSchema),
  createUser,
  renameImage,
]);
router.post('/user/update', [
  authRequired,
  roleRequired('admin'),
  validateImage,
  validateResource(adminUpdateUserSchema),
  updateUser,
  renameImage,
]);
router.get('/users/:page', [authRequired, roleRequired('admin'), getUsers]);
router.get('/user/:id', [authRequired, roleRequired('admin'), getUser]);
router.post('/accept-user', [authRequired, roleRequired('admin'), acceptUser]);
router.post('/delete-user', [authRequired, roleRequired('admin'), deleteUser]);
router.post('/block', [authRequired, roleRequired('admin'), block]);
router.post('/unblock', [authRequired, roleRequired('admin'), unblock]);

/* BOOK MANAGEMENT */
router.post('/book/create', [
  authRequired,
  roleRequired('admin'),
  validateBookImage,
  validateResource(createBookSchema),
  createBook,
  renameBookImage,
]);
router.post('/book/update', [
  authRequired,
  roleRequired('admin'),
  validateBookImage,
  validateResource(createBookSchema),
  updateBook,
  renameBookImage,
]);
router.post('/book/delete', [authRequired, roleRequired('admin'), deleteBook]);
router.get('/books/:page', [authRequired, roleRequired('admin'), getBooks()]);

/* GLOBAL */

router.post('/configuration/update', [
  authRequired,
  roleRequired('admin'),
  validateResource(globalsSchema),
  updateGlobals,
]);

router.get('/configuration', [authRequired, roleRequired('admin'), getGlobals]);

export = router;
