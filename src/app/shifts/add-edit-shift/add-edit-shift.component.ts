import { Component, input, output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Shift } from '../../models/shift.model';
import { ShiftService } from '../../shift.service';
import { CardComponent } from "../../shared/card/card.component";

@Component({
  selector: 'app-edit-shift',
  standalone: true,
  imports: [FormsModule, CardComponent],
  templateUrl: './add-edit-shift.component.html',
  styleUrl: './add-edit-shift.component.css'
})
export class AddEditShiftComponent {
  shift = input<Shift>();
  close = output();
  addingShift = false;

  creditTipsInput!: number;
  cashTipsInput!: number;
  tipoutInput!: number;
  dateInput!: string;
  hoursWorkedInput?: number;

  constructor(private shiftService: ShiftService) { }

  //Use ngOnInit here because we can't access this.shift() in constructor
  ngOnInit() {
    // we are adding a new shift if we don't get a Shift object as an input
    this.addingShift = this.shift() === undefined;

    if (!this.addingShift) {
      // we're editing an existing shift; so, set inputs
      this.creditTipsInput = this.shift()!.creditTips;
      this.cashTipsInput = this.shift()!.cashTips;
      this.tipoutInput = this.shift()!.tipout;
      this.dateInput = this.shift()!.date;
      this.hoursWorkedInput = this.shift()!.hoursWorked;
    }
  }

  onCancel() {
    this.close.emit();
  }

  onSubmit() {
    if (this.addingShift) {
      this.shiftService.addShift({
        date: this.dateInput,
        creditTips: this.creditTipsInput,
        cashTips: this.cashTipsInput,
        tipout: this.tipoutInput,
        hoursWorked: this.hoursWorkedInput !== undefined && this.hoursWorkedInput > 0 ? this.hoursWorkedInput : undefined
      });
    }
    else {
      this.shiftService.editShift(this.shift()!.id, {
        creditTips: this.creditTipsInput,
        cashTips: this.cashTipsInput,
        tipout: this.tipoutInput,
        date: this.dateInput,
        hoursWorked: this.hoursWorkedInput
      });
    }
    this.close.emit();
  }
}
