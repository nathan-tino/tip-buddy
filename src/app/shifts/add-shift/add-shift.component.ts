import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddShiftModel } from './add-shift.model';

@Component({
  selector: 'app-add-shift',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-shift.component.html',
  styleUrl: './add-shift.component.css'
})
export class AddShiftComponent {
  enteredCreditTips = 0;
  enteredCashTips = 0;
  enteredTipout = 0;
  enteredDate = '';
  hoursWorked?: number;

  newShift = output<AddShiftModel>();

  onCancel() {
    this.resetInputs();
  }

  onSubmit() {
    this.newShift.emit({
      date: this.enteredDate,
      creditTips: this.enteredCreditTips,
      cashTips: this.enteredCashTips,
      tipout: this.enteredTipout,
      //TODO: negative numbers shouldn't be allowed on input
      hoursWorked: this.hoursWorked !== undefined && this.hoursWorked > 0 ? this.hoursWorked : undefined
    });

    this.resetInputs();
  }

  private resetInputs() {
    this.enteredCashTips = this.enteredCreditTips = this.enteredTipout = 0;
    this.enteredDate = '';
    this.hoursWorked = undefined;
  }
}

