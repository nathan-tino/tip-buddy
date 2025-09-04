

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userName = '';
  password = '';
  error: string | null = null;

  constructor(private authService: AuthService) {}

  login() {
    const dto: LoginDto = { userName: this.userName, password: this.password };
    this.authService.login(dto).subscribe({
      next: (res) => {
        // Handle successful login (e.g., save token, redirect)
        this.error = null;
      },
      error: (err) => {
        this.error = 'Login failed';
      }
    });
  }
}
