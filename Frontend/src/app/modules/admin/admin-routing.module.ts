import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBookComponent } from './dashboard/add-book/add-book.component';
import { AddUserComponent } from './dashboard/add-user/add-user.component';
import { BookListComponent } from './dashboard/book-list/book-list.component';
import { ChangeStatusComponent } from './dashboard/change-status/change-status.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditBookComponent } from './dashboard/edit-book/edit-book.component';
import { EditConfigComponent } from './dashboard/edit-config/edit-config.component';
import { EditUserComponent } from './dashboard/edit-user/edit-user.component';
import { PendingUsersComponent } from './dashboard/pending-users/pending-users.component';

import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { skip: true } },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: PendingUsersComponent },
      { path: 'change-status/:id', component: ChangeStatusComponent },
      { path: 'books', component: BookListComponent },
      { path: 'add-book', component: AddBookComponent },
      { path: 'edit-book/:id', component: EditBookComponent },
      { path: 'add-user', component: AddUserComponent },
      { path: 'edit-user/:id', component: EditUserComponent },
      { path: 'config', component: EditConfigComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
