import { Injectable } from "@angular/core";

import { ShiftModel } from "./shifts/shift/shift.model";
import { AddEditShiftModel } from "./shifts/add-edit-shift.model";

@Injectable({ providedIn: 'root' })
export class ShiftService {
    private shifts: ShiftModel[] = [];

    constructor() {
        const shifts = localStorage.getItem('shifts');

        if (shifts) {
            this.shifts = JSON.parse(shifts);
        }
    }

    getShifts() {
        return this.shifts;
    }

    addShift(shift: AddEditShiftModel) {
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

    deleteShift(id: string) {
        this.shifts = this.shifts.filter((shift) => shift.id !== id);
        this.saveShifts();
    }

    editShift(shiftId: string, shift: AddEditShiftModel) {
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