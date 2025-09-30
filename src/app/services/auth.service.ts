
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
	private loginUrl = `${environment.apiBaseUrl}/auth/login`;
	private registerUrl = `${environment.apiBaseUrl}/auth/register`;
	private logoutUrl = `${environment.apiBaseUrl}/auth/logout`;
	private demoUrl = `${environment.apiBaseUrl}/auth/demo`;
	private meUrl = `${environment.apiBaseUrl}/auth/me`;

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
				this.clearClientState();
			})
		);
	}

	private clearClientState(): void {
		// Clear any client-side storage if needed in the future
		// For now, we're using HttpOnly cookies managed by the server
		// This method is placeholder for future client-side state clearing
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

	/**
	 * Verifies the current user session by calling the backend /auth/me endpoint.
	 * This method is called on app initialization to restore authentication state
	 * after page reloads. It updates the isLoggedIn$ and isDemoUser$ observables
	 * based on the server response.
	 * @returns Observable<AuthResponse> - The auth response from the server
	 */
	verifySession(): Observable<AuthResponse> {
		return this.http.get<AuthResponse>(this.meUrl, { withCredentials: true }).pipe(
			tap((response) => {
				this._isLoggedIn.next(true);
				this._isDemoUser.next(response.isDemo || false);
			}),
			catchError(err => {
				this._isLoggedIn.next(false);
				this._isDemoUser.next(false);
				return throwError(() => err);
			})
		);
	}
}
