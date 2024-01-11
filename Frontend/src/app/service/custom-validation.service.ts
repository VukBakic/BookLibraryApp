import { Injectable } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Injectable()
export class CustomValidationService {
  constructor() {}

  static getValidatorErrorMessage(
    controlName: string | null,
    validatorName: string,
    validatorValue?: any
  ) {
    let config = {
      required: `Polje je neophodno`,
      email: `Neispravna email adresa`,
      uniqueUsername: 'Korisnicko ime je zauzeto',
      passwordMatch: 'Lozinke se ne poklapaju',
      pattern: 'Neispravan format',
    };

    return (config as any)[validatorName];
  }

  static showValidatorErrorMessage(validatorName: string, validatorValue: any) {
    let config = {};
    return (config as any)[validatorName];
  }
}
