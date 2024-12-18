import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

import { GetShiftDto } from "../dtos/get-shift.dto";
import { CreateShiftDto } from "../dtos/create-shift.dto";
import { UpdateShiftDto } from "../dtos/update-shift.dto";

@Injectable({ providedIn: 'root' })
export class ShiftService {
    private apiUrl = 'https://localhost:7001/api/shifts';

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
    
        return this.http.get<GetShiftDto[]>(url);
    }

    addShift(shift: CreateShiftDto): Observable<GetShiftDto> {
        return this.http.post<GetShiftDto>(this.apiUrl, shift);
    }

    deleteShift(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    editShift(id: number, shift: UpdateShiftDto): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, shift);
    }

    sortByDateAscending(a: GetShiftDto, b: GetShiftDto): number {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
}