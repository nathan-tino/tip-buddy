
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { AuthResponse, RegisterResponse } from '../dtos/auth-response.dto';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // TODO: Implement verify authentication by calling a protected backend endpoint (e.g., /api/Auth/me)
  private loginUrl = `${environment.apiBaseUrl}/api/Auth/login`;
  private registerUrl = `${environment.apiBaseUrl}/api/Auth/register`;
  private logoutUrl = `${environment.apiBaseUrl}/api/Auth/logout`;
  
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor(private http: HttpClient) {}

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.loginUrl, dto, { withCredentials: true }).pipe(
      tap(() => this._isLoggedIn.next(true)),
      catchError(err => {
        this._isLoggedIn.next(false);
        throw err;
      })
    );
  }
  
  register(dto: RegisterDto): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.registerUrl, dto, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post<any>(this.logoutUrl, {}, { withCredentials: true }).pipe(
      tap(() => this._isLoggedIn.next(false))
    );
  }
}
