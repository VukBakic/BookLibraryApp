import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/modules/shared/shared.module';
import { NavbarModule } from '../../common/navigation/navbar/navbar.module';

import { NormalLayoutComponent } from './normal-layout.component';

@NgModule({
  declarations: [NormalLayoutComponent],
  imports: [RouterModule, SharedModule, NavbarModule],
  exports: [NormalLayoutComponent],
})
export class NormalLayoutModule {}
