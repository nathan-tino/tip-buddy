import { Injectable } from "@angular/core";

import { Shift } from "./models/shift.model";
import { AddEditShiftModel } from "./shifts/add-edit-shift/add-edit-shift.model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ShiftService {
    private shifts: Shift[] = [];
    private apiUrl = 'https://localhost:7001/api/shifts';

    constructor(private http: HttpClient) { }

    getShifts() {
        console.log('Fetching shifts from API...');
        return this.http.get<Shift[]>(this.apiUrl);
    }

    addShift(shift: AddEditShiftModel) {
        this.shifts.push({
            id: new Date().getTime(),
            date: shift.date,
            creditTips: shift.creditTips,
            cashTips: shift.cashTips,
            tipout: shift.tipout,
            hoursWorked: shift.hoursWorked
        });
        this.saveShifts();
    }

    deleteShift(id: number) {
        this.shifts = this.shifts.filter((shift) => shift.id !== id);
        this.saveShifts();
    }

    editShift(shiftId: number, shift: AddEditShiftModel) {
        let shiftToUpdate = this.shifts.find(x => x.id === shiftId);
        
        if (shiftToUpdate !== undefined) {
            shiftToUpdate.creditTips = shift.creditTips;
            shiftToUpdate.cashTips = shift.cashTips;
            shiftToUpdate.tipout = shift.tipout;
            shiftToUpdate.date = shift.date;
            shiftToUpdate.hoursWorked = shift.hoursWorked;

            this.shifts[this.shifts.findIndex(x => x.id === shiftId)] = shiftToUpdate;
            this.saveShifts()
        }

        //TODO: throw exception or sumting
    }

    private saveShifts() {
      localStorage.setItem('shifts', JSON.stringify(this.shifts));
    }
}