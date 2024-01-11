import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { DashboardComponent } from './dashboard.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { BookComponent } from './book/book.component';
import { NumberedPaginationModule } from '../shared/numbered-pagination/numbered-pagination.module';
import { SharedModule } from 'app/modules/shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { ChangePassowrdComponent } from './profile/change-passowrd/change-passowrd.component';
import { BorrowedComponent } from './borrowed/borrowed.component';
import { GeneralInfoComponent } from './profile/general-info/general-info.component';
import { HistoryComponent } from './history/history.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { GraphsComponent } from './profile/graphs/graphs.component';
import { BookRequestComponent } from './book-request/book-request.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    DashboardComponent,
    BookComponent,
    ProfileComponent,
    ChangePassowrdComponent,
    BorrowedComponent,
    GeneralInfoComponent,
    HistoryComponent,
    GraphsComponent,
    BookRequestComponent,
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule,
    FontAwesomeModule,
    NumberedPaginationModule,
    NgSelectModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
})
export class DashboardModule {}
