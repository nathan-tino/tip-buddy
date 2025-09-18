import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GetShiftDto } from '../../dtos/get-shift.dto';
import { ShiftService } from '../../services/shift.service';
import { DateService } from '../../services/date.service';
import { ShiftFormComponent } from '../shift-form/shift-form.component';
import { CreateShiftDto } from '../../dtos/create-shift.dto';
import { ShiftFormModel } from '../shift-form/shift-form.model';

@Component({
    selector: 'app-add-shift',
    standalone: true,
    imports: [FormsModule, ShiftFormComponent],
    template: `
    <app-shift-form
      [title]="'Add Shift'"
      [dateInput]="dateInput"
      [hoursWorkedInput]="hoursWorkedInput"
      (submitted)="onSubmit($event)"
      (cancel)="onCancel()"
    ></app-shift-form>
  `,
    styleUrls: ['./add-shift.component.css']
})
export class AddShiftComponent implements OnInit {
    @Output() close = new EventEmitter<GetShiftDto | undefined>();
    @Input() shiftDate: Date | undefined;

    dateInput!: Date;
    hoursWorkedInput?: number;

    constructor(private shiftService: ShiftService, private dateService: DateService) { }

    ngOnInit() {
        const dateValue = this.shiftDate;
        if (dateValue) {
            // We don't need to worry about timezone here because dateValue is generated on the client side
            this.dateInput = new Date(dateValue);
        }
        this.hoursWorkedInput = undefined;
    }

    onCancel() {
        this.close.emit(undefined);
    }

    onSubmit(shift: ShiftFormModel) {
        const newShift: CreateShiftDto = {
            creditTips: shift.creditTips ?? 0,
            cashTips: shift.cashTips ?? 0,
            tipout: shift.tipout ?? 0,
            date: this.dateService.convertDateObjectsToUtcDate(shift.date, shift.time),
            hoursWorked: shift.hoursWorked
        };

        this.shiftService.addShift(newShift)
            .subscribe({
                next: (created: GetShiftDto) => {
                    this.close.emit(created);
                },
                error: (e) => console.error(e)
            });
    }
}