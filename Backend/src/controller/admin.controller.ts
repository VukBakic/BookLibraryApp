import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import UserServiceClass from '../service/user.service';
const UserService = new UserServiceClass();

import TokenServiceClass from '../service/token.service';
import AdminRefreshToken from '../model/adminRefreshToken.model';

import config from 'config';
import { omit } from 'lodash';
import { MongoServerError } from 'mongodb';
import { deleteImage } from '../middleware/validateImage';
import Borrow from '../model/borrow.model';
import Global from '../model/global.model';
const TokenService = new TokenServiceClass();

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  let user = await UserService.validatePassword({
    username,
    password,
    type: 'admin',
  });
  if (user) {
    const access_token = TokenService.generateAccessToken(user);
    const refresh_token = TokenService.generateRefreshToken(user);

    await AdminRefreshToken.findOneAndUpdate(
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

    const refresh_token = TokenService.generateRefreshToken(userPayload);

    let validToken = await AdminRefreshToken.findOneAndUpdate(
      { user: userPayload._id, token: token },
      { token: refresh_token }
    );

    if (validToken) {
      const access_token = TokenService.generateAccessToken(userPayload);
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

export async function getUsers(req: Request, res: Response) {
  let page;
  if (!req.params.page) {
    page = 1;
  }
  page = parseInt(req.params.page);
  if (!page && page < 0) {
    return res.status(400).json({ error: 'Pogresan parametar page.' });
  }
  const users = await UserService.getPage({ type: { $ne: 'admin' } }, page);
  if (users) {
    return res.json({ data: users[0].users, count: users[0].count });
  } else {
    return res.json({ data: null, count: 0 });
  }
}

export async function getPendingUsers(req: Request, res: Response) {
  let page;
  if (!req.params.page) {
    page = 1;
  }
  page = parseInt(req.params.page);
  if (!page && page < 0) {
    return res.status(400).json({ error: 'Pogresan parametar page.' });
  }
  const users = await UserService.getPage(
    { active: false, type: { $ne: 'admin' } },
    page
  );
  if (users) {
    return res.json({ data: users[0].users, count: users[0].count });
  } else {
    return res.json({ data: null, count: 0 });
  }
}

export async function getUser(req: Request, res: Response) {
  const id = req.params.id;
  try {
    let user = await UserService.findById(id);
    return res.json(user);
  } catch (e: any) {
    return res.json(null);
  }
}

export async function acceptUser(req: Request, res: Response) {
  const id = req.body.id;
  let data = await UserService.updateUser(id, { active: true });

  if (data) {
    return res.json({ user: data });
  }
  return res.status(400).send({ error: 'Pogresan id korisnika' });
}

export async function deleteUser(req: Request, res: Response) {
  const id = req.body.id;

  const check = await Borrow.count({ user: id, returned: false });
  if (check != 0) {
    return res.status(400).json({
      error: 'Ne mozete obrisati korisnika koji ima knjige na zaduzenju.',
    });
  }

  const removed = await UserService.delete(id);
  if (removed) {
    return res.json({ message: 'Korisnik uspesno obrisan.' });
  }
  return res.status(404).json();
}

export async function block(req: Request, res: Response) {
  const id = req.body.id;
  let data = await UserService.updateUser(id, { blocked: true });

  if (data) {
    return res.json({ user: data });
  }
  return res.status(400).send({ error: 'Pogresan id korisnika' });
}
export async function unblock(req: Request, res: Response) {
  const id = req.body.id;
  let data = await UserService.updateUser(id, { blocked: false });

  if (data) {
    return res.json({ user: data });
  }
  return res.status(400).send({ error: 'Pogresan id korisnika' });
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let imgPath = req.avatar
      ? `${req.body['username']}${req.avatar.extension}`
      : null;

    req.body.active = JSON.parse(req.body.active) ? true : false;

    const user = await UserService.create(req.body, imgPath, req.body.type);

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

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let imgPath = req.avatar
      ? `${req.body['username']}${req.avatar.extension}`
      : null;

    let data = omit(req.body, '_id');
    const user = await UserService.updateUser(req.body._id, data, imgPath);
    req.updated = true;
    next();
  } catch (e: any) {
    console.log(e);
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
        error: 'Doslo je do greske. (code1)',
      });
    } else {
      deleteImage(req.avatar);
      return res.status(400).send({
        error: 'Doslo je do greske. (code2)',
      });
    }
  }
}
export async function updateGlobals(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let configData = req.body;

  let update = await Global.findOneAndUpdate({}, configData);

  res.status(200).send();
}
export async function getGlobals(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let conf = await Global.findOne({});
  res.json(conf);
}
