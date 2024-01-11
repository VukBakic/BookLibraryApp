import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/modules/shared/shared.module';
import { NavbarModule } from '../../common/navigation/navbar/navbar.module';

import { FormLayoutComponent } from './form-layout.component';

@NgModule({
  declarations: [FormLayoutComponent],
  imports: [RouterModule, SharedModule, NavbarModule],
  exports: [FormLayoutComponent],
})
export class FormLayoutModule {}
