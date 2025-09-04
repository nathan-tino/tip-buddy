
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loginUrl = `${environment.apiBaseUrl}/api/Auth/login`;
  private registerUrl = `${environment.apiBaseUrl}/api/Auth/register`;

  constructor(private http: HttpClient) {}

  login(dto: LoginDto): Observable<any> {
    return this.http.post<any>(this.loginUrl, dto);
  }
  
  register(dto: RegisterDto): Observable<any> {
    return this.http.post<any>(this.registerUrl, dto);
  }
}
