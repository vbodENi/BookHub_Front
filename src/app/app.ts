import { Component, signal } from '@angular/core';
import { Login } from "./auth/pages/login/login";
import { RouterOutlet } from "@angular/router";
import { Register } from "./auth/pages/register/register";

@Component({
  selector: 'app-root',
  imports: [Login, RouterOutlet, Register],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('book_hub');
}
