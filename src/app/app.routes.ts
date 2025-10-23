import { Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NavbarHomeComponent } from './components/navbar-home/navbar-home.component';
import { LoginComponent } from './components/login/login.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { RegistroComponent } from './components/registro/registro.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { RestablecerContrasenaComponent } from './components/restablecer-contrasena/restablecer-contrasena.component';

export const routes: Routes = [
  // Ruta raíz pública → muestra el navbar principal
  {
    path: '',
    component: NavbarComponent,
  },

  // Rutas públicas → accesibles sin autenticación
  { path: 'login', component: LoginComponent },
  { path: 'recuperar', component: RecuperarContrasenaComponent },
  { path: 'restablecer', component: RestablecerContrasenaComponent },
  { path: 'registro', component: RegistroComponent },

  // Rutas privadas → requieren estar logueado
  {
    path: 'home',
    component: NavbarHomeComponent, // Navbar interno para usuarios autenticados
    children: [
      { path: 'perfil', component: PerfilComponent }, // Perfil de usuario
      { path: 'dashboard', component: DashboardHomeComponent }, // Panel principal
      // Puedes agregar más rutas internas privadas aquí
    ],
  },

  // Ruta comodín → redirige cualquier URL desconocida a la raíz
  { path: '**', redirectTo: '' },
];
