import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ShiftService } from '../../shift.service';
import { CardComponent } from '../../shared/card/card.component';

@Component({
  selector: 'app-add-shift',
  standalone: true,
  imports: [FormsModule, CardComponent],
  templateUrl: './add-shift.component.html',
  styleUrl: './add-shift.component.css'
})
export class AddShiftComponent {
  creditTipsInput = 0;
  cashTipsInput = 0;
  tipoutInput = 0;
  dateInput = '';
  hoursWorkedInput?: number;

  onCancel() {
    this.resetInputs();
  }

  constructor(private shiftService: ShiftService) {}

  onSubmit() {
    this.shiftService.addShift({
      date: this.dateInput,
      creditTips: this.creditTipsInput,
      cashTips: this.cashTipsInput,
      tipout: this.tipoutInput,
      hoursWorked: this.hoursWorkedInput !== undefined && this.hoursWorkedInput > 0 ? this.hoursWorkedInput : undefined
    });

    this.resetInputs();
  }

  private resetInputs() {
    this.cashTipsInput = this.creditTipsInput = this.tipoutInput = 0;
    this.dateInput = '';
    this.hoursWorkedInput = undefined;
  }
}

