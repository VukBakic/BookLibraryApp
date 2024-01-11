import { Request, Response, NextFunction } from 'express';

import UserServiceClass from '../service/user.service';
const UserService = new UserServiceClass();

export const roleRequired = (
  role: string | Array<string>,
  blockedBypass: boolean = false
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const jwtData = req.jwtData;

    let roles = [];
    if (Array.isArray(role)) {
      roles = role;
    } else {
      roles.push(role);
    }

    const check = await UserService.getRole(jwtData._id);

    if (!check) {
      return res.status(403).send({
        error: 'Zabranjen pristup. (Code: 1)',
      });
    }

    if (check.blocked)
      if (!blockedBypass)
        return res.status(403).send({
          error:
            'Zabranjen pristup. Nalog deaktiviran od strane Administratora.',
        });

    if (!check.active)
      return res.status(403).send({
        error:
          'Zabranjen pristup. Nalog ceka odobrenje od strane Administratora.',
      });

    if (roles.includes(check.type)) return next();

    return res.status(403).send({
      error: 'Zabranjen pristup (Code: 2)',
    });
  };
};
