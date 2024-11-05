import { Component, input, output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GetShiftDto } from '../../dtos/get-shift.dto';
import { ShiftService } from '../../services/shift.service';
import { CardComponent } from "../../shared/card/card.component";
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-edit-shift',
  standalone: true,
  imports: [FormsModule, CardComponent],
  templateUrl: './add-edit-shift.component.html',
  styleUrl: './add-edit-shift.component.css'
})
export class AddEditShiftComponent {
  shift = input<GetShiftDto>();
  date = input<Date | undefined>();
  close = output<GetShiftDto | undefined>();
  addingShift = false;

  creditTipsInput!: number;
  cashTipsInput!: number;
  tipoutInput!: number;
  dateInput!: string;
  hoursWorkedInput?: number;

  constructor(private shiftService: ShiftService, private dateService: DateService) { }

  //Use ngOnInit here because we can't access this.shift() in constructor
  ngOnInit() {
    // we are adding a new shift if we don't get a Shift object as an input
    this.addingShift = this.shift() === undefined;

    if (!this.addingShift) {
      //TODO: shift.date is not coming through correctly.
      //need to figure out a way to receive dates automatically from the API
      const dateValue = new Date(this.shift()!.date);

      // we're editing an existing shift; so, set inputs
      this.creditTipsInput = this.shift()!.creditTips;
      this.cashTipsInput = this.shift()!.cashTips;
      this.tipoutInput = this.shift()!.tipout;
      this.dateInput = dateValue.toISOString().slice(0, 10);
      this.hoursWorkedInput = this.shift()!.hoursWorked;
    }
    else if (this.date()) {
      this.dateInput = this.date()!.toLocaleDateString('en-CA');
    }
  }

  onCancel() {
    this.close.emit(undefined);
  }

  onSubmit() {
    let shift: GetShiftDto | undefined = undefined;

    if (this.addingShift) {
      const dateInputWithTime = this.dateInput + 'T08:00:00';

      this.shiftService.addShift({
        date: this.dateService.convertStringToUtcDate(dateInputWithTime)!,
        creditTips: this.creditTipsInput,
        cashTips: this.cashTipsInput,
        tipout: this.tipoutInput,
        hoursWorked: this.hoursWorkedInput !== undefined && this.hoursWorkedInput > 0 ? this.hoursWorkedInput : undefined
      }).subscribe({
        next: (response) => { 
          shift = response;
          console.log('Shift added successfully: ', shift)
        },
        error: (e) => console.error(e),
        complete: () => {
          this.close.emit(shift);
          console.info('complete')
        }
      });
    }
    else {
      const updatedShift = {
        id: this.shift()!.id,
        creditTips: this.creditTipsInput,
        cashTips: this.cashTipsInput,
        tipout: this.tipoutInput,
        date: new Date(this.dateInput),
        hoursWorked: this.hoursWorkedInput
      };
      this.shiftService.editShift(this.shift()!.id, updatedShift)
      .subscribe({
        next: (response) => { 
          shift = updatedShift; 
          console.log('Shift updated successfully: ', response) 
        },
        error: (e) => console.error(e),
        complete: () => {
          this.close.emit(shift);
          console.info('complete')
        }
      });
    }
  }
}
