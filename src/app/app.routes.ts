import { Routes } from '@angular/router';

export const routes: Routes = [
  {
      path: '',
      loadComponent: () => import('./books/pages/book-list/book-list').then(m => m.BookList)
  },
    {
      path: 'register',
      loadComponent: () => import('./auth/pages/register/register').then((c) => c.Register),
    },
  {
      path: 'books/:id',
      loadComponent: () => import('./books/pages/book-detail/book-detail').then(m => m.BookDetail)
  },
];
