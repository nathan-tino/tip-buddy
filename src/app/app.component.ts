import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [HeaderComponent, RouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

	constructor(private authService: AuthService, private router: Router) { }

	ngOnInit(): void {
		// Verify session on app initialization
		this.authService.verifySession().subscribe({
			next: () => {
				// Session is valid, user is authenticated
				console.log('User session verified');
				// If currently on login page and user is authenticated, redirect to shifts
				if (this.router.url === '/login') {
					this.router.navigate(['/shifts']);
				}
			},
			error: (err) => {
				// Session is invalid or expired, user is not authenticated
				console.log('Session verification failed:', err);
				// If not already on login or register page, redirect to login
				if (this.router.url !== '/login' && this.router.url !== '/register') {
					this.router.navigate(['/login']);
				}
			}
		});
	}
}
