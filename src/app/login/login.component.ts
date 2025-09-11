import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { Router, RouterLink } from '@angular/router';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [FormsModule, RouterLink],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent {
	userName = '';
	password = '';
	error: string | null = null;

	constructor(private authService: AuthService, private router: Router) { }

	login() {
		const dto: LoginDto = { userName: this.userName, password: this.password };
		this.authService.login(dto).subscribe({
			next: (res) => {
				this.error = null;

				this.router.navigate(['/shifts']);
			},
			error: (err) => {
				this.error = err.error?.message || 'Login failed. Please try again.';
			}
		});
	}
}
