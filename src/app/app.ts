import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './partials/header/header';
import { Footer } from './partials/footer/footer';
import { Register } from './auth/pages/register/register';
import { Login } from './auth/pages/login/login';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('book_hub');

}
