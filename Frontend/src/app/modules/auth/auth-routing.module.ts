import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {
    component: LayoutComponent,
    data: {
      layout: 'form',
    },
    path: '',
    children: [{ path: 'register', component: RegisterComponent }],
  },
  {
    component: LayoutComponent,
    data: {
      layout: 'normal',
    },
    path: '',
    children: [{ path: 'login', component: LoginComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
