import { ShiftsSummaryDto } from '../dtos/shifts-summary.dto';
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

import { GetShiftDto } from "../dtos/get-shift.dto";
import { CreateShiftDto } from "../dtos/create-shift.dto";
import { UpdateShiftDto } from "../dtos/update-shift.dto";
import { environment } from "../../environments/environment";

function parseShiftDate<T extends { date: Date }>(shift: T): T & { date: Date } {
    return { ...shift, date: new Date(shift.date) };
}

@Injectable({ providedIn: 'root' })
export class ShiftService {
    private apiUrl = `${environment.apiBaseUrl}/shifts`;

    constructor(private http: HttpClient) { }

    getShifts(startDate?: Date, endDate?: Date): Observable<GetShiftDto[]> {
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

    getShiftsSummary(startDate: Date, endDate: Date): Observable<ShiftsSummaryDto> {
        return this.getShifts(startDate, endDate).pipe(
            map(shifts => this.calculateShiftsSummary(shifts))
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

    calculateShiftsSummary(shifts: GetShiftDto[]): ShiftsSummaryDto {
        if (shifts.length === 0) {
            return {
                totalTips: 0,
                averageTipsPerShift: 0,
                cashTipsTotal: 0,
                creditTipsTotal: 0,
                totalTipout: 0,
                cashTipsPercentage: 0,
                creditTipsPercentage: 0,
                tipsPerHour: 0,
                totalShifts: 0,
                totalHoursWorked: 0,
                shifts: []
            };
        }

        const totalTipout = shifts.reduce((sum, s) => sum + (s.tipout || 0), 0);
        const cashTipsTotal = shifts.reduce((sum, s) => sum + s.cashTips, 0);
        const rawCreditTipsTotal = shifts.reduce((sum, s) => sum + s.creditTips, 0);
        const creditTipsTotal = rawCreditTipsTotal - totalTipout;
        const totalTips = cashTipsTotal + creditTipsTotal;
        const totalShifts = shifts.length;
        const totalHoursWorked = shifts
            .filter(s => s.hoursWorked !== undefined && s.hoursWorked !== null)
            .reduce((sum, s) => sum + s.hoursWorked!, 0);
        const averageTipsPerShift = totalShifts > 0 ? totalTips / totalShifts : 0;
        const cashTipsPercentage = totalTips > 0 ? (cashTipsTotal / totalTips) * 100 : 0;
        const creditTipsPercentage = totalTips > 0 ? (creditTipsTotal / totalTips) * 100 : 0;
        const tipsPerHour = totalHoursWorked > 0 ? totalTips / totalHoursWorked : 0;

        return {
            totalTips,
            averageTipsPerShift,
            cashTipsTotal,
            creditTipsTotal,
            totalTipout,
            cashTipsPercentage,
            creditTipsPercentage,
            tipsPerHour,
            totalShifts,
            totalHoursWorked,
            shifts
        };
    }
}
