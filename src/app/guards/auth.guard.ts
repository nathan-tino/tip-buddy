import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, take, catchError, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) { }

	canActivate(): Observable<boolean> {
		return this.authService.isLoggedIn$.pipe(
			take(1), // Take a single value and complete. Not putting `take(1)` would make this observable listen indefinitely.
			switchMap(isLoggedIn => {
				if (isLoggedIn) {
					return of(true);
				} else {
					// Try to verify session before redirecting
					return this.authService.verifySession().pipe(
						map(() => {
							// Session verification successful, user is authenticated
							return true;
						}),
						catchError(() => {
							// Session verification failed, redirect to login
							this.router.navigate(['/login']);
							return of(false);
						})
					);
				}
			})
		);
	}
}