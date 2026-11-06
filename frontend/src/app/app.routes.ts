import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

// Chaque page est chargée à la demande : le visiteur de la page d'accueil
// ne télécharge pas le code de l'espace connecté.
export const routes: Routes = [
  // Page publique de présentation ; l'espace connecté commence à /dashboard
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'clients',
        loadComponent: () => import('./features/clients/clients.component').then((m) => m.ClientsComponent),
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/projects.component').then((m) => m.ProjectsComponent),
      },
      {
        path: 'invoices',
        loadComponent: () => import('./features/invoices/invoices.component').then((m) => m.InvoicesComponent),
      },
      {
        path: 'invoices/:id',
        loadComponent: () =>
          import('./features/invoices/invoice-document.component').then((m) => m.InvoiceDocumentComponent),
      },
      {
        path: 'notes',
        loadComponent: () => import('./features/notes/notes.component').then((m) => m.NotesComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
