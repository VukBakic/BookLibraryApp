import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from './login/login.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SharedModule } from '../shared/shared.module';
import { NumberedPaginationModule } from '../shared/numbered-pagination/numbered-pagination.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PendingUsersComponent } from './dashboard/pending-users/pending-users.component';
import { NavbarComponent } from './dashboard/navbar/navbar.component';
import { ChangeStatusComponent } from './dashboard/change-status/change-status.component';
import { AddBookComponent } from './dashboard/add-book/add-book.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { BookListComponent } from './dashboard/book-list/book-list.component';
import { EditBookComponent } from './dashboard/edit-book/edit-book.component';
import { AddUserComponent } from './dashboard/add-user/add-user.component';
import { EditUserComponent } from './dashboard/edit-user/edit-user.component';
import { EditConfigComponent } from './dashboard/edit-config/edit-config.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtAuthInterceptor } from 'app/core/interceptors/jwtAuth.intercept';

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    PendingUsersComponent,
    ChangeStatusComponent,
    NavbarComponent,
    AddBookComponent,
    BookListComponent,
    EditBookComponent,
    AddUserComponent,
    EditUserComponent,
    EditConfigComponent,
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    FontAwesomeModule,
    NumberedPaginationModule,
    NgSelectModule,
  ],
})
export class AdminModule {}
