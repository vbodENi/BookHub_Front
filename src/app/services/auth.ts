import { computed, Injectable, signal} from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { RegisterRequestDTO, User } from '../auth/user';

interface ServiceResponse<T> {
  code: string;
  message: string;
  data: T | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

    /* private readonly apiUrl = 'http://localhost:8080/login/auth';


    constructor(private readonly http: HttpClient) {}

    login(email: string, password: string): Observable<Partial<User>>
    {
        const body = { email, password };
        return this.http.post<Partial<User>>(this.apiUrl, body);
    } */

        private readonly apiUrl = 'http://localhost:8080';

  // ── State (Signals) ─────────────────────────────────────────────
  private readonly _isLoading = signal(false);
  private readonly _errorMessage = signal<string | null>(null);
  private readonly _registrationSuccess = signal(false);
  private _currentUser = signal<User | null>(null);

  readonly isLoading = computed(() => this._isLoading());
  readonly errorMessage = computed(() => this._errorMessage());
  readonly registrationSuccess = computed(() => this._registrationSuccess());
  readonly currentUser = computed(() => this._currentUser());
  readonly isAuthenticated = computed(() => !!this._currentUser());

  constructor(private http: HttpClient) {}

  // ── Login ───────────────────────────────────────────────────────
  login(email: string, password: string): Observable<Partial<User>> {
    return this.http.post<Partial<User>>(
      `${this.apiUrl}/api/auth/login`,
      { email, password }
    );
  }

  // ── Register ────────────────────────────────────────────────────
  register(payload: RegisterRequestDTO): Observable<ServiceResponse<void>> {
    this.startLoading();

    return this.http
      .post<ServiceResponse<void>>(`${this.apiUrl}/api/auth/register`, payload)
      .pipe(
        tap(() => this._registrationSuccess.set(true)),
        catchError(this.handleError()),
        finalize(() => this._isLoading.set(false))
      );
  }

  // ── Helpers ─────────────────────────────────────────────────────
  private startLoading(): void {
    this._isLoading.set(true);
    this._errorMessage.set(null);
    this._registrationSuccess.set(false);
  }

  resetState(): void {
    this._errorMessage.set(null);
    this._registrationSuccess.set(false);
  }

  private handleError() {
    return (error: HttpErrorResponse) => {
      const message = this.extractErrorMessage(error);
      this._errorMessage.set(message);
      return throwError(() => new Error(message));
    };
  }

  private extractErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 409:
        return 'Cette adresse email est déjà utilisée.';
      case 400:
        return error.error?.message ?? 'Données invalides.';
      case 0:
        return 'Impossible de contacter le serveur.';
      default:
        return error.error?.message ?? "Une erreur inattendue s’est produite.";
    }
  }
}
