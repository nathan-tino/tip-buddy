import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { Router, RouterLink } from '@angular/router';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		FormsModule, 
		RouterLink,
		ButtonModule,
		CardModule,
		InputTextModule,
		PasswordModule,
		MessageModule,
		FloatLabelModule
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent {
	userName = '';
	password = '';
	error: string | null = null;
	isLoading = false;

	constructor(private authService: AuthService, private router: Router) { }

	login() {
		if (!this.userName.trim() || !this.password.trim()) {
			this.error = 'Please enter both username and password.';
			return;
		}

		this.isLoading = true;
		const dto: LoginDto = { userName: this.userName, password: this.password };
		
		this.authService.login(dto).subscribe({
			next: (res) => {
				this.error = null;
				this.isLoading = false;
				this.router.navigate(['/shifts']);
			},
			error: (err) => {
				this.error = err.error?.message || 'Login failed. Please try again.';
				this.isLoading = false;
			}
		});
	}

	demoLogin() {
		this.isLoading = true;
		this.error = null;

		this.authService.demoLogin().subscribe({
			next: (res) => {
				this.isLoading = false;
				this.router.navigate(['/shifts']);
			},
			error: (err) => {
				this.error = err.error?.message || 'Demo login failed. Please try again.';
				this.isLoading = false;
			}
		});
	}
}
