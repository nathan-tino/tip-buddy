import { Component, OnInit } from '@angular/core';

import { ShiftService } from '../shift.service';
import { ShiftComponent } from './shift/shift.component';
import { GetShiftDto } from '../dtos/get-shift.dto';
import { AddEditShiftComponent } from "./add-edit-shift/add-edit-shift.component";

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [ShiftComponent, AddEditShiftComponent],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.css'
})
export class ShiftsComponent implements OnInit {
  isAddingShift = false;
  isEditingShift = false;
  shifts: GetShiftDto[] = [];
  activeShift: GetShiftDto | null = null;

  constructor(private shiftService: ShiftService) { }

  ngOnInit(): void {
    this.loadShifts();
  }

  loadShifts(): void {
    this.shiftService.getShifts().subscribe((shifts: GetShiftDto[]) => {
      this.shifts = shifts;
    });
    console.log('Shifts loaded:', this.shifts);
  }

  onAddShift() {
    this.isAddingShift = true;
  }

  onFinishAddShift(shift: GetShiftDto | undefined) {
    console.log('Finished adding shift' + shift);
    if (shift !== undefined) {
      this.shifts.push(shift);
    }

    this.isAddingShift = false;
  }

  onEditShift(shift: GetShiftDto) {
    console.log('editing shift: ' + shift);
    this.activeShift = shift;
    this.isEditingShift = true;
  }

  onFinishEditShift(updatedShift: GetShiftDto | undefined) {
    if (updatedShift !== undefined) {
      const index = this.shifts.findIndex(shift => shift.id === updatedShift.id);
      console.log('old value credit tips: ' + this.shifts[index].creditTips);
      console.log('new value credit tips: ' + updatedShift.creditTips);


      if (index !== -1) {
        this.shifts[index] = {
          id: this.shifts[index].id,
          date: updatedShift.date,
          creditTips: updatedShift.creditTips,
          cashTips: updatedShift.cashTips,
          tipout: updatedShift.tipout,
          hoursWorked: updatedShift.hoursWorked
        };
      }
    }

    this.isEditingShift = false;
  }

  onDeleteShift(id: number) {
    this.shiftService.deleteShift(id);
  }
}
