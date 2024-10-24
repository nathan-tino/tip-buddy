import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { GetShiftDto } from '../../dtos/get-shift.dto';

@Component({
  selector: 'app-day',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './day.component.html',
  styleUrl: './day.component.css'
})
export class DayComponent {
  date = input.required<Date>();
  shifts = input<GetShiftDto[]>();
  editShift = output<GetShiftDto>();
  deleteShift = output<number>();

  onEditShift(shift: GetShiftDto) {
    if (shift) {
      this.editShift.emit(shift);
    }
  }

  onDeleteShift(id: number) {
    console.log('day component delete shift: ' + id);
    this.deleteShift.emit(id);
  }
}
