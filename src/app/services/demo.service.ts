import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DemoService {
	private resetDemoShiftsUrl = `${environment.apiBaseUrl}/demodata/reset-shifts`;

	constructor(private http: HttpClient) { }

	resetDemoShifts(): Observable<any> {
		return this.http.post<any>(this.resetDemoShiftsUrl, {}, { withCredentials: true });
	}
}