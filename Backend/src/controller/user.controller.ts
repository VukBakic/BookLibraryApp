import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { MongoServerError, ObjectId } from 'mongodb';
import { deleteImage } from '../middleware/validateImage';

import config from 'config';
import UserRefreshToken from '../model/userRefreshToken.model';
import User from '../model/user.model';

import { omit } from 'lodash';

import UserServiceClass from '../service/user.service';
const UserService = new UserServiceClass();

import TokenServiceClass from '../service/token.service';
const TokenService = new TokenServiceClass();

import BookServiceClass from '../service/book.service';
const BookService = new BookServiceClass();

export function create(user_type: string) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      let imgPath = req.avatar
        ? `${req.body['username']}${req.avatar.extension}`
        : null;
      const user = await UserService.create(req.body, imgPath, user_type);
      next();
    } catch (e: any) {
      if (e instanceof MongoServerError) {
        if (e.code == 11000) {
          if (Object.keys(e.keyValue)[0] == 'username') {
            deleteImage(req.avatar);
            return res.status(409).send({
              errors: [
                { field: 'username', message: 'Korisnicko ime je zauzeto' },
              ],
            });
          }
          if (Object.keys(e.keyValue)[0] == 'email') {
            deleteImage(req.avatar);
            return res.status(409).send({
              errors: [{ field: 'email', message: 'Email adresa je zauzeta' }],
            });
          }
        }
        deleteImage(req.avatar);
        return res.status(400).send({
          error: 'Doslo je do greske.',
        });
      } else {
        deleteImage(req.avatar);
        return res.status(400).send({
          error: 'Doslo je do greske.',
        });
      }
    }
  };
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    let imgPath = req.avatar
      ? `${req.body['username']}${req.avatar.extension}`
      : null;

    let data = omit(req.body, 'username');
    const user = await UserService.updateUser(req.jwtData._id, data);
    req.updated = true;
    next();
  } catch (e: any) {
    if (e instanceof MongoServerError) {
      if (e.code == 11000) {
        if (Object.keys(e.keyValue)[0] == 'username') {
          deleteImage(req.avatar);
          return res.status(409).send({
            errors: [
              { field: 'username', message: 'Korisnicko ime je zauzeto' },
            ],
          });
        }
        if (Object.keys(e.keyValue)[0] == 'email') {
          deleteImage(req.avatar);
          return res.status(409).send({
            errors: [{ field: 'email', message: 'Email adresa je zauzeta' }],
          });
        }
      }
      deleteImage(req.avatar);
      return res.status(400).send({
        error: 'Doslo je do greske.',
      });
    } else {
      deleteImage(req.avatar);
      return res.status(400).send({
        error: 'Doslo je do greske.',
      });
    }
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  const user_id = req.jwtData._id;
  if (!user_id) {
    return res.status(403).send({
      error: { message: 'Niste ulogovani' },
    });
  }
  let found = await UserService.findById(user_id);
  return res.json(found);
}

export async function exists(req: Request, res: Response) {
  if (!req.params.username) {
    return res.status(422).send({
      errors: [{ field: 'username', message: 'Unesite korisnicko ime' }],
    });
  }

  const user = await UserService.find({ username: req.params.username });
  let response = { exists: false };
  if (user) response.exists = true;

  res.send(response);
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  let user = await UserService.validatePassword({
    username,
    password,
    type: { $in: ['user', 'moderator'] },
  });
  if (user) {
    if (user.active == false) {
      return res.status(401).json({
        error: 'Vas nalog ceka odobrenje od strane Administratora.',
      });
    }

    const access_token = TokenService.generateAccessToken(user);
    const refresh_token = TokenService.generateRefreshToken(user);

    await UserRefreshToken.findOneAndUpdate(
      { user: user._id },
      { token: refresh_token },
      { upsert: true }
    );

    return res.json({ access_token, refresh_token });
  } else {
    return res.status(401).json({
      error: 'Pogresno korisnicko ime ili lozinka.',
    });
  }
}

export async function refreshToken(req: Request, res: Response) {
  if (!req.body.token) {
    return res.status(422).send({
      errors: [{ field: 'token', message: 'Polje token ne sme biti prazno.' }],
    });
  }

  const token = req.body.token;
  try {
    const userPayload = jwt.verify(
      token,
      config.get('JWT_REFRESH_SECRET')
    ) as any;

    if (!userPayload) {
      return res.status(403).send({
        errors: [{ field: 'token', message: 'Neispravan refresh token.' }],
      });
    }
    const user = await User.findById(userPayload._id);
    const refresh_token = TokenService.generateRefreshToken(user);

    let validToken = await UserRefreshToken.findOneAndUpdate(
      { user: userPayload._id, token: token },
      { token: refresh_token }
    );

    if (validToken) {
      const access_token = TokenService.generateAccessToken(user);
      return res.json({ access_token, refresh_token });
    }

    return res.status(403).send({
      errors: [{ field: 'token', message: 'Neispravan refresh token.' }],
    });
  } catch (err: any) {
    return res.status(403).send({
      errors: [{ field: 'token', message: 'Neispravan refresh token.' }],
    });
  }
}

export async function borrowBook(req: Request, res: Response) {
  const { book } = req.body;
  const check = await BookService.borrowBook(req.jwtData._id, book);
  if (check.available == true) {
    return res.json({ success: true, message: 'Uspesno ste zaduzili knjigu' });
  } else {
    return res.status(404).send({ message: check.error });
  }
}

