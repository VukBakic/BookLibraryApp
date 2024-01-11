import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';
import { UserService } from '../../service/user.service';

@Injectable({ providedIn: 'root' })
export class UniqueUsernameValidator implements AsyncValidator {
  constructor(private userService: UserService) {}

  validate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {

    
    return this.userService.userExists(ctrl.value).pipe(
      map((response: any) =>
        response.exists ? { uniqueUsername: true } : null
      ),
      catchError(() => of(null))
    );
  }
}
