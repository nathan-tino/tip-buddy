
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginDto } from '../dtos/login.dto';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/api/Auth/login`;

  constructor(private http: HttpClient) {}

  login(dto: LoginDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto);
  }
}
