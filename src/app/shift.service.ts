import { Injectable } from "@angular/core";

import { GetShiftDto } from "./dtos/get-shift.dto";
import { AddEditShiftModel } from "./shifts/add-edit-shift/add-edit-shift.model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CreateShiftDto } from "./dtos/create-shift.dto";
import { UpdateShiftDto } from "./dtos/update-shift.dto";

@Injectable({ providedIn: 'root' })
export class ShiftService {
    private shifts: GetShiftDto[] = [];
    private apiUrl = 'https://localhost:7001/api/shifts';

    constructor(private http: HttpClient) { }

    getShifts(): Observable<GetShiftDto[]> {
        console.log('Fetching shifts from API...');
        return this.http.get<GetShiftDto[]>(this.apiUrl);
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
}