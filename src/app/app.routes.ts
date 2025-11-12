import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { RestablecerContrasenaComponent } from './components/restablecer-contrasena/restablecer-contrasena.component';
import { NavbarHomeComponent } from './components/navbar-home/navbar-home.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { LandingComponent } from './components/landing/landing.component';
import { DonarComponent } from './components/donar/donar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { VoluntariadoComponent } from './components/voluntariado/voluntariado.component';
import { ApadrinamientoComponent } from './components/apadrinamiento/apadrinamiento.component';
import { UsuariosHomeComponent } from './components/usuarios-home/usuarios-home.component';
import { RolesHomeComponent } from './components/roles-home/roles-home.component';
import { VoluntariosHomeComponent } from './components/voluntarios-home/voluntarios-home.component';
import { NinosHomeComponent } from './components/ninos-home/ninos-home.component';
import { DashboardPadrinosHomeComponent } from './components/dashboard-padrinos-home/dashboard-padrinos-home.component';
import { NavbarPadrinoHomeComponent } from './components/navbar-padrino-home/navbar-padrino-home.component';
import { NinosBitacoraComponent } from './components/ninos-bitacora/ninos-bitacora.component';

export const routes: Routes = [
  {
    path: '',
    component: NavbarComponent, // Navbar siempre cargado
    children: [
      { path: '', component: LandingComponent },  // Landing debajo del navbar
      { path: 'donar', component: DonarComponent },
      { path: 'voluntariado', component: VoluntariadoComponent },
      { path: 'apadrinamiento', component: ApadrinamientoComponent },
    ]
  },

  // 🔐 Otras rutas públicas (sin navbar)
  { path: 'login', component: LoginComponent },
  { path: 'recuperar', component: RecuperarContrasenaComponent },
  { path: 'restablecer', component: RestablecerContrasenaComponent },
 

  // 🏠 Privadas
  {
    path: 'home',
    component: NavbarHomeComponent,
    children: [
      { path: 'perfil', component: PerfilComponent },
      { path: 'dashboard', component: DashboardHomeComponent },
      { path: 'usuarios', component: UsuariosHomeComponent },
      { path: 'roles', component: RolesHomeComponent },
      { path: 'voluntarios', component: VoluntariosHomeComponent },
      { path: 'niños', component: NinosHomeComponent },
    ],
  },
  {
    path: 'padrino',
    component: NavbarPadrinoHomeComponent,
    children: [
      { path: 'perfil', component: PerfilComponent },
      { path: 'dashboard', component: DashboardPadrinosHomeComponent },
      { path: 'ninos-bitacora', component: NinosBitacoraComponent },
    ],
  },

  // 🚨 Comodín
  { path: '**', redirectTo: '' },
];
