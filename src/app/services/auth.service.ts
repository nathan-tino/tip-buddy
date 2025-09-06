
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { AuthResponse, RegisterResponse } from '../dtos/auth-response.dto';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loginUrl = `${environment.apiBaseUrl}/api/Auth/login`;
  private registerUrl = `${environment.apiBaseUrl}/api/Auth/register`;

  constructor(private http: HttpClient) {}

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.loginUrl, dto, { withCredentials: true });
  }
  
  register(dto: RegisterDto): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.registerUrl, dto, { withCredentials: true });
  }
}
