import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GetShiftDto } from '../../dtos/get-shift.dto';
import { ShiftService } from '../../services/shift.service';
import { DateService } from '../../services/date.service';
import { ShiftFormComponent } from '../shift-form/shift-form.component';

@Component({
  selector: 'app-edit-shift',
  standalone: true,
  imports: [FormsModule, ShiftFormComponent],
  template: `
    <app-shift-form
      [dateInput]="dateInput"
      [creditTipsInput]="creditTipsInput"
      [cashTipsInput]="cashTipsInput"
      [tipoutInput]="tipoutInput"
      [hoursWorkedInput]="hoursWorkedInput"
      (submit)="onSubmit()"
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
  hoursWorkedInput?: number;

  constructor(private shiftService: ShiftService, private dateService: DateService) { }

  ngOnInit() {
    if (this.shift) {
      const dateValue = new Date(this.shift.date);
      this.creditTipsInput = this.shift.creditTips;
      this.cashTipsInput = this.shift.cashTips;
      this.tipoutInput = this.shift.tipout;
      this.dateInput = dateValue.toISOString().slice(0, 10);
      this.hoursWorkedInput = this.shift.hoursWorked;
    }
  }

  onCancel() {
    this.close.emit(undefined);
  }

  onSubmit() {
    const updatedShift = {
      id: this.shift.id,
      creditTips: this.creditTipsInput,
      cashTips: this.cashTipsInput,
      tipout: this.tipoutInput,
      date: this.getDateInputWithTime()!,
      hoursWorked: this.hoursWorkedInput
    };
    this.shiftService.editShift(this.shift.id, updatedShift)
      .subscribe({
        next: (response) => {
          this.close.emit(updatedShift);
        },
        error: (e) => console.error(e)
      });
  }

  getDateInputWithTime(): Date | null {
    return this.dateService.convertStringToUtcDate(this.dateInput + 'T08:00:00');
  }
}
