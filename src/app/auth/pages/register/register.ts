import { CommonModule } from '@angular/common';
import { Component, effect, OnDestroy, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth';
import { RegisterRequestDTO } from '../../user';
import { PasswordValidators } from './password.validators';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnDestroy {

  // 1 les proprités du formulaire d'inscription avec les validations correspondantes

  registerForm = new FormGroup(
    {
      firstName:       new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      lastName:        new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      email:           new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]),
      phone:           new FormControl('', [Validators.pattern(/^(\+33|0)[1-9](\d{2}){4}$/)]),
      password:        new FormControl('', [Validators.required, PasswordValidators.strongPassword()]),
      confirmPassword: new FormControl('', [Validators.required]),
      acceptTerms:     new FormControl(false, [Validators.requiredTrue]),
    },
    { validators: PasswordValidators.passwordsMatch('password', 'confirmPassword') }
  );

  // création d'une variable vide pour stocker l'abonnement à la requête d'inscription
  private subscription?: Subscription;
  //sert à savoir si l'utilisateur a cliqué sur le bouton d'inscription, il est initialisé à false.
  formSubmitted = signal<boolean>(false);

  // 2 Constructeur

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    effect(() => {
      if (this.authService.registrationSuccess()) {
        setTimeout(() => this.router.navigate(['/login']), 2000);
      }
    });
  }

  // 3 Cycle de vie du composant

  ngOnDestroy(): void {
    // Si l'utilisateur quitte la page avant que la requête ne se termine, on évite les fuites de mémoire en se désabonnant
    this.subscription?.unsubscribe();
    this.authService.resetState();
  }

  // 4 Méthodes

  onSubmit(): void {
    // la variable passe à true pour indiquer que le formulaire a été soumis.
    this.formSubmitted.set(true);
    if (this.registerForm.invalid) {
      // Si le formulaire est invalide, on marque tous les champs comme touchés pour afficher les erreurs
      this.registerForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, password, phone } = this.registerForm.value;
    const payload = new RegisterRequestDTO(
      firstName ?? '',
      lastName ?? '',
      email ?? '',
      password ?? '',
      phone ?? ''
    );
    // On lance la requête d'inscription et on stocke l'abonnement pour pouvoir le nettoyer si besoin
    //si l'utilisateur quitte la page avant que la requête ne se termine, on évite les fuites de mémoire en se désabonnant
    this.subscription = this.authService.register(payload).subscribe();
  }
}
