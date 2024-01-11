import { Router } from 'express';

import {
  addBookRequest,
  addReview,
  borrowBook,
  changePassword,
  checkReviewPossible,
  create as createUser,
  editReview,
  exists,
  extendBook,
  getBorrowedBooks,
  getUser,
  getUserGraph,
  getUserGraphByGenres,
  getUserHistory,
  getUserNotifications,
  login,
  refreshToken,
  update,
} from '../controller/user.controller';

import validateResource from '../middleware/validateResource';
import { createUserSchema, updateUserSchema } from '../schema/user.schema';

import {
  renameBookImage,
  renameImage,
  validateBookImage,
  validateImage,
} from '../middleware/validateImage';
import { signInUserSchema } from '../schema/signinuser.schema';

import {
  getBook,
  getBookGenres,
  getBookOfTheDay,
  getBooks,
  getReviews,
  getTop3,
  returnBook,
  create as createBook,
  update as updateBook,
  getBookRating,
  deleteBook,
} from '../controller/book.controller';

import { authRequired } from '../middleware/authRequired';
import { changePasswordSchema } from '../schema/changePassword.schema';
import { createBookSchema } from '../schema/book.schema';
import { roleRequired } from '../middleware/roleRequired';

const router = Router();

router.post('/register', [
  validateImage,
  validateResource(createUserSchema),
  createUser('user'),
  renameImage,
]);

/* USER MANAGEMENT */
router.get('/exists/:username', exists);
router.post('/login', [validateResource(signInUserSchema), login]);
router.post('/refresh', refreshToken);
router.post('/change-password', [
  authRequired,
  validateResource(changePasswordSchema),
  changePassword,
]);

router.get('/notifications', [
  authRequired,
  roleRequired(['user', 'moderator'], true),
  getUserNotifications,
]);

router.post('/update', [
  authRequired,
  roleRequired(['user', 'moderator']),
  validateImage,
  validateResource(updateUserSchema),
  update,
  renameImage,
]);
router.get('/profile', [
  authRequired,
  roleRequired(['user', 'moderator'], true),
  getUser,
]);

/* MODERATOR BOOK MANAGEMENT */
router.post('/book/create', [
  authRequired,
  roleRequired(['moderator']),
  validateBookImage,
  validateResource(createBookSchema),
  createBook,
  renameBookImage,
]);

router.post('/book/update', [
  validateBookImage,
  validateResource(createBookSchema),
  updateBook,
  renameBookImage,
]);
router.post('/moderator/book/delete', [
  authRequired,
  roleRequired('moderator'),
  deleteBook,
]);

router.get('/moderator/book/:id', [
  authRequired,
  roleRequired('moderator'),
  getBook(true),
]);
router.get('/moderator/books/:page', [
  authRequired,
  roleRequired('moderator'),
  getBooks(true),
]);

/* BOOK MANAGEMENT */

router.get('/bookoftheday', [
  authRequired,
  roleRequired(['user', 'moderator']),
  getBookOfTheDay,
]);

router.post('/book/add', [
  authRequired,
  roleRequired('user'),
  validateBookImage,
  validateResource(createBookSchema),
  addBookRequest,
  renameBookImage,
]);

router.get('/book/rating/:id', getBookRating);
router.get('/book/:id', getBook());
router.post('/review/add', [authRequired, addReview]);
router.post('/review/edit', [authRequired, editReview]);
router.get('/review/:id/:page', getReviews);
router.get('/check/review/:id', [authRequired, checkReviewPossible]);
router.get('/genres', [getBookGenres]);
router.get('/top', [getTop3]);
router.get('/books/:page', [getBooks()]);

/* BORROWS MANAGEMENT */
router.post('/borrow', [authRequired, borrowBook]);
router.get('/borrowed', [authRequired, getBorrowedBooks]);
router.post('/return', [authRequired, returnBook]);
router.get('/history/:page', [
  authRequired,
  roleRequired(['user', 'moderator']),
  authRequired,
  getUserHistory,
]);
router.post('/extend', [authRequired, extendBook]);

router.get('/graph', [authRequired, getUserGraph]);
router.get('/graph2', [authRequired, getUserGraphByGenres]);
export = router;
