import { Routes } from '@angular/router';

export const routes: Routes = [
{
     path: 'catalogue',
     loadComponent: () => import('./books/pages/book-list/book-list').then(m => m.BookList)
}
];
