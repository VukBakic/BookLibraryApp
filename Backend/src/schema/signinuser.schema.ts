import { object, string } from 'zod';

export const signInUserSchema = object({
  body: object({
    username: string({
      required_error: 'Polje korisnicko ime je neophodno',
    }).min(1, 'Polje korisnicko ime ne moze biti prazno'),
    password: string({
      required_error: 'Polje lozinka je neophodno',
    }).min(1, 'Polje lozinka ne moze biti prazno'),
  }),
});
