import { Routes } from '@angular/router';

export const routes: Routes = [
  /* {
    path: '',
    loadComponent: () => import('./home/home').then((c) => c.Home),
  }, */
  {
    path: 'register',
    loadComponent: () => import('./auth/pages/register/register').then((c) => c.Register),
  },
  
];
