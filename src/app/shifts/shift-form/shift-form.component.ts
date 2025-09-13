import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShiftFormModel } from './shift-form.model';

// PrimeNG imports
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
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
    @Input() creditTipsInput!: number;
    @Input() cashTipsInput!: number;
    @Input() tipoutInput!: number;
    @Input() hoursWorkedInput?: number;
    @Input() title!: string;

    @Output() submitted = new EventEmitter<ShiftFormModel>();
    @Output() cancel = new EventEmitter<void>();
    
    visible = true; // Dialog visibility

    onSubmit() {
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
