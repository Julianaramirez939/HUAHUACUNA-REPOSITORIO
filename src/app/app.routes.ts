import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { RestablecerContrasenaComponent } from './components/restablecer-contrasena/restablecer-contrasena.component';
import { RegistroComponent } from './components/registro/registro.component';
import { NavbarHomeComponent } from './components/navbar-home/navbar-home.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { LandingComponent } from './components/landing/landing.component';
import { DonarComponent } from './components/donar/donar.component';
import { NavbarComponent } from './components/navbar/navbar.component';

export const routes: Routes = [
  {
    path: '',
    component: NavbarComponent, // Navbar siempre cargado
    children: [
      { path: '', component: LandingComponent },  // Landing debajo del navbar
      { path: 'donar', component: DonarComponent } // Donar debajo del navbar
    ]
  },

  // 🔐 Otras rutas públicas (sin navbar)
  { path: 'login', component: LoginComponent },
  { path: 'recuperar', component: RecuperarContrasenaComponent },
  { path: 'restablecer', component: RestablecerContrasenaComponent },
  { path: 'registro', component: RegistroComponent },

  // 🏠 Privadas
  {
    path: 'home',
    component: NavbarHomeComponent,
    children: [
      { path: 'perfil', component: PerfilComponent },
      { path: 'dashboard', component: DashboardHomeComponent },
    ],
  },

  // 🚨 Comodín
  { path: '**', redirectTo: '' },
];
