import { Component, input, OnChanges, output } from '@angular/core';
import { GetShiftDto } from '../../dtos/get-shift.dto';
import { DateService } from '../../services/date.service';
import { DayComponent } from '../day/day.component';

@Component({
  selector: 'app-week',
  standalone: true,
  imports: [DayComponent],
  templateUrl: './week.component.html',
  styleUrl: './week.component.css'
})
export class WeekComponent implements OnChanges {
  firstDay = input.required<Date>();
  shifts = input.required<GetShiftDto[]>();
  addShift = output<Date>();
  editShift = output<GetShiftDto>();
  deleteShift = output<number>();
  
  daysOfWeek: number[] = [0, 1, 2, 3, 4, 5, 6];
  daysAndShifts: { date: Date, shifts: any }[] = [];

  constructor(private dateService: DateService) { }

  ngOnChanges(): void {
    this.populateDaysAndShifts();
  }
  
  onAddShift(date: Date) {
    this.addShift.emit(date);
  }

  onEditShift(shift: GetShiftDto) {
    if (shift) {
      this.editShift.emit(shift);
    }
  }

  onDeleteShift(id: number) {
    this.deleteShift.emit(id);
  }

  private populateDaysAndShifts() {
    this.daysAndShifts = [];

    for (let day of this.daysOfWeek) {
      const date = this.dateService.addDaysToDate(this.firstDay(), day);
      let shiftsOnThisDate = this.shifts().filter(s =>
        new Date(s.date).getFullYear() === date.getFullYear() &&
        new Date(s.date).getMonth() === date.getMonth() &&
        new Date(s.date).getDate() === date.getDate()
      );

      this.daysAndShifts.push({
        date: date,
        shifts: shiftsOnThisDate
      });
    }
  }
}
