import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'recuperar',
    component: RecuperarContrasenaComponent,
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
