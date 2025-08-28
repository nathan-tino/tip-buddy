import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GetShiftDto } from '../../dtos/get-shift.dto';
import { ShiftService } from '../../services/shift.service';
import { DateService } from '../../services/date.service';
import { ShiftFormComponent } from '../shift-form/shift-form.component';
import { ShiftFormModel } from '../shift-form/shift-form.model';

@Component({
  selector: 'app-edit-shift',
  standalone: true,
  imports: [FormsModule, ShiftFormComponent],
  template: `
    <app-shift-form
      [title]="'Edit Shift'"
      [dateInput]="dateInput"
      [timeInput]="timeInput"
      [creditTipsInput]="shift.creditTips"
      [cashTipsInput]="shift.cashTips"
      [tipoutInput]="shift.tipout"
      [hoursWorkedInput]="shift.hoursWorked"
      (submitted)="onSubmit($event)"
      (cancel)="onCancel()"
    ></app-shift-form>
  `,
  styleUrl: './edit-shift.component.css'
})
export class EditShiftComponent implements OnInit {
  @Input() shift!: GetShiftDto;
  @Output() close = new EventEmitter<GetShiftDto | undefined>();

  dateInput!: string;
  timeInput!: string;

  constructor(private shiftService: ShiftService, private dateService: DateService) { }

  ngOnInit() {
    if (this.shift) {
      const dateValue = new Date(this.shift.date);
      this.dateInput = dateValue.toISOString().slice(0, 10);
      this.timeInput = dateValue.toISOString().slice(11, 19);
    }
  }

  onCancel() {
    this.close.emit(undefined);
  }

  onSubmit(shift: ShiftFormModel) {
    const updatedShift = {
      id: this.shift.id,
      creditTips: shift.creditTips,
      cashTips: shift.cashTips,
      tipout: shift.tipout,
      date: this.dateService.convertStringToUtcDate(shift.date, shift.time),
      hoursWorked: shift.hoursWorked
    };

    this.shiftService.editShift(this.shift.id, updatedShift)
      .subscribe({
        next: (response) => {
          this.close.emit(updatedShift);
        },
        error: (e) => console.error(e)
      });
  }
}
