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
    const { firstDay, lastDay } = this.getFirstAndLastDayOfCurrentWeek();

    this.shiftService.getShifts(firstDay, lastDay).subscribe((shifts: GetShiftDto[]) => {
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

  private getFirstAndLastDayOfCurrentWeek(): { firstDay: Date; lastDay: Date } {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
    
    // First day of the week (Sunday)
    const firstDay = new Date(now);
    firstDay.setDate(now.getDate() - dayOfWeek);

    // Last day of the week (Saturday)
    const lastDay = new Date(now);
    lastDay.setDate(now.getDate() + (6 - dayOfWeek));

    return { firstDay, lastDay };
  }
}
