import { NgModule } from '@angular/core';
import {
  ExtraOptions,
  PreloadAllModules,
  RouterModule,
  Routes,
} from '@angular/router';
import { LayoutComponent } from 'app/modules/layout/layout.component';
import { AdminAuthGuard } from './core/guards/adminAuth.guard';

import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/noauth.guard';

const routes: Routes = [
  /* ANONYMOUS ROUTES */
  {
    path: '',
    component: LayoutComponent,
    data: {
      layout: 'normal',
    },
    canActivate: [NoAuthGuard],
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: '',
    children: [
      {
        path: '',

        canActivate: [NoAuthGuard],
        loadChildren: () =>
          import('./modules/auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },
  /* AUTHENTICATED ROUTES */
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: LayoutComponent,
        data: {
          layout: 'normal',
        },
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [AdminAuthGuard],

    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },

  { path: '**', redirectTo: '/dashboard' },
];

const routerConfig: ExtraOptions = {
  preloadingStrategy: PreloadAllModules,
  scrollPositionRestoration: 'enabled',
};
@NgModule({
  imports: [RouterModule.forRoot(routes, routerConfig)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
