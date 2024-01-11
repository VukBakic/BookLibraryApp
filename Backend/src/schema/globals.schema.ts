import { object, number } from 'zod';

export const globalsSchema = object({
  body: object({
    daysToReturn: number({
      invalid_type_error: 'Pogresan podatak',
      required_error: 'Polje broj dana je neophodno',
    }),
    daysToExtend: number({
      invalid_type_error: 'Pogresan podatak',
      required_error: 'Polje broj dana je neophodno',
    }),
  }),
});
