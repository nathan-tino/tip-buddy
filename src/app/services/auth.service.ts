
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { AuthResponse, RegisterResponse } from '../dtos/auth-response.dto';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
	// TODO: Implement verify authentication by calling a protected backend endpoint (e.g., /api/Auth/me)
	private loginUrl = `${environment.apiBaseUrl}/auth/login`;
	private registerUrl = `${environment.apiBaseUrl}/auth/register`;
	private logoutUrl = `${environment.apiBaseUrl}/auth/logout`;
	private demoUrl = `${environment.apiBaseUrl}/auth/demo`;

	private _isLoggedIn = new BehaviorSubject<boolean>(false);
	isLoggedIn$ = this._isLoggedIn.asObservable();

	private _isDemoUser = new BehaviorSubject<boolean>(false);
	isDemoUser$ = this._isDemoUser.asObservable();

	constructor(private http: HttpClient) { }

	login(dto: LoginDto): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(this.loginUrl, dto, { withCredentials: true }).pipe(
			tap(() => this._isLoggedIn.next(true)),
			catchError(err => {
				this._isLoggedIn.next(false);
				return throwError(() => err);
			})
		);
	}

	register(dto: RegisterDto): Observable<RegisterResponse> {
		return this.http.post<RegisterResponse>(this.registerUrl, dto, { withCredentials: true });
	}

	logout(): Observable<void> {
		return this.http.post<void>(this.logoutUrl, {}, { withCredentials: true }).pipe(
			tap(() => {
				this._isLoggedIn.next(false);
				this._isDemoUser.next(false);
			})
		);
	}

	demoLogin(): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(this.demoUrl, {}, { withCredentials: true }).pipe(
			tap(() => {
				this._isLoggedIn.next(true);
				this._isDemoUser.next(true);
			}),
			catchError(err => {
				this._isLoggedIn.next(false);
				this._isDemoUser.next(false);
				return throwError(() => err);
			})
		);
	}
}
