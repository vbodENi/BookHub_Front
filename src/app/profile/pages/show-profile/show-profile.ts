import { Component, inject, OnInit, signal } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-profile',
  imports: [],
  templateUrl: './show-profile.html',
  styleUrl: './show-profile.scss',
})
export class ShowProfile implements OnInit {

  private readonly profileService = inject(ProfileService);
  private readonly router         = inject(Router);

  // ── Signals ─────────────────────────────────────────────────────
  readonly isLoading    = this.profileService.isLoading;
  readonly errorMessage = this.profileService.errorMessage;
  readonly profile      = this.profileService.profile;

  // Signal local — confirmation suppression
  readonly showDeleteConfirm = signal<boolean>(false);

  // ── Cycle de vie ────────────────────────────────────────────────
  ngOnInit(): void {
    const token = sessionStorage.getItem("token")
    if(token) {
      this.profileService.getProfile().subscribe();
    }

  }

  // ── Méthodes ────────────────────────────────────────────────────

  // Retourne les initiales pour l'avatar (ex: MD pour Marie Dupont)
  getInitials(): string {
    const profile = this.profile();
    if (!profile) return '';
    return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  }

  navigateToEdit(): void {
    this.router.navigate(['/profile/edit']);
  }

  confirmDelete(): void {
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
  }

  deleteAccount(): void {
    this.profileService.deleteAccount().subscribe({
      next: () => this.router.navigate(['/register']),
      error: () => {}
    });
  }
}
