import { boolean, nativeEnum, object, string, TypeOf } from 'zod';

enum Allowed {
  User = 'user',
  Moderator = 'moderator',
}

const userPartilSchema = object({
  username: string({
    required_error: 'Polje korisnicko ime je neophodno',
  }).min(1, 'Polje korisnicko ime ne moze biti prazno'),

  firstname: string({
    required_error: 'Polje ime je neophodno',
  }).min(1, 'Polje ime ne moze biti prazno'),
  lastname: string({
    required_error: 'Polje prezime je neophodno',
  }).min(1, 'Polje prezime ne moze biti prazno'),
  address: string({
    required_error: 'Polje adresa je neophodno',
  }).min(1, 'Polje adresa ne moze biti prazno'),
  city: string({
    required_error: 'Polje grad je neophodno',
  }).min(1, 'Polje grad ne moze biti prazno'),
  phone: string({
    required_error: 'Polje kontakt telefon je neophodno',
  }).min(1, 'Polje kontakt telefon ne moze biti prazno'),

  email: string({
    required_error: 'Polje email je neophodno',
  }).email('Neispravna email adresa'),
});

const userSchema = userPartilSchema.extend({
  password: string({
    required_error: 'Polje lozinka je neophodno',
  }).regex(
    RegExp(
      '^([A-Z](?=.*[a-z])|[a-z](?=.*[A-Z]))(?=.*\\d)(?=.*[@$!%*?&])[A-z\\d@$!%*?&]{7,11}$'
    ),
    'Polje lozinka mora pocinjati slovom, imati minimum 8 karaktera, maksimum 12 karaktera i sadrzati barem 1 veliko slovo, broj i specijalan karakter.'
  ),
  passwordConfirmation: string({
    required_error: 'Polje potrvrda lozinke je neophodno',
  }),
});

const userUpdateSchema = userPartilSchema.extend({
  _id: string(),
  password: string()
    .optional()
    .refine(
      (val: any) => {
        return (
          val === '' ||
          RegExp(
            '^([A-Z](?=.*[a-z])|[a-z](?=.*[A-Z]))(?=.*\\d)(?=.*[@$!%*?&])[A-z\\d@$!%*?&]{7,11}$'
          ).test(val)
        );
      },
      {
        message:
          'Polje lozinka mora pocinjati slovom, imati minimum 8 karaktera, maksimum 12 karaktera i sadrzati barem 1 veliko slovo, broj i specijalan karakter.',
      }
    ),
  passwordConfirmation: string().optional(),
});

const userSchemaByAdmin = userSchema.extend({
  type: nativeEnum(Allowed, {
    errorMap: (issue, ctx) => {
      return { message: 'Pogresan tip korisnika' };
    },
  }),
  active: string({
    invalid_type_error: 'Pogresan podatak',
  }),
});

/************ BODY WARAPPERS */
export const createUserSchema = object({
  body: userSchema.refine(
    (data) => data.password === data.passwordConfirmation,
    {
      message: 'Lozinke se ne poklapaju',
      path: ['passwordConfirmation'],
    }
  ),
});

export const updateUserSchema = object({
  body: userPartilSchema,
});
export const adminCreateUserSchema = object({
  body: userSchemaByAdmin,
});
export const adminUpdateUserSchema = object({
  body: userUpdateSchema,
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  'body.passwordConfirmation'
>;
