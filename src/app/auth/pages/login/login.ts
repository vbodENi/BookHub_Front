import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { User } from '../../user';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private readonly authService = inject(AuthService);

  user: User = new User('', '', '');

  onSubmit(loginForm: any)
  {
    this.authService.login(this.user.email, this.user.password).subscribe({
      next: (user) => {
        console.log('Logged in:', user);
      },
      error: (err) => {
        console.error('Login failed:', err);
      }
    });
  }
}