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

  constructor(private shiftService: ShiftService) {
    this.getFirstAndLastDayOfWeek(new Date());
  }

  ngOnInit(): void {
    this.loadShifts();
  }

  loadShifts(): void {
    this.shiftService.getShifts(this.firstDayOfInterval, this.lastDayOfInterval).subscribe((shifts: GetShiftDto[]) => {
      this.shifts = shifts;
    });
  }

  onAddShift() {
    this.isAddingShift = true;
  }

  onFinishAddShift(shift: GetShiftDto | undefined) {
    if (shift !== undefined) {
      this.shifts.push(shift);
    }

    this.isAddingShift = false;
  }

  onEditShift(shift: GetShiftDto) {
    this.activeShift = shift;
    this.isEditingShift = true;
  }

  onFinishEditShift(updatedShift: GetShiftDto | undefined) {
    if (updatedShift !== undefined) {
      const index = this.shifts.findIndex(shift => shift.id === updatedShift.id);

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
    if (this.firstDayOfInterval) {
      this.firstDayOfInterval = new Date(this.firstDayOfInterval);
      this.firstDayOfInterval.setDate(this.firstDayOfInterval.getDate() + 7);
    }

    if (this.lastDayOfInterval) {
      this.lastDayOfInterval = new Date(this.lastDayOfInterval);
      this.lastDayOfInterval.setDate(this.lastDayOfInterval.getDate() + 7);
    }

    this.loadShifts();
  }

  onPreviousInterval() {
    if (this.firstDayOfInterval) {
      this.firstDayOfInterval = new Date(this.firstDayOfInterval);
      this.firstDayOfInterval.setDate(this.firstDayOfInterval.getDate() - 7);
    }

    if (this.lastDayOfInterval) {
      this.lastDayOfInterval = new Date(this.lastDayOfInterval);
      this.lastDayOfInterval.setDate(this.lastDayOfInterval.getDate() - 7);
    }

    this.loadShifts();
  }

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
