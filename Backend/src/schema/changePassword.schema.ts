import { object, string } from 'zod';

export const changePasswordSchema = object({
  body: object({
    password: string({
      required_error: 'Polje trenutna lozinka je neophodno',
    }).min(1, 'Polje trenutna lozinka ne moze biti prazno'),
    newPassword: string({
      required_error: 'Polje nova lozinka je neophodno',
    }).regex(
      RegExp(
        '^([A-Z](?=.*[a-z])|[a-z](?=.*[A-Z]))(?=.*\\d)(?=.*[@$!%*?&])[A-z\\d@$!%*?&]{7,11}$'
      ),
      'Polje nova lozinka mora pocinjati slovom, imati minimum 8 karaktera, maksimum 12 karaktera i sadrzati barem 1 veliko slovo, broj i specijalan karakter.'
    ),
  }),
});
