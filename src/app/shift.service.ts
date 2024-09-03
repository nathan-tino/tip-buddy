import { Injectable } from "@angular/core";
import { ShiftData } from "./add-shift/shift.model";
import { AddShiftModel } from "./add-shift/add-shift.model";

@Injectable({ providedIn: 'root' })
export class ShiftService {
    private shifts: ShiftData[] = [];

    constructor() {
        const shifts = localStorage.getItem('shifts');

        if (shifts) {
            this.shifts = JSON.parse(shifts);
        }
    }

    getShifts() {
        return this.shifts;
    }

    addShift(shift: AddShiftModel) {
        this.shifts.push({
            id: new Date().getTime().toString(),
            date: shift.date,
            creditTips: shift.creditTips,
            cashTips: shift.cashTips,
            tipout: shift.tipout,
            hoursWorked: shift.hoursWorked
        });
        this.saveShifts();
    }

    private saveShifts() {
      localStorage.setItem('shifts', JSON.stringify(this.shifts));
    }
}