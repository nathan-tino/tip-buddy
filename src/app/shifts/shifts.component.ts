import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ShiftService } from '../services/shift.service';
import { GetShiftDto } from '../dtos/get-shift.dto';
import { DateService } from '../services/date.service';
import { WeekComponent } from "./week/week.component";
import { AddShiftComponent } from './add-shift/add-shift.component';
import { EditShiftComponent } from './edit-shift/edit-shift.component';
import { SummaryComponent } from './summary/summary.component';

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [AddShiftComponent, EditShiftComponent, DatePipe, WeekComponent, SummaryComponent],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.css'
})
export class ShiftsComponent implements OnInit, OnDestroy {
    isAddingShift = false;
    isEditingShift = false;
    shifts: GetShiftDto[] = [];
    activeShift: GetShiftDto | null = null;
    firstDayOfInterval: Date | undefined;
    lastDayOfInterval: Date | undefined;
    dateToAddShift: Date | undefined;

    private destroy$ = new Subject<void>();

  constructor(private shiftService: ShiftService, private dateService: DateService) { }

  ngOnInit(): void {
    this.loadShiftsForDate();
  }

  loadShifts(): void {
    this.shiftService.getShifts(this.firstDayOfInterval!, this.lastDayOfInterval!)
      .pipe(takeUntil(this.destroy$))
      .subscribe((shifts: GetShiftDto[]) => {
        this.shifts = Array.isArray(shifts)
          ? shifts.sort(this.shiftService.sortByDateAscending)
          : [];
      });
  }

  onAddShift(date: Date | undefined) {
    this.dateToAddShift = date;
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
        // Use immutable update to avoid accidental in-place mutations
        this.shifts = this.shifts.filter(shift => shift.id !== id);
        this.updateShiftsSignal();
      },
      error: (err) => {
        console.error('Error deleting shift', err);
        // TODO: Handle error scenario, like showing an error message
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  loadShiftsForDate(date: Date | null = null) {
    if (!date) {
      date = new Date(new Date().setHours(0, 0, 0, 0));
    }

    const { firstDayOfWeek, lastDayOfWeek } = this.dateService.getFirstAndLastDayOfWeek(date);
    this.firstDayOfInterval = firstDayOfWeek;
    this.lastDayOfInterval = lastDayOfWeek;

    this.loadShifts();
  }

  updateShiftsSignal() {
    this.shifts = [...this.shifts];
  }

  onWeekPickerChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.value) return;

    this.loadShiftsForDate(new Date(input.value + 'T00:00:00'));
  }
}
