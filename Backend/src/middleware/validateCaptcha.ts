import { Request, Response, NextFunction } from 'express';

import log from '../logger';
import { decrypt } from '../util/encryption';

const validateCaptcha = (req: Request, res: Response, next: NextFunction) => {
  try {
    let submitedCaptcha = req.body.captcha.toUpperCase();
    let expectedCaptcha = decrypt(req.body.token).toUpperCase();

    if (submitedCaptcha == expectedCaptcha) {
      next();
    } else {
      res.status(422);
      return res.send({
        errors: [
          { field: 'captcha', message: 'Greska prilikom unosa CAPTCHA koda.' },
        ],
      });
    }
  } catch (e: any) {
    res.status(422);
    return res.send({
      errors: [
        { field: 'captcha', message: 'Greska prilikom unosa CAPTCHA koda.' },
      ],
    });
  }
};

export default validateCaptcha;
