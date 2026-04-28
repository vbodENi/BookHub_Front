import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService 
{
   private readonly apiUrl = 'http://localhost:8080/api/loans/my';

  constructor(private readonly http: HttpClient) {}

  getLoans(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(this.apiUrl, { headers });
  }
}