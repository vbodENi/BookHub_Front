import { Component, signal } from '@angular/core';
import { Login } from "./auth/pages/login/login";

@Component({
  selector: 'app-root',
  imports: [Login],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('book_hub');
}
