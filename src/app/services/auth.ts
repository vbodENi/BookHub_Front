import { Injectable} from '@angular/core';
import { UserLogin } from '../auth/pages/login/model/userLogin';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

    private readonly apiUrl = 'http://localhost:8080/login/auth';


    constructor(private readonly http: HttpClient) {}

    login(email: string, password: string): Observable<Partial<UserLogin>> 
    {
        const body = { email, password };
        return this.http.post<Partial<UserLogin>>(this.apiUrl, body);
    }
}