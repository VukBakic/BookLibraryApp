import Genre from '../model/genre.model';
import Book from '../model/book.model';
import Global from '../model/global.model';
import Review from '../model/review.model';
import config from 'config';
import { ObjectId } from 'mongodb';
import Borrow from '../model/borrow.model';
import { FilterQuery } from 'mongoose';

class BookService {
  constructor() {}

  async create(input: any): Promise<any> {
    try {
      const book = await Book.create(input);
      return book;
    } catch (e: any) {
      throw e;
    }
  }

  async update(id: any, input: any): Promise<any> {
    try {
      const book = await Book.findOneAndUpdate({ _id: id }, input);
      return book;
    } catch (e: any) {
      throw e;
    }
  }

  async get(filter: any): Promise<any> {
    try {
      const book = await Book.findOne(filter).populate('genre');
      return book;
    } catch (e: any) {
      console.log(e);
      return null;
    }
  }

  async getUserGraphData(user_id: any) {
    const currentYear = new Date().getFullYear();

    const firstDay = new Date(currentYear, 0, 1);

    const lastDay = new Date(currentYear, 11, 31);

    let u = new ObjectId(user_id);
    let list = Borrow.aggregate([
      { $match: { user: u, dateOfReturn: { $gte: firstDay, $lte: lastDay } } },
      {
        $group: {
          _id: { $month: '$dateOfReturn' },
          count: { $sum: 1 },
        },
      },
    ]);
    return list;
  }

  async getUserGraphGenres(user_id: any) {
    let u = new ObjectId(user_id);
    let list = Borrow.aggregate([
      { $match: { user: u } },
      {
        $lookup: {
          from: 'books',
          localField: 'book',
          foreignField: '_id',
          as: 'book',
        },
      },
      {
        $unwind: '$book',
      },
      {
        $lookup: {
          from: 'genres',
          localField: 'book.genre',
          foreignField: '_id',
          as: 'genres',
        },
      },
      {
        $unwind: '$genres',
      },
      {
        $group: {
          _id: '$genres',
          count: { $sum: 1 },
        },
      },
    ]);
    return list;
  }

  async getBookOfTheDay(): Promise<any> {
    try {
      const global = await Global.findOne({}).populate('bookOfTheDay');

      const bookOfTheDay = global.bookOfTheDay;

      let today = new Date();
      today.setHours(0, 0, 0, 0);

      if (bookOfTheDay == null || today > global.updatedAt) {
        const count = await Book.count().exec();

        const random = Math.floor(Math.random() * count);

        const newBook = await Book.findOne().skip(random).exec();
        global.bookOfTheDayId = newBook._id;
        global.updatedAt = today;

        await global.save();

        return newBook;
      }
      return bookOfTheDay;
    } catch (e: any) {
      throw e;
    }
  }

  async getBookReviews(id: any): Promise<any> {
    const reviews = await Review.find({ book: id });
    return reviews;
  }

  async getBookAverageRating(id: any): Promise<any> {
    let idObj;
    try {
      idObj = new ObjectId(id);
    } catch (e) {}

    const result = await Review.aggregate([
      { $match: { book: idObj } },
      {
        $group: {
          _id: null,
          average: { $avg: '$rating' },
        },
      },
    ]).exec();

    return result[0] || null;
  }

