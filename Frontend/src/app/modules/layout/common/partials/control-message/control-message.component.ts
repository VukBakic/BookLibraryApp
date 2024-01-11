import {
  ChangeDetectionStrategy,
  DoCheck,
  IterableDiffers,
  KeyValueDiffer,
  KeyValueDiffers,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Component, Input } from '@angular/core';
import {
  FormGroup,
  FormControl,
  AbstractControl,
  ControlValueAccessor,
} from '@angular/forms';
import { CustomValidationService } from 'app/service/custom-validation.service';



@Component({
  selector: 'app-control-message',
  templateUrl: './control-message.component.html',
  styleUrls: ['./control-message.component.scss'],
})
export class ControlMessageComponent implements OnInit, DoCheck {
  private arrayDiffer: any;

  constructor(private kvDiffers: KeyValueDiffers) {}

  public ngOnInit(): void {
    this.arrayDiffer = this.kvDiffers.find(this.submitErrors).create();
  }

  ngDoCheck() {
    let errArrayChanges = this.arrayDiffer.diff(this.submitErrors);
    if (errArrayChanges) {
      errArrayChanges.forEachAddedItem((record: any) => {
        this.changeError();
      });
      errArrayChanges.forEachRemovedItem((record: any) => {
        this.changeError();
      });
    }
  }

  @Input() submitErrors!: Array<{ field: string; message: string }>;

  @Input() control!: AbstractControl;

  error: string | undefined = undefined;

  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if (
        this.control.errors.hasOwnProperty(propertyName) &&
        this.control.touched
      ) {
        return CustomValidationService.getValidatorErrorMessage(
          this.getName(this.control),
          propertyName,
          this.control.errors[propertyName]
        );
      }
      if (this.control.valueChanges) {
        return CustomValidationService.showValidatorErrorMessage(
          propertyName,
          this.control.errors[propertyName]
        );
      }
    }
    return null;
  }

  changeError() {
    let fieldName = this.getControlPath(this.control, '');

    var stringToReturn = this.submitErrors.find((obj) => {
      return obj.field === fieldName;
    });
    this.error = stringToReturn?.message;
  }

  private getName(control: AbstractControl): string | null {
    let group = <FormGroup>control.parent;
    if (!group) {
      return null;
    }

    return (
      Object.keys(group.controls).find(
        (name) => control === group.controls[name]
      ) || null
    );
  }
  private getControlPath(
    control: AbstractControl,
    path: string
  ): string | null {
    path = this.getName(control) + path;

    if (control.parent && this.getName(control.parent)) {
      path = '.' + path;
      return this.getControlPath(control.parent, path);
    } else {
      return path;
    }
  }
}
