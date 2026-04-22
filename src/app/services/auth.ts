import { Injectable} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../auth/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

    private readonly apiUrl = 'http://localhost:8080/login/auth';


    constructor(private readonly http: HttpClient) {}

    login(email: string, password: string): Observable<Partial<User>> 
    {
        const body = { email, password };
        return this.http.post<Partial<User>>(this.apiUrl, body);
    }
}