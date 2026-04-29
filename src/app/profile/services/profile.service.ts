import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { ProfileResponseDTO, ProfileUpdateRequestDTO } from '../../auth/user';

interface ServiceResponse<T> {
  code: string;
  message: string;
  data: T | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/profile';

  // Signal
  readonly isLoading    = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly profile      = signal<ProfileResponseDTO | null>(null);
  readonly updateSuccess = signal(false);

  // Méthode privée pour récupérer le token et construire le header
  private getHeaders(): { Authorization: string } {
    const token = sessionStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  // pour récupérer les données du profil de l'utilisateur connecté
  getProfile(): Observable<ServiceResponse<ProfileResponseDTO>> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    return this.http
      .get<ServiceResponse<ProfileResponseDTO>>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        tap((response) => this.profile.set(response.data)),
        catchError((error: HttpErrorResponse) => this.handleError(error)),
        finalize(() => this.isLoading.set(false))
      );
  }

  // pour mettre à jour les données du profil de l'utilisateur
  updateProfile(payload: ProfileUpdateRequestDTO): Observable<ServiceResponse<ProfileResponseDTO>> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.updateSuccess.set(false);

    return this.http
      .put<ServiceResponse<ProfileResponseDTO>>(this.apiUrl, payload, { headers: this.getHeaders() })
      .pipe(
        tap((response) => {
          this.profile.set(response.data);
          this.updateSuccess.set(true);
        }),
        catchError((error: HttpErrorResponse) => this.handleError(error)),
        finalize(() => this.isLoading.set(false))
      );
  }

  // pour supprimer le compte de l'utilisateur
  deleteAccount(): Observable<ServiceResponse<void>> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    return this.http
      .delete<ServiceResponse<void>>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error)),
        finalize(() => this.isLoading.set(false))
      );
  }

  // pour réinitialiser les messages d'erreur et de succès
  resetState(): void {
    this.errorMessage.set(null);
    this.updateSuccess.set(false);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = "Une erreur inattendue s'est produite.";

    switch (error.status) {
      case 400: message = 'Données invalides.'; break;
      case 401: message = 'Session expirée. Veuillez vous reconnecter.'; break;
      case 0:   message = 'Impossible de contacter le serveur.'; break;
    }

    this.errorMessage.set(message);
    return throwError(() => new Error(message));
  }
}
