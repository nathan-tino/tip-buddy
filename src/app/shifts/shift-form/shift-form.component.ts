import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShiftFormModel } from './shift-form.model';
import { DateService } from '../../services/date.service';

// PrimeNG imports
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
    selector: 'app-shift-form',
    standalone: true,
    imports: [
        FormsModule, 
        DialogModule,
        ButtonModule,
        DatePickerModule,
        InputMaskModule,
        InputTextModule,
        InputNumberModule,
        FloatLabelModule
    ],
    templateUrl: './shift-form.component.html',
    styleUrl: './shift-form.component.css'
})
export class ShiftFormComponent {
    @Input() dateInput!: string;
    @Input() timeInput?: string | undefined;
    @Input() creditTipsInput: number | undefined = undefined;
    @Input() cashTipsInput: number | undefined = undefined;
    @Input() tipoutInput: number | undefined = undefined;
    @Input() hoursWorkedInput: number | undefined = undefined;
    @Input() title: string = '';

    @Output() submitted = new EventEmitter<ShiftFormModel>();
    @Output() cancel = new EventEmitter<void>();
    
    visible = true; // Dialog visibility

    constructor(private dateService: DateService) { }

    onSubmit() {
        if (!this.dateInput) {
            // Date is required; you might want to show an error message here
            return;
        }

        this.submitted.emit({
            date: this.dateInput,
            time: this.timeInput,
            creditTips: this.creditTipsInput,
            cashTips: this.cashTipsInput,
            tipout: this.tipoutInput,
            hoursWorked: this.hoursWorkedInput
        });
    }

    onCancel() {
        this.visible = false;
        this.cancel.emit();
    }
}
