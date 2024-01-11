import { array, object, string, TypeOf, number } from 'zod';

export const createBookSchema = object({
  body: object({
    name: string({
      required_error: 'Polje naziv knjige je neophodno',
    }).min(1, 'Polje naziv knjige ne moze biti prazno'),

    author: array(
      string({
        required_error: 'Polje autor je neophodno',
      }).min(1, 'Polje autor ne moze biti prazno'),
      {
        required_error: 'Morate uneti bar 1 autora',
      }
    ).nonempty('Morate uneti bar 1 autora.'),

    publisher: string({
      required_error: 'Polje izdavac je neophodno',
    }).min(1, 'Polje izdavac ne moze biti prazno'),

    genre: array(
      string({
        required_error: 'Polje zanr je neophodno',
      }).min(1, 'Polje zanr ne moze biti prazno'),
      {
        required_error: 'Morate uneti bar 1 zanr',
      }
    )
      .nonempty('Morate uneti bar 1 zanr.')
      .max(3, 'Mozete odabrati najvise 3 zanra.'),

    year: string({
      required_error: 'Polje godina izdavanja je neophodno',
    })
      .min(1, 'Polje godina izdavanja ne moze biti prazno')
      .regex(RegExp('^\\d+$'), 'Polje godina izdavanja mora biti broj.'),

    language: string({
      required_error: 'Polje jezik je neophodno',
    }).min(1, 'Polje jezik ne moze biti prazno'),

    count: string({
      required_error: 'Polje broj primeraka je neophodno',
    })
      .min(1, 'Polje broj primeraka ne moze biti prazno')
      .regex(RegExp('^\\d+$'), 'Polje broj primeraka mora biti broj.'),
  }),
});

/*

    
    publisher: {
      type: String,
      required: true,
    },
    genre: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusinessCode',
      },
    ],
    year: { type: String, required: true },
    language: { type: String, required: true },
    img_path: { type: String },
    count: { type: Number, required: true, default: 1 },
    available: { type: Number, required: true, default: 1 },


    */
