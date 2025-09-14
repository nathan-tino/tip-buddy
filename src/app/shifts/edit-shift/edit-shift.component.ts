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

	dateInput!: Date;
	timeInput!: Date;

	constructor(private shiftService: ShiftService, private dateService: DateService) { }

	ngOnInit() {
        if (this.shift) {
            // Convert UTC date to local date for display (date part only)
            this.dateInput = new Date(this.shift.date.getUTCFullYear(), this.shift.date.getUTCMonth(), this.shift.date.getUTCDate());
            // Create a time object using UTC time components from the shift
            this.timeInput = new Date();
            this.timeInput.setHours(this.shift.date.getUTCHours(), this.shift.date.getUTCMinutes(), 0, 0);
        }
    }

	onCancel() {
		this.close.emit(undefined);
	}

	onSubmit(shift: ShiftFormModel) {
		const updatedShift = {
			id: this.shift.id,
			creditTips: shift.creditTips ?? 0,
			cashTips: shift.cashTips ?? 0,
			tipout: shift.tipout ?? 0,
			date: this.dateService.convertDateObjectsToUtcDate(shift.date, shift.time),
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
