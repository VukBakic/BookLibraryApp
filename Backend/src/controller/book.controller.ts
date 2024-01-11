import { NextFunction, Request, response, Response } from 'express';
import { omit } from 'lodash';
import { ObjectId } from 'mongodb';
import { deleteImage } from '../middleware/validateImage';
import Book from '../model/book.model';
import Borrow from '../model/borrow.model';

import BookServiceClass from '../service/book.service';
const BookService = new BookServiceClass();

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    let book = await BookService.create(req.body);
    if (req.image) {
      book.img_path = `${book._id}${req.image.extension}`;
      req.image.img_path = book.img_path;
      await book.save();
    }
    next();
  } catch (e: any) {
    console.log(e);
    deleteImage(req.image);
    return res.status(400).send({
      error: 'Doslo je do greske.',
    });
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    let input = omit(req.body, '_id');
    if (req.image) {
      input.img_path = `${req.body._id}${req.image.extension}`;
      req.image.img_path = input.img_path;
      req.image.updated = true;
    }

    let book = await BookService.update(req.body._id, input);

    next();
  } catch (e: any) {
    console.log(e);
    deleteImage(req.image);
    return res.status(400).send({
      error: 'Doslo je do greske.',
    });
  }
}

export async function deleteBook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let book_id = req.body._id;

    let check = await Borrow.count({ book: book_id, returned: false });
    if (check > 0) {
      return res
        .status(400)
        .json({ error: 'Ne mozete brisati knjigu koja je zaduzena.' });
    }

    let deleteBorrows = await Borrow.deleteMany({ book: book_id });
    let deleteBook = await Book.deleteOne({ _id: book_id });

    if (deleteBook.deletedCount == 1) {
      return res.json({ message: 'Knjiga je obrisana.' });
    } else {
      return res.status(400).json({ error: 'Knjiga nije obrisana.' });
    }
  } catch (e: any) {
    console.log(e);
    deleteImage(req.image);
    return res.status(400).send({
      error: 'Doslo je do greske.',
    });
  }
}

export async function getBookOfTheDay(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let book = await BookService.getBookOfTheDay();
    let rating = await BookService.getBookAverageRating(book._id);

    return res.json({ book: book, rating: rating ? rating.average : null });
  } catch (e: any) {
    return res.status(400).send({
      error: 'Doslo je do greske.',
    });
  }
}
export async function getBookRating(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let { id } = req.params;
  let rating = await BookService.getBookAverageRating(id);

  return res.json({ rating: rating ? rating.average : null });
}

export function getBook(requested: boolean = false) {
  return async function (req: Request, res: Response, next: NextFunction) {
    if (!req.params.id) {
      return res.status(422).send({
        errors: [{ field: 'id', message: 'Pogresan id knjige' }],
      });
    }
    let filter: any = { _id: req.params.id };
    if (!requested) filter.count = { $ne: 0 };
    const book = await BookService.get(filter);
    if (book) return res.json(book);
    else
      res.status(404).send({
        errors: [{ field: 'id', message: 'Pogresan id knjige' }],
      });
  };
}

export async function getReviews(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.params.id) {
    return res.status(422).send({
      errors: [{ field: 'id', message: 'Pogresan id knjige' }],
    });
  }
  let page;
  if (!req.params.page) {
    page = 1;
  }
  page = parseInt(req.params.page);

  if (!page && page < 0) {
    return res.status(400).json({ error: 'Pogresan parametar page.' });
  }
  try {
    const reviews = await BookService.getReviewsPage(req.params.id, page);

    if (reviews) {
      return res.json({ data: reviews[0].reviews, count: reviews[0].count });
    } else {
      return res.json({ data: null, count: 0 });
    }
  } catch (e: any) {
    console.log(e);
  }
}

export async function returnBook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { borrow } = req.body;

  let result = await BookService.returnBook(borrow, req.jwtData._id);
  if (result) {
    res.json({ message: 'Uspesno ste vratili knjigu.' });
  } else {
    res.status(400).json({ message: 'Ne mozete vratiti knjigu.' });
  }
}

export async function getBookGenres(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const list = await BookService.gettAllGenres();
  return res.json(list);
}

export function getBooks(requested: boolean = false) {
  return async function (req: Request, res: Response) {
    let page;
    if (!req.params.page) {
      page = 1;
    }
    page = parseInt(req.params.page);
    if (!page && page < 0) {
      return res.status(400).json({ error: 'Pogresan parametar page.' });
    }
    //const allowedParams = ['name', 'author', 'genre', 'from', 'to', 'publisher'];
    const regexParams = ['name', 'author', 'publisher'];
    let filter: any = {};

    if (requested) filter.count = { $eq: 0 };
    else filter.count = { $ne: 0 };

    let year: any = {};

    let genresFilter: any = [];
    for (let param in req.query) {
      if (regexParams.includes(param)) {
        filter[param] = { $regex: new RegExp(req.query[param] as string, 'i') };
      }
      if (param == 'genre') {
        try {
          genresFilter.push(new ObjectId(req.query[param] as string));
        } catch (e) {}
      }

      if (param == 'from') {
        year.$gte = parseInt(req.query[param] as string);
      }

      if (param == 'to') {
        year.$lte = parseInt(req.query[param] as string);
      }
    }

    if (genresFilter.length) filter['genre'] = { $in: genresFilter };

    if (Object.keys(year).length != 0) {
      filter['year'] = year;
    }
    const books = await BookService.getPage(filter, page);
    if (books) {
      return res.json({ data: books[0].books, count: books[0].count });
    } else {
      return res.json({ data: null, count: 0 });
    }
  };
}

export async function getTop3(req: Request, res: Response, next: NextFunction) {
  let wtf = await BookService.getTop3();
  return res.send(wtf);
}
