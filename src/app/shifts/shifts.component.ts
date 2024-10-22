import { Component, OnInit } from '@angular/core';

import { ShiftService } from '../shift.service';
import { ShiftComponent } from './shift/shift.component';
import { GetShiftDto } from '../dtos/get-shift.dto';
import { AddEditShiftComponent } from "./add-edit-shift/add-edit-shift.component";
import { DatePipe } from '@angular/common';

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

  constructor(private shiftService: ShiftService) { }

  ngOnInit(): void {
    this.getFirstAndLastDayOfWeek(new Date());
    this.loadShifts();
  }

  loadShifts(): void {
    this.shiftService.getShifts(this.firstDayOfInterval, this.lastDayOfInterval)
      .subscribe((shifts: GetShiftDto[]) => {
        this.shifts = shifts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
      this.shifts = [...this.shifts, shift].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
      ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    this.isEditingShift = false;
  }

  onDeleteShift(id: number) {
    this.shiftService.deleteShift(id).subscribe({
      next: () => {
        console.log('Shift deleted successfully');
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
      this.firstDayOfInterval = new Date(this.firstDayOfInterval);
      this.firstDayOfInterval.setDate(this.firstDayOfInterval.getDate() + days);

      this.lastDayOfInterval = new Date(this.lastDayOfInterval);
      this.lastDayOfInterval.setDate(this.lastDayOfInterval.getDate() + days);
    }
  }

  // TODO: Move to service
  getFirstAndLastDayOfWeek(dateInWeek: Date) {
    const dayOfWeek = dateInWeek.getDay(); // 0 (Sunday) to 6 (Saturday)
    
    // First day of the week (Sunday)
    this.firstDayOfInterval = new Date(dateInWeek);
    this.firstDayOfInterval.setDate(dateInWeek.getDate() - dayOfWeek);

    // Last day of the week (Saturday)
    this.lastDayOfInterval = new Date(dateInWeek);
    this.lastDayOfInterval.setDate(dateInWeek.getDate() + (6 - dayOfWeek));
  }
}
