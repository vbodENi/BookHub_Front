import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordValidators {
  /**
   * Validates password strength:
   * - Min 12 characters
   * - At least 1 uppercase
   * - At least 1 lowercase
   * - At least 1 digit
   * - At least 1 special character
   */
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value || '';

      const errors: ValidationErrors = {};

      if (value.length < 12) {
        errors['minLength'] = true;
      }
      if (!/[A-Z]/.test(value)) {
        errors['missingUppercase'] = true;
      }
      if (!/[a-z]/.test(value)) {
        errors['missingLowercase'] = true;
      }
      if (!/[0-9]/.test(value)) {
        errors['missingDigit'] = true;
      }
      if (!/[^A-Za-z0-9]/.test(value)) {
        errors['missingSpecial'] = true;
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  /**
   * Cross-field validator: password confirmation must match password
   */
  static passwordsMatch(
    passwordKey: string,
    confirmKey: string
  ): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get(passwordKey)?.value;
      const confirm = group.get(confirmKey)?.value;

      if (!confirm) return null;

      return password === confirm ? null : { passwordsMismatch: true };
    };
  }
}
