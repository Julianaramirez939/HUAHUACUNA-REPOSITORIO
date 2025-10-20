import { Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { RegistroComponent } from './components/registro/registro.component';
import { PerfilComponent } from './components/perfil/perfil.component';

export const routes: Routes = [
  {
    path: '',
    component: NavbarComponent, // Navbar es el contenedor principal
    children: [
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'recuperar', component: RecuperarContrasenaComponent },
      { path: 'registro', component: RegistroComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: '**', redirectTo: 'login' },
    ],
  },
];
