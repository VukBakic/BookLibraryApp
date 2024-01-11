import config from 'config';
import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

export const authRequired = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer')) {
    const token = auth.slice(7);

    try {
      const jwtData = jwt.verify(token, config.get('JWT_ACCESS_SECRET'));
      req.jwtData = jwtData;
      next();
    } catch (error) {
      return res.status(401).send({
        error: 'Zabranjen pristup (Code: -1)',
      });
    }
  } else {
    return res.status(401).send({
      error: 'Zabranjen pristup. Neophodan token.',
    });
  }
};
