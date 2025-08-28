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
      [dateInput]="dateInput"
      [timeInput]="timeInput"
      [creditTipsInput]="creditTipsInput"
      [cashTipsInput]="cashTipsInput"
      [tipoutInput]="tipoutInput"
      [hoursWorkedInput]="hoursWorkedInput"
      (submitted)="onSubmit($event)"
      (cancel)="onCancel()"
    ></app-shift-form>
  `,
  styleUrl: './edit-shift.component.css'
})
export class EditShiftComponent implements OnInit {
  @Input() shift!: GetShiftDto;
  @Output() close = new EventEmitter<GetShiftDto | undefined>();

  creditTipsInput!: number;
  cashTipsInput!: number;
  tipoutInput!: number;
  dateInput!: string;
  timeInput!: string;
  hoursWorkedInput?: number;

  constructor(private shiftService: ShiftService, private dateService: DateService) { }

  ngOnInit() {
    if (this.shift) {
      const dateValue = new Date(this.shift.date);
      this.creditTipsInput = this.shift.creditTips;
      this.cashTipsInput = this.shift.cashTips;
      this.tipoutInput = this.shift.tipout;
      this.dateInput = dateValue.toISOString().slice(0, 10);
      this.timeInput = dateValue.toISOString().slice(11, 19);
      this.hoursWorkedInput = this.shift.hoursWorked;
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
      date: this.dateService.convertStringToUtcDate(shift.date, shift.time)!,
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
