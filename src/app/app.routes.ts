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
import { VoluntariosHomeComponent } from './components/voluntarios-home/voluntarios-home.component';
import { NinosHomeComponent } from './components/ninos-home/ninos-home.component';
import { DashboardPadrinosHomeComponent } from './components/dashboard-padrinos-home/dashboard-padrinos-home.component';
import { NavbarPadrinoHomeComponent } from './components/navbar-padrino-home/navbar-padrino-home.component';
import { NinosBitacoraComponent } from './components/ninos-bitacora/ninos-bitacora.component';
import { AdminContenidoComponent } from './components/admin-contenido/admin-contenido.component';
import { ActividadesHomeComponent } from './components/actividades-home/actividades-home.component';
import { DonacionesHomeComponent } from './components/donaciones-home/donaciones-home.component';
import { PadrinosHomeComponent } from './components/padrinos-home/padrinos-home.component';
import { NinosApadrinadosComponent } from './components/ninos-apadrinados/ninos-apadrinados.component';
import { NavbarAdminPadrinoComponent } from './components/navbar-admin-padrino/navbar-admin-padrino.component';
import { NoticiasNinosHomeComponent } from './components/noticias-ninos-home/noticias-ninos-home.component';
import { ProgresoNinosComponent } from './components/progreso-ninos/progreso-ninos.component';

export const routes: Routes = [
  {
    path: '',
    component: NavbarComponent, // Navbar público
    children: [
      { path: '', component: LandingComponent },
      { path: 'donar', component: DonarComponent },
      { path: 'voluntariado', component: VoluntariadoComponent },
      { path: 'apadrinamiento', component: ApadrinamientoComponent },
    ],
  },

  { path: 'login', component: LoginComponent },
  { path: 'recuperar', component: RecuperarContrasenaComponent },
  { path: 'restablecer', component: RestablecerContrasenaComponent },

  // Rutas privadas individuales
  {
    path: 'home',
    component: NavbarHomeComponent,
    children: [
      { path: 'perfil', component: PerfilComponent },
      { path: 'dashboard', component: DashboardHomeComponent },
      { path: 'usuarios', component: UsuariosHomeComponent },
      { path: 'padrinos', component: PadrinosHomeComponent },
      { path: 'voluntarios', component: VoluntariosHomeComponent },
      { path: 'niños', component: NinosHomeComponent },
      { path: 'administracion-contenido', component: AdminContenidoComponent },
      { path: 'actividades', component: ActividadesHomeComponent },
      { path: 'donaciones', component: DonacionesHomeComponent },
      { path: 'noticias-crud', component: NoticiasNinosHomeComponent },
    ],
  },
  {
    path: 'padrino',
    component: NavbarPadrinoHomeComponent,
    children: [
      { path: 'perfil', component: PerfilComponent },
      { path: 'dashboard', component: DashboardPadrinosHomeComponent },
      { path: 'ninos-bitacora', component: NinosBitacoraComponent },
      { path: 'ninos-apadrinados', component: NinosApadrinadosComponent },
      { path: 'progreso-ninos', component: ProgresoNinosComponent },
    ],
  },

  // Ruta combinada: solo usuarios con ambos roles la verán
  {
    path: 'admin-padrino',
    component: NavbarAdminPadrinoComponent, // Navbar combinado siempre visible
    children: [
      // Padrino dentro del combinado
      {
        path: 'padrino',
        component: NavbarPadrinoHomeComponent,
        children: [
          { path: 'dashboard', component: DashboardPadrinosHomeComponent },
          { path: 'ninos-bitacora', component: NinosBitacoraComponent },
          { path: 'ninos-apadrinados', component: NinosApadrinadosComponent },
          { path: 'perfil', component: PerfilComponent },
          { path: 'progreso-ninos', component: ProgresoNinosComponent },

        ]
      },
      // Admin dentro del combinado
      {
        path: 'admin',
        component: NavbarHomeComponent,
        children: [
          { path: 'dashboard', component: DashboardHomeComponent },
          { path: 'usuarios', component: UsuariosHomeComponent },
          { path: 'padrinos', component: PadrinosHomeComponent },
          { path: 'voluntarios', component: VoluntariosHomeComponent },
          { path: 'niños', component: NinosHomeComponent },
          { path: 'administracion-contenido', component: AdminContenidoComponent },
          { path: 'actividades', component: ActividadesHomeComponent },
          { path: 'donaciones', component: DonacionesHomeComponent },
          { path: 'perfil', component: PerfilComponent },
          { path: 'noticias-crud', component: NoticiasNinosHomeComponent }
        ]
      }
    ]
  },

  { path: '**', redirectTo: '' }, // comodín
];

