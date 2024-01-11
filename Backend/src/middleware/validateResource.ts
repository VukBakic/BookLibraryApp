import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodIssue, ZodSchema } from 'zod';
import log from '../logger';
import { deleteImage } from './validateImage';

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      if (req.avatar) deleteImage(req.avatar);
      return res.status(422).send(reformatError(e.errors));
    }
  };

const reformatError: any = (errors: any) => {
  let formatedErrors = errors.map((element: any) => {
    let path = '';
    for (let i = 1; i < element.path.length - 1; i++)
      path += `${element.path[i]}.`;
    path += element.path[element.path.length - 1];

    return {
      field: path,
      message: element.message,
    };
  });
  return { errors: formatedErrors };
};
export default validate;
