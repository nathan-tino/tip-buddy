import { Component } from '@angular/core';
import { PASSWORD_REQUIREMENTS } from './password-requirements';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  phoneNumber?: number;
  userName = '';
  email = '';
  password = '';
  error: string | null = null;
  success: string | null = null;
  submitted = false;

  passwordRequirements = PASSWORD_REQUIREMENTS;
  get passwordRequirementStatus() {
    return this.passwordRequirements.map(req => ({
      ...req,
      met: req.validate(this.password)
    }));
  }

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: any) {
    this.submitted = true;
    if (!form.valid) {
      return;
    }
    const dto: RegisterDto = {
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      userName: this.userName || this.email,
      email: this.email,
      password: this.password
    };
    this.authService.register(dto).subscribe({
      next: (res) => {
        this.success = 'Registration successful!';
        this.error = null;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = 'Registration failed';
        this.success = null;
      }
    });
  }
}