  async getReviewsPage(id: any, page: number) {
    const limit = config.get('page_limit') as number;
    const skip = (page - 1) * limit;
    id = new ObjectId(id);

    return Review.aggregate([
      {
        $facet: {
          reviews: [
            { $match: { book: id } },
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
              },
            },
            {
              $project: {
                'user.password': 0,
                'user.username': 0,
                'user.email': 0,
                'user.phone': 0,
                'user.address': 0,
                'user.city': 0,
                'user.active': 0,
                'user.blocked': 0,
                'user.type': 0,
              },
            },
          ],
          total: [{ $match: { book: id } }, { $count: 'total' }],
        },
      },
    ])
      .addFields({
        count: {
          $ifNull: [{ $arrayElemAt: ['$total.total', 0] }, 0],
        },
      })
      .project({ total: 0 });
  }

  async editReview(user_id: any, review_id: any, data: any) {
    let reviewToUpdate = await Review.findOneAndUpdate(
      {
        _id: review_id,
        user: user_id,
      },
      { ...data }
    );
    return reviewToUpdate;
  }

  async getPage(filter: FilterQuery<any>, page = 1) {
    const limit = config.get('page_limit') as number;
    const skip = (page - 1) * limit;

    return Book.aggregate([
      {
        $facet: {
          books: [
            { $match: filter },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          total: [{ $match: filter }, { $count: 'total' }],
        },
      },
    ])
      .addFields({
        count: {
          $ifNull: [{ $arrayElemAt: ['$total.total', 0] }, 0],
        },
      })
      .project({ total: 0 });
  }

  async borrowBook(user_id: any, book_id: any) {
    const userIdObject = new ObjectId(user_id);
    const bookIdObject = new ObjectId(book_id);

    const check = await Borrow.find({ user: userIdObject, returned: false });

    if (check && check.length == 3) {
      return {
        available: false,
        error: 'Ne mozete zaduziti knjigu jer imate vec 3 zaduzene knjige.',
      };
    }

    let expiryCheck = false;
    let alreadyBorrowed = false;

    let dateNow = new Date();
    dateNow.setHours(0, 0, 0, 0);

    check.forEach((element) => {
      if (dateNow > element.dateToReturn) expiryCheck = true;
      if (element.book == book_id) alreadyBorrowed = true;
    });

    if (alreadyBorrowed) {
      return {
        available: false,
        error: 'Ne mozete zaduziti knjigu jer ste vec zaduzili primerak iste.',
      };
    }
    if (expiryCheck) {
      return {
        available: false,
        error:
          'Ne mozete zaduziti knjigu jer niste vratili zaduzenu knjigu u roku.',
      };
    }

    const book = await Book.findById(bookIdObject);
    if (book.count - book.taken == 0) {
      return {
        available: false,
        error:
          'Ne mozete zaduziti knjigu jer nema slobodnih primeraka na stanju',
      };
    }

    book.taken++;
    await book.save();

    const newBorrow = new Borrow({
      user: userIdObject,
      book: bookIdObject,
    });

    await newBorrow.save();
    return { available: true, borrow: newBorrow };
  }

  async extendBook(user_id: any, borrow_id: any) {
    let conf = await Global.findOne({}, 'daysToExtend');

    const dateNow = new Date();
    dateNow.setHours(0, 0, 0, 0);

    let borrow = await Borrow.findOneAndUpdate(
      {
        _id: borrow_id,
        user: user_id,
        extended: false,
      },
      [
        {
          $set: {
            extended: true,
            dateToReturn: {
              $dateAdd: {
                startDate: '$dateToReturn',
                unit: 'day',
                amount: conf.daysToExtend,
              },
            },
          },
        },
      ],
      {
        returnDocument: 'after',
      }
    );

    return borrow;
  }
  async checkIfBorrowed(user_id: any, book_id: any) {
    const check = await Borrow.findOne({ user: user_id, book: book_id });
    if (check) return true;
    else return false;
  }

  async getReview(user_id: any, book_id: any) {
    const review = await Review.findOne({ user: user_id, book: book_id });
    return review;
  }

  async addReview(r: any) {
    const review = new Review(r);
    return await review.save();
  }

  async getBorrowedBooks(user_id: any) {
    const userIdObject = new ObjectId(user_id);

    const dateNow = new Date();
    dateNow.setHours(0, 0, 0, 0);

    let books = await Borrow.aggregate([
      {
        $match: { user: userIdObject, returned: false },
      },

      {
        $project: {
          extended: 1,
          book: 1,
          daysLeft: {
            $dateDiff: {
              startDate: dateNow,
              endDate: '$dateToReturn',
              unit: 'day',
            },
          },
        },
      },
    ])
      .lookup({
        from: 'books',
        localField: 'book',
        foreignField: '_id',
        as: 'book',
        pipeline: [
          { $project: { _id: 1, book: 1, name: 1, author: 1, img_path: 1 } },
        ],
      })
      .unwind('book')
      .exec();
    /*
    let books = await Borrow.find({ user: user_id }, 'book').populate(
      'book',
      'name author img_path'
    );
    */
    return books;
  }
  async getBorrowedBooksByPage(
    user_id: any,
    sort_filter: FilterQuery<any>,
    page = 1
  ) {
    const userIdObject = new ObjectId(user_id);
    const limit = config.get('page_limit') as number;
    const skip = (page - 1) * limit;

    return Borrow.aggregate([
      {
        $facet: {
          history: [
            {
              $match: { user: userIdObject, returned: true },
            },

            {
              $lookup: {
                from: 'books',
                localField: 'book',
                foreignField: '_id',
                as: 'book',
              },
            },
            {
              $project: {
                createdAt: 1,
                dateOfReturn: 1,
                book: { $first: '$book' },
              },
            },
            { $sort: sort_filter },
            { $skip: skip },
            { $limit: limit },
          ],
          total: [
            { $match: { user: userIdObject, returned: true } },
            { $count: 'total' },
          ],
        },
      },
    ])
      .addFields({
        count: {
          $ifNull: [{ $arrayElemAt: ['$total.total', 0] }, 0],
        },
      })
      .project({ total: 0 });
  }

  async returnBook(borrow_id: any, user_id: any) {
    let borrow = await Borrow.findOne({ _id: borrow_id, user: user_id });

    if (!borrow) return false;
    if (borrow.returned) return false;

    borrow.returned = true;

    let today = new Date();
    borrow.dateOfReturn = today;
    await borrow.save();

    let bookToUpdate = await Book.findById(borrow.book);
    bookToUpdate.taken--;
    await bookToUpdate.save();

    return true;
  }

  async gettAllGenres() {
    let genres = await Genre.find();
    return genres;
  }

  async getTop3() {
    let top3 = await Borrow.aggregate([
      {
        $group: {
          _id: '$book',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 3,
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'book',
        },
      },
      {
        $project: {
          book: { $first: '$book' },
        },
      },
    ]);
    return top3;
  }
}

export default BookService;
