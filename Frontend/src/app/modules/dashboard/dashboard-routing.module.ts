import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'app/core/guards/role.guard';
import { BookRequestComponent } from './book-request/book-request.component';
import { BookComponent } from './book/book.component';
import { BorrowedComponent } from './borrowed/borrowed.component';
import { DashboardComponent } from './dashboard.component';
import { HistoryComponent } from './history/history.component';
import { ChangePassowrdComponent } from './profile/change-passowrd/change-passowrd.component';
import { GeneralInfoComponent } from './profile/general-info/general-info.component';
import { GraphsComponent } from './profile/graphs/graphs.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'search',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('app/modules/search/search.module').then(
            (m) => m.SearchModule
          ),
      },
    ],
  },
  {
    path: 'profile',
    canActivate: [RoleGuard],
    data: { role: ['user', 'moderator'] },
    component: ProfileComponent,
    children: [
      {
        path: '',
        component: GeneralInfoComponent,
      },
      {
        path: 'change-password',
        component: ChangePassowrdComponent,
      },
      {
        path: 'graphs',
        component: GraphsComponent,
      },
    ],
  },
  {
    path: 'borrowed',
    canActivate: [RoleGuard],
    data: { role: ['user', 'moderator'] },
    component: BorrowedComponent,
  },
  {
    path: 'history',
    canActivate: [RoleGuard],
    data: { role: ['user', 'moderator'] },
    component: HistoryComponent,
  },
  
  {
    path: 'request',
    canActivate: [RoleGuard],
    data: { role: ['user'] },
    component: BookRequestComponent,
  },

  { path: 'book/:id', component: BookComponent },

  {
    path: 'moderator',
    canActivate: [RoleGuard],
    data: { role: 'moderator' },
    loadChildren: () =>
      import('app/modules/moderator/moderator.module').then(
        (m) => m.ModeratorModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
