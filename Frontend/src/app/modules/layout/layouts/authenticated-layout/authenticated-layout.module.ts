import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/modules/shared/shared.module';
import { NavbarModule } from '../../common/navigation/navbar/navbar.module';

import { AuthenticatedLayoutComponent } from './authenticated-layout.component';

@NgModule({
  declarations: [AuthenticatedLayoutComponent],
  imports: [RouterModule, SharedModule, NavbarModule],
  exports: [AuthenticatedLayoutComponent],
})
export class AuthenticatedLayoutModule {}
