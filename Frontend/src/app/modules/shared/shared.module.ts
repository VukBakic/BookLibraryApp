import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlashMessageComponent } from '../layout/common/partials/flash-message/flash-message.component';
import { ControlMessageComponent } from '../layout/common/partials/control-message/control-message.component';

@NgModule({
  declarations: [FlashMessageComponent, ControlMessageComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlashMessageComponent,
    ControlMessageComponent,
  ],
})
export class SharedModule {}
