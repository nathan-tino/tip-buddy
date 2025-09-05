import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

import { GetShiftDto } from "../dtos/get-shift.dto";
import { CreateShiftDto } from "../dtos/create-shift.dto";
import { UpdateShiftDto } from "../dtos/update-shift.dto";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class ShiftService {
    private apiUrl = `${environment.apiBaseUrl}/api/shifts`;

    constructor(private http: HttpClient) { }

    getShifts(startDate?: Date, endDate?: Date): Observable<GetShiftDto[]> {
        console.log('Fetching shifts from API...');
    
        let url = this.apiUrl;
    
        const params: string[] = [];
    
        if (startDate) {
            params.push(`startDate=${startDate.toISOString()}`);
        }
    
        if (endDate) {
            params.push(`endDate=${endDate.toISOString()}`);
        }
    
        if (params.length > 0) {
            url += '?' + params.join('&');
        }

        return this.http.get<GetShiftDto[]>(url, { withCredentials: true }).pipe(
            map(shifts => shifts.map(parseShiftDate))
        );
    }

    addShift(shift: CreateShiftDto): Observable<GetShiftDto> {
        return this.http.post<GetShiftDto>(this.apiUrl, shift, { withCredentials: true }).pipe(
            map(parseShiftDate));
    }

    deleteShift(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
    }

    editShift(id: number, shift: UpdateShiftDto): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, shift, { withCredentials: true });
    }

    sortByDateAscending(a: GetShiftDto, b: GetShiftDto): number {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
}

function parseShiftDate<T extends { date: Date }>(shift: T): T & { date: Date } {
  return { ...shift, date: new Date(shift.date) };
}
