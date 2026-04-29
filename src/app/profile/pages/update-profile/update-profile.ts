import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasswordValidators } from '../../../auth/pages/register/password.validators';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../services/profile.service';
import { Router, RouterLink } from '@angular/router';
import { ProfileUpdateRequestDTO } from '../../../auth/user';

@Component({
  selector: 'app-update-profile',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './update-profile.html',
  styleUrl: './update-profile.scss',
})
export class UpdateProfile implements OnInit, OnDestroy {

  // inject() au lieu du constructeur pour éviter le problème d'initialisation
  readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  updateForm = new FormGroup({
    firstName:   new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
    lastName:    new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
    phone:       new FormControl('', [Validators.pattern(/^(\+33|0)[1-9](\d{2}){4}$/)]),
    oldPassword: new FormControl(''),
    newPassword: new FormControl('', [
    (control) => {
        // Valide uniquement si le champ n'est pas vide, ce champ est optionnel
        if (!control.value) return null;
        return PasswordValidators.strongPassword()(control);
    }
]),
  });

  private subscription?: Subscription;
  formSubmitted     = signal<boolean>(false);
  showDeleteConfirm = signal<boolean>(false);

  // Signals — accessibles après inject()
  readonly isLoading     = this.profileService.isLoading;
  readonly errorMessage  = this.profileService.errorMessage;
  readonly updateSuccess = this.profileService.updateSuccess;

  constructor() {
    effect(() => {
      if (this.profileService.updateSuccess()) {
        setTimeout(() => this.router.navigate(['/profile']), 2000);
      }
    });
  }

  ngOnInit(): void {
    const profile = this.profileService.profile();
    if (profile) {
      this.updateForm.patchValue({
        firstName: profile.firstName,
        lastName:  profile.lastName,
        phone:     profile.phone,
      });
    } else {
      this.subscription = this.profileService.getProfile().subscribe((response) => {
        if (response.data) {
          this.updateForm.patchValue({
            firstName: response.data.firstName,
            lastName:  response.data.lastName,
            phone:     response.data.phone,
          });
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.profileService.resetState();
  }

  onSubmit(): void {
    this.formSubmitted.set(true);
    console.log('Form valid:', this.updateForm.valid);
    console.log('Form errors:', this.updateForm.errors);
    console.log('Form value:', this.updateForm.value);

    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, phone, oldPassword, newPassword } = this.updateForm.value;

    const payload = new ProfileUpdateRequestDTO(
      firstName ?? '',
      lastName ?? '',
      phone ?? '',
      oldPassword || undefined,
      newPassword || undefined
    );

    this.subscription = this.profileService.updateProfile(payload).subscribe();
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.updateForm.get(fieldName);
    return !!(control?.invalid && (control?.touched || this.formSubmitted()));
  }

  confirmDelete(): void {
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
  }

  deleteAccount(): void {
    this.subscription = this.profileService.deleteAccount().subscribe({
      next: () => this.router.navigate(['/register']),
      error: () => {}
    });
  }
}
