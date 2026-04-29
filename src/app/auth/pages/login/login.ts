import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { User } from '../../user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  user: User = new User('', '', '');

onSubmit(loginForm: any) {
  this.authService.login(this.user.email, this.user.password).subscribe({
    next: (response: any) => {
      console.log('Logged in:', response);
      // store token from response
      sessionStorage.setItem('token', response.data.token);

      this.authService.isAuthenticated.set(true);

      // redirect to home page
      this.router.navigate(['/']);

    },
    error: (err) => {
        const msg = err?.error?.message || 'Erreur inconnue';
        console.log(msg);
    }
  });
}
}
