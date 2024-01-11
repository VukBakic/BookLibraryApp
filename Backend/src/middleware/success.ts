import { Request, Response, NextFunction, response } from 'express';

export const success = (message: string) => {
  return (req: Request, res: Response) => {
    res.send({ message });
  };
};
