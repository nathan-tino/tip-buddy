import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ShiftService } from '../services/shift.service';
import { ShiftComponent } from './shift/shift.component';
import { GetShiftDto } from '../dtos/get-shift.dto';
import { AddEditShiftComponent } from "./add-edit-shift/add-edit-shift.component";
import { DateService } from '../services/date.service';

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [ShiftComponent, AddEditShiftComponent, DatePipe],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.css'
})
export class ShiftsComponent implements OnInit {
  isAddingShift = false;
  isEditingShift = false;
  shifts: GetShiftDto[] = [];
  activeShift: GetShiftDto | null = null;
  firstDayOfInterval: Date | undefined;
  lastDayOfInterval: Date | undefined;

  constructor(private shiftService: ShiftService, private dateService: DateService) { }

  ngOnInit(): void {
    const { firstDayOfWeek, lastDayOfWeek } = this.dateService.getFirstAndLastDayOfWeek(new Date());
    this.firstDayOfInterval = firstDayOfWeek;
    this.lastDayOfInterval = lastDayOfWeek;
    
    this.loadShifts();
  }

  loadShifts(): void {
    this.shiftService.getShifts(this.firstDayOfInterval, this.lastDayOfInterval)
      .subscribe((shifts: GetShiftDto[]) => {
        this.shifts = shifts.sort(this.shiftService.sortByDateAscending);
      });
  }

  onAddShift() {
    this.isAddingShift = true;
  }

  onFinishAddShift(shift: GetShiftDto | undefined) {
    if (shift) {
      // Not pushing "shifts.push(shift)" the new shift to the array because we don't
      // want to edit the array in place.
      // Use "spread syntax" here to copy the old array to the new array along w/ new shift
      this.shifts = [...this.shifts, shift].sort(this.shiftService.sortByDateAscending);
    }

    this.isAddingShift = false;
  }

  onEditShift(shift: GetShiftDto) {
    this.activeShift = shift;
    this.isEditingShift = true;
  }

  onFinishEditShift(updatedShift: GetShiftDto | undefined) {
    if (updatedShift) {
      // Similar thing done here as in onFinishAddShift: assigning new array to this.shifts
      this.shifts = this.shifts.map(shift =>
        shift.id === updatedShift.id ? {
          id: updatedShift.id,
          creditTips: updatedShift.creditTips,
          cashTips: updatedShift.cashTips,
          tipout: updatedShift.tipout,
          date: updatedShift.date,
          hoursWorked: updatedShift.hoursWorked
        } : shift
      ).sort(this.shiftService.sortByDateAscending);
    }
    this.isEditingShift = false;
  }

  onDeleteShift(id: number) {
    this.shiftService.deleteShift(id).subscribe({
      next: () => {
        console.log('Shift deleted successfully');
        // TODO: show a dialog on success
        const index = this.shifts.findIndex(shift => shift.id === id);
        if (index !== -1) {
          this.shifts.splice(index, 1);
        }
      },
      error: (err) => {
        console.error('Error deleting shift', err);
        // TODO: Handle error scenario, like showing an error message
      }
    });
  }

  onNextInterval() {
    this.updateInterval(7);
    this.loadShifts();
  }

  onPreviousInterval() {
    this.updateInterval(-7);
    this.loadShifts();
  }

  updateInterval(days: number) {
    if (this.firstDayOfInterval && this.lastDayOfInterval) {
      this.firstDayOfInterval = this.dateService.addDaysToDate(this.firstDayOfInterval, days);
      this.lastDayOfInterval = this.dateService.addDaysToDate(this.lastDayOfInterval, days);
    }
  }
}
