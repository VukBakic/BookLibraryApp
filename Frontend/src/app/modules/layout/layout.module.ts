import { NgModule } from '@angular/core';


import { LayoutComponent } from './layout.component';
import { NormalLayoutModule } from './layouts/normal-layout/normal-layout.module';

import { FormLayoutModule } from './layouts/form-layout/form-layout.module';
import { AuthenticatedLayoutModule } from './layouts/authenticated-layout/authenticated-layout.module';
import { SharedModule } from '../shared/shared.module';

const layoutModules = [NormalLayoutModule, FormLayoutModule,AuthenticatedLayoutModule];
@NgModule({
  declarations: [LayoutComponent],
  imports: [SharedModule, ...layoutModules],
  exports: [...layoutModules],
})
export class LayoutModule {}
