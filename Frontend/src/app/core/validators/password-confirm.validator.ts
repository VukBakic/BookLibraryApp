import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const passwordConfirmValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const passwordConfirmation = control.get('passwordConfirmation');

  return password &&
    passwordConfirmation &&
    password.value === passwordConfirmation.value
    ? null
    : { passwordMatch: true };
};

export const passwordChangeValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('newPassword');
  const passwordConfirmation = control.get('confirmPassword');

  return password &&
    passwordConfirmation &&
    password.value === passwordConfirmation.value
    ? null
    : { passwordMatch: true };
};