export async function extendBook(req: Request, res: Response) {
  const { borrow } = req.body;

  const check = await BookService.extendBook(req.jwtData._id, borrow);

  if (check) {
    return res.json({
      success: true,
      message: 'Uspesno ste produzili knjigu',
      borrow: check,
    });
  } else {
    return res
      .status(400)
      .send({ success: false, message: 'Ne mozete produziti knjigu' });
  }
}

export async function checkReviewPossible(req: Request, res: Response) {
  if (!req.params.id) {
    return res.status(422).send({
      errors: [{ field: 'id', message: 'Pogresan id knjige' }],
    });
  }

  const check = await BookService.checkIfBorrowed(
    req.jwtData._id,
    req.params.id
  );

  const review = await BookService.getReview(req.jwtData._id, req.params.id);

  res.send({ check: check && review == null });
}

export async function addReview(req: Request, res: Response) {
  const check = await BookService.checkIfBorrowed(
    req.jwtData._id,
    req.params.id
  );

  const review = await BookService.getReview(req.jwtData._id, req.params.id);
  if (check && review == null)
    return res
      .status(404)
      .send({ message: 'Ne mozete ostaviti recenziju za ovu knjigu' });

  let newReview = req.body;
  newReview.user = req.jwtData._id;

  await BookService.addReview(newReview);
  return res.send();
}
export async function editReview(req: Request, res: Response) {
  let { id, comment, rating } = req.body;
  let reviewUpdate = await BookService.editReview(req.jwtData._id, id, {
    comment,
    rating,
  });

  return res.send();
}
export async function changePassword(req: Request, res: Response) {
  const { newPassword, password } = req.body;
  if (newPassword == password) {
    return res.status(400).send({
      errors: [
        {
          field: 'newPassword',
          message: 'Nova lozinka ne moze biti ista kao stara',
        },
      ],
    });
  }
  const check = UserService.changePassword(
    req.jwtData._id,
    password,
    newPassword
  );

  if (!check)
    return res.status(400).send({
      errors: [
        {
          field: 'password',
          message: 'Pogresna lozinka',
        },
      ],
    });
  return res.status(200).send();
}

export async function getBorrowedBooks(req: Request, res: Response) {
  const list = await BookService.getBorrowedBooks(req.jwtData._id);
  return res.send(list);
}

export async function getUserHistory(req: Request, res: Response) {
  let page;
  if (!req.params.page) {
    page = 1;
  }
  page = parseInt(req.params.page);

  if (!page && page < 0) {
    return res.status(400).json({ error: 'Pogresan parametar page.' });
  }

  const allowedParams = [
    'book.name',
    'book.author.0',
    'createdAt',
    'dateOfReturn',
  ];

  let filter: any = {};

  let sort: any = req.query['sort'];
  let asc: any = parseInt(req.query['asc'] as string);
  if (!sort) sort = 0;
  if (!asc) asc = -1;

  filter[allowedParams[sort]] = asc;

  const list = await BookService.getBorrowedBooksByPage(
    req.jwtData._id,
    filter,
    page
  );

  if (list) {
    return res.json({ data: list[0].history, count: list[0].count });
  } else {
    return res.json({ data: null, count: 0 });
  }
}

export async function getUserNotifications(req: Request, res: Response) {
  let user_id = req.jwtData._id;

  let notifications = [];

  const user = await UserService.findById(user_id);
  if (user.blocked) {
    notifications.push({
      code: 'block',
      status: 'alert-danger',
      message:
        'Blokirani ste od strane administratora. Mozete samo vratiti zaduzene knjige.',
    });
  }

  const borrows = await BookService.getBorrowedBooks(user_id);

  let expirySoon = false;
  let expired = false;

  if (borrows) {
    borrows.forEach((e) => {
      if (e.daysLeft >= 0 && e.daysLeft <= 2) expirySoon = true;
      if (e.daysLeft < 0) expired = true;
    });

    if (expired) {
      notifications.push({
        code: 'expired',
        status: 'alert-danger',
        message: 'Istekao vam je rok za vracanje knjige.',
      });
    }

    if (expirySoon) {
      notifications.push({
        code: 'expiry',
        status: 'alert-warning',
        message: 'Uskoro vam istice rok za vracanje knjige.',
      });
    }

    if (borrows.length == 3) {
      notifications.push({
        code: 'max',
        status: 'alert-info',
        message: 'Imate 3 knjige na zaduzenju. Ne mozete zaduziti vise knjiga.',
      });
    }
  }
  return res.json(notifications);
}

export async function getUserGraph(req: Request, res: Response) {
  let user_id = req.jwtData._id;
  let graph = await BookService.getUserGraphData(user_id);
  return res.json(graph);
}
export async function getUserGraphByGenres(req: Request, res: Response) {
  let user_id = req.jwtData._id;
  let graph = await BookService.getUserGraphGenres(user_id);
  return res.json(graph);
}

export async function addBookRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let user_id = req.jwtData._id;
    let data = req.body;
    data.user = new ObjectId(user_id);
    data.count = 0;

    let book = await BookService.create(data);
    if (req.image) {
      book.img_path = `${book._id}${req.image.extension}`;
      req.image.img_path = book.img_path;
      await book.save();
    }
    req.pending = true;
    next();
  } catch (e: any) {
    console.log(e);
    deleteImage(req.image);
    return res.status(400).send({
      error: 'Doslo je do greske.',
    });
  }
}
