import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NumberedPaginationComponent } from './numbered-pagination.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [CommonModule, FontAwesomeModule],
  declarations: [NumberedPaginationComponent],
  exports: [NumberedPaginationComponent],
})
export class NumberedPaginationModule {}
