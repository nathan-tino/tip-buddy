import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/card/card.component';
import { ShiftFormModel } from './shift-form.model';

@Component({
    selector: 'app-shift-form',
    standalone: true,
    imports: [FormsModule, CardComponent],
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

    @Output() submitted = new EventEmitter<ShiftFormModel>();

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
    @Output() cancel = new EventEmitter<void>();
}
