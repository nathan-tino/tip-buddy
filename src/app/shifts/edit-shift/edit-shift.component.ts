import { Component, input, output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ShiftModel } from '../shift/shift.model';
import { ShiftService } from '../../shift.service';

@Component({
  selector: 'app-edit-shift',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-shift.component.html',
  styleUrl: './edit-shift.component.css'
})
export class EditShiftComponent {
  shift = input.required<ShiftModel>();
  close = output();

  creditTipsInput!: number;
  cashTipsInput!: number;
  tipoutInput!: number;
  dateInput!: string;
  hoursWorkedInput?: number;

  constructor(private shiftService: ShiftService) {}

  //Use ngOnInit here because we can't access this.shift() in constructor
  ngOnInit() {
    this.creditTipsInput = this.shift().creditTips;
    this.cashTipsInput = this.shift().cashTips;
    this.tipoutInput = this.shift().tipout;
    this.dateInput = this.shift().date;
    this.hoursWorkedInput = this.shift().hoursWorked;
  }

  onCancel() {
    this.close.emit();
  }

  onSubmit() {
    this.shiftService.editShift(this.shift().id, {
      creditTips: this.creditTipsInput,
      cashTips: this.cashTipsInput,
      tipout: this.tipoutInput,
      date: this.dateInput,
      hoursWorked: this.hoursWorkedInput
    });
    this.close.emit();
  }
}
